-- Optional phone for the Google Ads landing's enhanced-conversions field
-- (src/components/LeadForm.jsx). Expand first: nullable, no default, no existing row changes.
BEGIN;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS telefono text;
COMMIT;
