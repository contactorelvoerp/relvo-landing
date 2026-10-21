-- Run with a server-side role. References join to the backend's organization-
-- scoped artifact inventory; they are not document access credentials.
-- Count distinct leads by first and last touch separately; never add both.
-- Events are deduplicated sessions per reference, not PDF impressions.
WITH touches AS (
  SELECT 'first_touch' AS model UNION ALL SELECT 'last_touch'
), reference_set AS (
  SELECT reference FROM public.distribution_events
  UNION
  SELECT attribution->model->>'reference'
  FROM public.leads CROSS JOIN touches
  WHERE attribution->model->>'reference' ~ '^v1\.[a-f0-9]{64}$'
), events AS (
  SELECT reference,
    count(*) FILTER (WHERE event_name = 'powered_by_landing') AS landing_sessions,
    count(*) FILTER (WHERE event_name = 'powered_by_demo_click') AS demo_click_sessions,
    count(*) FILTER (WHERE event_name = 'powered_by_form_start') AS form_start_sessions
  FROM public.distribution_events GROUP BY reference
), leads AS (
  SELECT model, attribution->model->>'reference' AS reference, submission_id
  FROM public.leads CROSS JOIN touches
  WHERE attribution->model->>'reference' ~ '^v1\.[a-f0-9]{64}$'
), conversions AS (
  SELECT model, reference, count(DISTINCT leads.submission_id) AS submitted_leads,
    count(DISTINCT leads.submission_id) FILTER (WHERE stage = 'qualified_lead') AS qualified_leads,
    count(DISTINCT leads.submission_id) FILTER (WHERE stage = 'demo_booked') AS booked_demos,
    count(DISTINCT leads.submission_id) FILTER (WHERE stage = 'customer') AS customers
  FROM leads LEFT JOIN public.distribution_outcomes USING (submission_id)
  GROUP BY model, reference
)
SELECT touches.model, reference_set.reference,
  coalesce(landing_sessions, 0) AS landing_sessions,
  coalesce(demo_click_sessions, 0) AS demo_click_sessions,
  coalesce(form_start_sessions, 0) AS form_start_sessions,
  coalesce(submitted_leads, 0) AS submitted_leads,
  coalesce(qualified_leads, 0) AS qualified_leads,
  coalesce(booked_demos, 0) AS booked_demos,
  coalesce(customers, 0) AS customers
FROM reference_set CROSS JOIN touches
LEFT JOIN events USING (reference)
LEFT JOIN conversions USING (reference, model)
ORDER BY model, reference;

-- Revenue is separate per currency; summing CLP and USD would invent a total.
SELECT model, attribution->model->>'reference' AS reference, currency,
       sum(revenue_amount) AS attributed_customer_revenue
FROM public.distribution_outcomes
JOIN public.leads USING (submission_id)
CROSS JOIN (VALUES ('first_touch'), ('last_touch')) AS touches(model)
WHERE stage = 'customer' AND currency IS NOT NULL
  AND attribution->model->>'reference' ~ '^v1\.[a-f0-9]{64}$'
GROUP BY model, reference, currency;
