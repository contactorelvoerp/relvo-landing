-- Expand first, then deploy: old form inserts/webhooks continue working, and an
-- app rollback remains compatible. This changes no existing lead values.
BEGIN;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS attribution jsonb NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS submission_id uuid;
CREATE UNIQUE INDEX IF NOT EXISTS leads_submission_id_key ON public.leads(submission_id);

CREATE TABLE IF NOT EXISTS public.distribution_events (
  reference text NOT NULL CHECK (reference ~ '^v1\.[a-f0-9]{64}$'),
  visitor_id uuid NOT NULL,
  event_name text NOT NULL CHECK (event_name IN ('powered_by_landing', 'powered_by_demo_click', 'powered_by_form_start')),
  recorded_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (reference, visitor_id, event_name)
);
CREATE INDEX IF NOT EXISTS distribution_events_recorded_at_idx ON public.distribution_events(recorded_at);
CREATE TABLE IF NOT EXISTS public.distribution_outcomes (
  event_id text PRIMARY KEY,
  submission_id uuid NOT NULL REFERENCES public.leads(submission_id),
  stage text NOT NULL CHECK (stage IN ('qualified_lead', 'demo_booked', 'customer')),
  customer_reference text UNIQUE,
  revenue_amount numeric(20,6),
  currency text,
  recorded_at timestamptz NOT NULL DEFAULT now(),
  CHECK ((revenue_amount IS NULL AND currency IS NULL) OR
         (stage = 'customer' AND revenue_amount IS NOT NULL AND currency IS NOT NULL AND revenue_amount >= 0 AND currency ~ '^[A-Z]{3}$')),
  CHECK ((stage = 'customer' AND customer_reference IS NOT NULL) OR (stage <> 'customer' AND customer_reference IS NULL)),
  UNIQUE (submission_id, stage)
);
-- Anonymous browser keys cannot read or write recipient-level attribution.
ALTER TABLE public.distribution_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.distribution_outcomes ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.distribution_events, public.distribution_outcomes FROM anon, authenticated;
GRANT SELECT, INSERT ON public.distribution_events, public.distribution_outcomes TO service_role;
COMMIT;
