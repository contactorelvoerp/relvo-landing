# Building a useful B2B pricing page

A pricing page should help a buyer understand the cost, choose the right package and take a predictable next step. Relvo's pricing page applies that approach to a shared feature set with different contract, legal-entity and country allowances. The page is implemented in Spanish and English at `/precios` and `/en/pricing`.

The goal is qualified enquiries and eventual customers. More clicks or submissions alone do not demonstrate a better page.

## Start with the commercial model

Before designing cards, write down the actual offer. Separate confirmed terms from decisions that still need an owner. Visual polish cannot resolve an unclear eligibility rule.

For every plan, establish:

- Who it serves and what triggers a move to another plan.
- Amount, currency, billing period and minimum commitment.
- The unit being priced and how that unit is counted.
- Included capabilities, limits, overages and add-ons.
- Payment-processing fees, taxes and implementation charges.
- Onboarding, cancellation, support and what happens after the visitor enquires.

Do not infer a free trial, discount, fee waiver, unlimited allowance or cancellation policy from a competitor. Publish a starting price only when that offer is available. A monthly price does not by itself establish monthly cancellation or the absence of an annual commitment.

### Relvo commercial facts and open decisions

| Topic | Current implementation |
| --- | --- |
| Startup price | USD 299 per month |
| Startup limits | Up to 50 active contracts, one legal entity, one country |
| Custom price | Quote based on contract volume; no fabricated starting price |
| Custom limits | Preserves the published more-than-50-contracts wording and multiple entities/countries |
| Pricing unit | A contract means a customer's active billing rules; card subscriptions also count |
| Payment gateways | Stripe, Toku or Fintoc process payments; Relvo handles plans, invoicing and reconciliation |
| Upgrading | Customers, plans and history are retained |
| Feature access | Shared across both plans; compare the published capacity limits |
| Taxes, Relvo's charge currency, gateway fee treatment, onboarding fees and commitment | Do not invent answers. Resolve with the commercial owner before publishing a policy |

Keep the existing Startup name until a product naming change is agreed. Descriptive text explains the billing model without implying that only newly founded companies can use the plan.

## Design the decision before the decoration

Use the page's first screen to explain the offer and make the available choices apparent. The hierarchy is product outcome, pricing basis, plan comparison and next step.

Relvo uses this sequence:

1. A compact headline and one short sentence introducing the choice.
2. Two plan cards with aligned prices, limits and actions.
3. A help link for visitors unsure which capacity fits.
4. A compact TGP result with its original growth context and a case-study link.
5. A short FAQ covering the contract unit, upgrade continuity and payment gateway.
6. A compact scheduling invitation with email contact as a secondary action.

On mobile, two compact anchor summaries appear before the detailed cards. A visitor can discover both choices without first scrolling through the entire Startup plan. Both cards remain available in the document; there is no horizontal carousel or hidden alternate offer.

### Card anatomy

Keep the order consistent across plans:

1. Plan name.
2. Short description of its billing model.
3. Price and period, followed by a commercial explanation.
4. Comparable limits with visible units.
5. A specific action.
Shared capabilities appear once below the cards, under an explicit heading identifying them as included in both plans.

Use consistent rows to make comparison possible. Differences should be explicit rather than inferred from unrelated feature lists. When the product owner confirms that capabilities are shared, list them once and compare the allowances directly.

Keep units visible beside the numbers. Relvo labels the limit as active contracts and keeps the full definition in the first collapsed FAQ.

## Write for the buyer's question

A useful headline explains what the buyer gets. The supporting sentence explains why the packages differ. Avoid making the headline a claim that the rest of the page cannot substantiate, such as "no hidden fees" while fee policies remain undecided.

Use familiar language: "revenue recognition" rather than "Rev Rec," "legal entities" rather than unexplained internal terms. Translate the buying task, including limits, forms, validation, success states and button labels. Preserve amounts and allowances between languages.

Relvo's heading is "Tu facturación y cobranza, en un solo plan" / "Your billing and collections, in one plan." The supporting sentence introduces the choice; the cards carry the amounts and the complexity served by each plan. The plan summaries identify contract capacity; their feature set appears in one shared section.

