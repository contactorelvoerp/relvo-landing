-- Lead cohort by creation week (UTC), source and latest explicit campaign.
-- Run with a server-side role. Outcomes can mature after the cohort week.
-- Each lead is counted once, even when it has several outcomes. A company is
-- acquired once via the globally unique customer_reference in outcomes.
-- Untagged visits are unattributed here: the CRM does not store organic
-- referrers. Use GA4 for acquisition channels; do not label unknown as direct.
WITH cohort AS (
  SELECT *, coalesce(nullif(attribution->'last_touch', 'null'::jsonb), attribution->'ads_click') AS campaign_touch
  FROM public.leads WHERE submission_id IS NOT NULL
)
SELECT date_trunc('week', l.created_at AT TIME ZONE 'UTC')::date AS cohort_week,
       l.fuente,
       coalesce(l.campaign_touch->>'utm_source', '(unattributed)') AS source,
       coalesce(l.campaign_touch->>'utm_medium', '(not set)') AS medium,
       coalesce(l.campaign_touch->>'utm_campaign', '(not set)') AS campaign,
       count(DISTINCT l.submission_id) AS leads,
       count(DISTINCT l.submission_id) FILTER (WHERE o.stage = 'qualified_lead') AS qualified_leads,
       count(DISTINCT l.submission_id) FILTER (WHERE o.stage = 'demo_booked') AS booked_demos,
       count(DISTINCT o.customer_reference) FILTER (WHERE o.stage = 'customer') AS customers
FROM cohort l
LEFT JOIN public.distribution_outcomes o USING (submission_id)
GROUP BY 1, 2, 3, 4, 5
ORDER BY cohort_week DESC, leads DESC;

-- Acquisition value: separate currencies, never combine USD and CLP.
WITH cohort AS (
  SELECT *, coalesce(nullif(attribution->'last_touch', 'null'::jsonb), attribution->'ads_click') AS campaign_touch
  FROM public.leads WHERE submission_id IS NOT NULL
)
SELECT date_trunc('week', l.created_at AT TIME ZONE 'UTC')::date AS cohort_week,
       l.fuente,
       coalesce(l.campaign_touch->>'utm_campaign', '(not set)') AS campaign,
       o.currency,
       sum(o.revenue_amount) AS acquisition_value
FROM cohort l
JOIN public.distribution_outcomes o USING (submission_id)
WHERE o.stage = 'customer' AND o.revenue_amount IS NOT NULL AND o.currency IS NOT NULL
GROUP BY 1, 2, 3, 4
ORDER BY cohort_week DESC, campaign, currency;
