// Disposable PostgreSQL only; never connects to a configured local/prod database.
import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import { randomUUID } from 'node:crypto'

const name = `relvo-distribution-test-${randomUUID()}`
function docker(args, input) {
  const result = spawnSync('docker', args, { encoding: 'utf8', input })
  if (result.status !== 0) throw new Error(result.stderr || `docker exited ${result.status}`)
  return result.stdout
}
const migration = fs.readFileSync(new URL('../supabase/migrations/202610210001_distribution_attribution.sql', import.meta.url), 'utf8')
const report = fs.readFileSync(new URL('../supabase/distribution-funnel.sql', import.meta.url), 'utf8')
try {
  docker(['run', '--rm', '-d', '--network', 'none', '--name', name, '-e', 'POSTGRES_PASSWORD=disposable-test-only', 'postgres:16-alpine'])
  let ready = false
  for (let attempt = 0; attempt < 30; attempt += 1) {
    if (spawnSync('docker', ['exec', name, 'pg_isready', '-U', 'postgres']).status === 0) { ready = true; break }
    await new Promise((resolve) => setTimeout(resolve, 300))
  }
  if (!ready) throw new Error('Disposable PostgreSQL did not become ready')
  const sql = `CREATE ROLE anon; CREATE ROLE authenticated; CREATE ROLE service_role BYPASSRLS;
CREATE TABLE public.leads (id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY, nombre text, email text, empresa text, cargo text, problema text, url_origen text, fuente text);
INSERT INTO public.leads(nombre) VALUES ('old app before expand');
${migration}
${migration}
INSERT INTO public.leads(nombre) VALUES ('old app after expand and app rollback');
DO $test$
DECLARE ref text := 'v1.' || repeat('a',64); sid uuid := 'c4dc7f9c-3daa-4d7d-a287-c00865ccefb1';
BEGIN
  FOR i IN 1..2 LOOP
    INSERT INTO public.leads(nombre, submission_id, attribution) VALUES ('new app',sid,jsonb_build_object('first_touch',jsonb_build_object('reference',ref),'last_touch',jsonb_build_object('reference',ref))) ON CONFLICT(submission_id) DO NOTHING;
    INSERT INTO public.distribution_events(reference,visitor_id,event_name) VALUES (ref,sid,'powered_by_landing') ON CONFLICT DO NOTHING;
    INSERT INTO public.distribution_outcomes(event_id,submission_id,stage,customer_reference,revenue_amount,currency) VALUES ('crm:'||i,sid,'customer','attio:company:1','123.450000','USD') ON CONFLICT(customer_reference) DO NOTHING;
  END LOOP;
  IF (SELECT count(*) FROM public.leads) <> 3 THEN RAISE EXCEPTION 'lead retry duplicated'; END IF;
  IF (SELECT count(*) FROM public.distribution_events) <> 1 THEN RAISE EXCEPTION 'event retry duplicated'; END IF;
  IF (SELECT count(*) FROM public.distribution_outcomes) <> 1 THEN RAISE EXCEPTION 'outcome retry duplicated'; END IF;
  IF (SELECT revenue_amount FROM public.distribution_outcomes) <> 123.450000 THEN RAISE EXCEPTION 'revenue changed'; END IF;
  BEGIN
    INSERT INTO public.distribution_outcomes(event_id,submission_id,stage,revenue_amount) VALUES ('bad',sid,'demo_booked',1);
    RAISE EXCEPTION 'partial revenue accepted';
  EXCEPTION WHEN check_violation THEN NULL; END;
  IF has_table_privilege('anon','public.distribution_events','SELECT') OR has_table_privilege('authenticated','public.distribution_events','INSERT') THEN RAISE EXCEPTION 'public events access'; END IF;
  IF has_table_privilege('anon','public.distribution_outcomes','INSERT') THEN RAISE EXCEPTION 'public conversion access'; END IF;
END $test$;
${report}`
  const output = docker(['exec', '-i', name, 'psql', '-U', 'postgres', '-v', 'ON_ERROR_STOP=1'], sql)
  console.log(output)
  console.log('check-distribution-schema: expand/rollback compatibility, idempotency, exact revenue, access restrictions and report SQL passed')
} finally {
  spawnSync('docker', ['rm', '-f', name], { stdio: 'ignore' })
}
