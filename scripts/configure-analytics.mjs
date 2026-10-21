// Print the GA4 configuration plan by default. --apply reconciles only the
// resources managed here; it never changes the property's primary channel group.
// Requires an OAuth token with analytics.edit scope in GA_ADMIN_ACCESS_TOKEN.
import fs from 'node:fs'
import { pathToFileURL } from 'node:url'

export const desiredDimensions = [
  { parameterName: 'distribution_channel', displayName: 'Distribution channel', scope: 'EVENT' },
  { parameterName: 'distribution_surface', displayName: 'Distribution surface', scope: 'EVENT' },
  { parameterName: 'form', displayName: 'Lead form', scope: 'EVENT' },
  { parameterName: 'locale', displayName: 'Site language', scope: 'EVENT' },
]

// Match source/medium without changing historical campaign taxonomy.
export function poweredByRule() {
  return { displayName: 'Powered by Relvo', expression: { andGroup: { filterExpressions: [
    { orGroup: { filterExpressions: [{ filter: { fieldName: 'source', stringFilter: { matchType: 'EXACT', value: 'prefactura' } } }] } },
    { orGroup: { filterExpressions: [{ filter: { fieldName: 'medium', stringFilter: { matchType: 'EXACT', value: 'pdf' } } }] } },
  ] } } }
}

export async function configureAnalytics({ propertyId, token, apply = false, request = fetch }) {
  if (!/^\d+$/.test(propertyId)) throw new Error('GA_PROPERTY_ID must be the numeric property ID, not the G- measurement ID')
  if (!token) throw new Error('GA_ADMIN_ACCESS_TOKEN is required to inspect existing configuration')
  const parent = `properties/${propertyId}`
  const changes = []
  async function api(version, resource, method = 'GET', body) {
    const response = await request(`https://analyticsadmin.googleapis.com/${version}/${resource}`, {
      method, headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      ...(body ? { body: JSON.stringify(body) } : {}), signal: AbortSignal.timeout(10000),
    })
    if (!response.ok) throw new Error(`GA Admin ${method} failed (${response.status})`)
    return response.json()
  }
  async function list(version, resource, key) {
    const all = []; let pageToken
    do {
      const result = await api(version, `${parent}/${resource}?pageSize=200${pageToken ? `&pageToken=${encodeURIComponent(pageToken)}` : ''}`)
      all.push(...(result[key] ?? [])); pageToken = result.nextPageToken
    } while (pageToken)
    return all
  }
  const keyEvents = await list('v1beta', 'keyEvents', 'keyEvents')
  if (!keyEvents.some((event) => event.eventName === 'generate_lead')) {
    const body = { eventName: 'generate_lead', countingMethod: 'ONCE_PER_EVENT' }
    changes.push({ resource: 'keyEvents', body })
    if (apply) await api('v1beta', `${parent}/keyEvents`, 'POST', body)
  }
  const dimensions = await list('v1beta', 'customDimensions', 'customDimensions')
  for (const dimension of desiredDimensions) {
    if (dimensions.some((existing) => existing.parameterName === dimension.parameterName && existing.scope === dimension.scope)) continue
    changes.push({ resource: 'customDimensions', body: dimension })
    if (apply) await api('v1beta', `${parent}/customDimensions`, 'POST', dimension)
  }
  const groups = await list('v1alpha', 'channelGroups', 'channelGroups')
  const defaultGroup = groups.find((group) => group.systemDefined)
  if (!defaultGroup) throw new Error('Default channel group missing; refusing to replace other traffic classification')
  const displayName = 'Relvo distribution'
  const existing = groups.find((group) => group.displayName === displayName && !group.systemDefined)
  const body = { displayName, description: 'Default channels plus Powered by Relvo PDF distribution.', groupingRule: [poweredByRule(), ...defaultGroup.groupingRule] }
  if (!existing || JSON.stringify(existing.groupingRule) !== JSON.stringify(body.groupingRule)) {
    changes.push({ resource: 'channelGroups', body })
    if (apply) await api('v1alpha', existing ? `${existing.name}?updateMask=displayName,description,groupingRule` : `${parent}/channelGroups`, existing ? 'PATCH' : 'POST', body)
  }
  return { property: parent, mode: apply ? 'apply' : 'plan', changes }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const result = await configureAnalytics({ propertyId: process.env.GA_PROPERTY_ID ?? '', token: process.env.GA_ADMIN_ACCESS_TOKEN, apply: process.argv.includes('--apply') })
  const output = JSON.stringify(result, null, 2)
  const outputIndex = process.argv.indexOf('--output')
  if (outputIndex !== -1) fs.writeFileSync(process.argv[outputIndex + 1], output + '\n')
  else console.log(output)
}