Custom's price remains "Hablemos" / "Let's talk." A visible note explains that the quote is based on contract volume, making the next conversation more concrete without inventing a rate.

## Make the next step predictable

Use action labels that describe the action the interface actually provides:

| Interface | Suitable label |
| --- | --- |
| Appointment calendar | Schedule a demo |
| Form requesting follow-up | Request a demo |
| Form requesting a quote | Request a proposal |
| Available account creation | Create an account |

Relvo’s Startup button opens scheduling with the Startup plan carried in the URL. Custom opens the email alternative on the same demo page with Custom and proposal intent carried forward. The selected plan is displayed as context, without asking the visitor to choose it again. Both languages offer the same calendar and collapsible email alternative. The pricing footer uses a compact booking button and a secondary email link.

Do not treat an enquiry as a booked meeting. Keep those conversion events distinct. A plan click should never fire a lead or booking conversion.

For same-page actions, preserve a real anchor fallback. After an ordinary click, update context, scroll to the destination and move keyboard focus to its heading. Respect reduced-motion settings. Modified clicks should retain native browser behavior.

## Ask only for useful information

The shared email form requires name, work email and company, with one optional message. It uses a single column on demo, campaign and referral pages. Job title, telephone, billing-method and repeated plan-selection questions are omitted. Email contact remains collapsed on desktop and mobile unless the visitor follows an explicit contact or proposal link.

Use visible labels, browser autofill, a single column, clear optional markers, specific validation messages and focus on the first invalid field. Keep entered details if the visitor changes plans or a request fails. Explain the next step after success.

The existing lead API requires `cargo`. The shared form supplies the established neutral value `Otro`; it does not pretend that the visitor selected a job title. Plan, request intent and the optional message are stored as context in the existing `problema` field. Calendar bookings carry plan and intent as metadata, and the webhook retains that context with the lead. No database migration is required.

Preserve attribution, honeypot and Turnstile behavior, submission identifiers and retry semantics. Test the outgoing payload using an intercepted local request; never create real sales leads as part of browser QA.

## Place proof where uncertainty appears

Put a relevant result after the comparison and before the request. Use an identified customer and the context required to interpret the number. A full testimonial is optional when a compact result and a link provide enough evidence.

Relvo reuses the existing TGP result: 70% less operational time while operations grew 30% in three months. It is not presented as a guaranteed saving for every buyer. The result comes from the existing homepage copy; the full customer story is available through the case-study link. The English case-study link is marked as Spanish because the full case page remains Spanish.

Do not substitute fictional product-screen data for customer evidence. Avoid unsupported customer counts, partner endorsements, savings guarantees and "most popular" badges.

## Use a restrained visual system

Relvo retains Instrument Sans, its official TGP asset, teal actions, mint proof and existing spacing and radius tokens. Green identifies the contact section. Large numbers support the price and the customer result; typography and space establish hierarchy.

Avoid gradients, animated decorations around prices, arbitrary urgency and unnecessary illustrations. Keep full-width touch targets in the cards. Let content determine card height and verify both languages rather than relying on a fixed text length.

Do not add a billing toggle without a real alternate billing offer. Do not add a pricing calculator without a formula that can produce a valid estimate. A selector that only changes a marketing number can mislead buyers.

## Measure the buying journey

The implementation emits `pricing_plan_select` when a visitor follows a plan CTA, using bounded `plan`, `intent` and `locale` dimensions. The existing confirmed `generate_lead` event includes pricing plan and intent. No form values or personal details belong in analytics.

Assess the funnel as:

- Pricing visitors to plan selections.
- Pricing visitors to recorded enquiries.
- Enquiries to qualified opportunities and booked meetings.
- Qualified opportunities to paying customers.

Segment by locale, device and selected plan where traffic supports it. Use the CRM to determine qualification. Do not count an increase in low-quality submissions as an improvement. Browser QA establishes behavior, not conversion lift.

Test one meaningful hypothesis at a time. Examples: whether the compact mobile summary improves Custom discovery, or whether the shorter form improves qualified enquiry rate without reducing lead quality. Choose duration and sample requirements from actual traffic and baseline conversion; do not promise uplift percentages.

## Validate before shipping

Check Spanish and English at 320, 390, 768 and 1440 pixels. Verify no horizontal overflow, understandable wrapping, visible labels, keyboard navigation, reduced motion and comfortable touch targets.

Exercise both plan actions, the undecided path, preserved context, empty/invalid submissions, successful requests, server failures and retries. Verify calendar-load fallback and duplicate booking callbacks. Let the calendar resize to show every time slot and booking field on mobile. Confirm that the payload keeps attribution and selected intent. Intercept requests during automated tests.

Validate one H1, unique page metadata, canonical URLs, reciprocal hreflang, sitemap entries, Open Graph assets and working internal links. FAQ structured data must match the visible answered questions. Unresolved preview-only questions stay out of production and out of FAQ structured data.

Run the repository build, relevant browser tests, link and structured-data checks, unused-code analysis and the design gate. Measure accessibility and performance in a production-like build; report actual scores and any limitations rather than assuming the redesign passes.

## References

These pages provide observable examples and usability guidance, rather than evidence that copying their layouts will improve Relvo's conversion rate. Reviewed November 11, 2026.

- [Stripe Billing pricing](https://stripe.com/billing/pricing): makes the billing unit, plan commitment and additional-volume terms explicit.
- [Linear pricing](https://linear.app/pricing): uses repeated plan structure and explicit feature differences to support comparison.
- [Paddle pricing](https://www.paddle.com/pricing): separates standard and custom offers and explains their intended buyers.
- [Lago pricing](https://getlago.com/pricing): distinguishes minimum commitments, processed billings and event charges.
- [Nielsen Norman Group form recommendations](https://www.nngroup.com/articles/web-form-design/): recommends removing unnecessary fields, keeping visible labels and using a coherent single-column sequence.

## Implementation map

| File | Responsibility |
| --- | --- |
| `src/pages/pricing/copy.js` | Spanish and English pricing copy, plan IDs and request intents |
| `src/pages/pricing/PricingPage.jsx` | Comparison, mobile summaries, proof, FAQ and contextual booking links |
| `src/pages/pricing/pricing.css` | Scoped responsive presentation |
| `src/components/LeadForm.jsx` | Shared email form, validation, lead payload and confirmed enquiry conversion |
| `tests/browser/language.spec.js` | Localized navigation and page switching |
| `tests/browser/pricing.spec.js` | Pricing interactions and intercepted lead submission checks |

The user authorized the pricing redesign and copy revisions. That authorization supersedes the older exact-copy requirement in `CLAUDE.md` for this page. Existing prices, limits and supported capabilities remain the commercial baseline.

## Validation record before copy simplification

The implementation was verified on November 11, 2026 using an isolated source snapshot because other work was changing the shared build directory. All 29 browser tests and 35 unit tests passed. Production build, internal links, visible FAQ and structured-data parity, band rules, unused-code analysis and the design gate passed. Browser coverage includes Spanish and English, widths of 320, 390, 768 and 1440 pixels, reduced motion, keyboard focus, validation, preserved input, plan changes, request context and retry identity.

Mobile Lighthouse 12.8.2 used a compressed Vite production preview, simulated mobile throttling and the third-party exclusions already specified in `lighthouserc.json`: Google Tag Manager, Apollo, Cal and Turnstile. One run was collected per language.

| Metric | Spanish | English |
| --- | --- | --- |
| Performance | 98 | 95 |
| Accessibility | 100 | 100 |
| Best practices | 100 | 100 |
| SEO | 100 | 100 |
| Largest contentful paint | 2.2 seconds | 2.9 seconds |
| Total blocking time | 0 milliseconds | 30 milliseconds |
| Cumulative layout shift | 0 | 0 |

English LCP remains above the project's 2.5-second target in this lab run. These results exclude third-party tracking execution and do not establish real-user Core Web Vitals or conversion improvement. Monitor the complete deployed experience, including analytics, and use representative repeated measurements before making performance claims.

## Keep the page concise

Show each explanation once. Prices and limits belong in the cards; contract definitions and upgrade details belong in the collapsed FAQ. Keep essential qualifications beside their claim, including the context of a customer result.

The simplified Relvo page removes the second audience paragraph from each plan, the three explanatory blocks below the cards, the full testimonial, the FAQ introduction, the contact-process steps and repeated follow-up instructions. It keeps the plan differences, published prices and limits, visible pricing notes, compact customer result, short FAQ and a compact invitation to book a demo or send an enquiry. Both languages use the same content structure.

Avoid replacing removed paragraphs with fixed empty space. Reduce the introductory card height and use a compact proof strip so fewer words also produce a shorter page. Keep the detailed reasoning in this playbook rather than in the buying flow.

## Feature explanations on demand

[Sequence's pricing page](https://www.sequencehq.com/pricing) combines short included-feature lists with contextual information controls. Relvo applies that pattern to its shared feature list: short labels and a consistent checkmark, with an information icon indicating an available explanation. No new package inclusions or add-on policies are inferred from Sequence.

Each row is a native `details` element. Click, tap, Enter or Space reveals one short explanation and a localized product link; a second activation collapses it. The explanation expands within the card rather than appearing in a hover-only tooltip, so it works on touch devices and avoids being clipped by the pricing container. All details are closed initially. Critical details such as human confirmation of reconciliation and IFRS 15 recognition are preserved in the explanations.

Feature records in `copy.js` contain `title`, `detail` and a product-page ID. The route helper supplies the correct Spanish or English URL. Browser checks cover collapsed defaults, keyboard and touch activation, localized destinations, the IFRS 15 detail and overflow at each supported viewport.

## Compare limits when capabilities are shared

The product owner clarified that the feature set is shared across the plans. Pricing therefore presents one explicit “Included in both plans” section beneath the two price and limit summaries. The shared feature descriptions remain available on demand, and each capability is listed once. There are no per-plan feature lists implying that a capability belongs only to one package.

Plan choice is based on the published price, active-contract allowance, legal-entity allowance and country allowance. Mobile summaries use contract counts rather than “fixed plans” versus “complex contracts,” and the help link asks which plan fits without implying that usage billing requires Custom. `copy[locale].features` is the single shared feature list; the campaign landing retains its existing four highlights from that list.

## Name AI capabilities by the work they perform

Use “Agentes de IA para facturación” / “AI agents for invoicing” for document reading, email follow-ups and team notifications. Use “MCP para tus asistentes de IA” / “MCP for your AI assistants” for querying invoices, collections and usage through Model Context Protocol. These are separate entries in the shared feature section. The product source is `content/es/producto/agentes.json`.

Keep visible labels short and put examples behind the information control. AI task execution and MCP data access are distinct capabilities; describe each with concrete verbs. The pricing copy preserves human review for reconciliation and exceptions, and does not imply that an AI agent calculates billing amounts or that MCP can execute unsupported financial actions.

The section has ten features. Its desktop row count is derived from the feature count, preserving two balanced columns without a fixed row count in CSS. Mobile keeps one column.

## Unified booking flow validation

The November 11, 2026 booking update passed 65 browser checks and 37 unit tests. Coverage includes both languages, mobile and desktop layouts, native keyboard disclosure, plan and request context, validation, retries with a stable submission ID, separate enquiry and booking conversions, duplicate booking callbacks, calendar failure fallback and an iframe that grows to reveal all mobile time slots. Build, targeted lint, unused-code analysis, internal links, structured data, band rules and the design gate passed.

Live Cal.com availability and timezone selection were inspected without creating a meeting. This caught and fixed a fixed-height wrapper that clipped mobile time slots. The selected plan also survives the external-calendar fallback and the booking webhook.

One Lighthouse 13.6 mobile run per route used an isolated copy of the completed build and gzip compression. The project’s standard third-party exclusions were applied: Google Tag Manager, Apollo, Cal.com and Turnstile. Both demo routes scored 100 for performance, accessibility, best practices and SEO; both pricing routes scored 99 for performance and 100 in the other categories. LCP ranged from 0.85 to 0.99 seconds, with zero CLS. These lab results exclude third-party execution and do not establish conversion lift or real-user Core Web Vitals.
