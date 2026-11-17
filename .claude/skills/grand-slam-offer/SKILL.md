---
name: grand-slam-offer
description: Builds the offer and product copywriting for a landing page or a larger website using Alex Hormozi's Grand Slam Offer framework (Value Equation, value stack, bonuses, risk reversal/guarantees, scarcity and urgency, packages and pricing psychology, MAGIC offer naming). It first analyzes the site's codebase, then interviews the user for any missing product information, and picks the copy language from the site's context (or asks). ALWAYS use this skill when the user wants to write, improve, or review an offer, sales copy, a pricing section, hero, CTA, guarantee, bonuses, packages, a landing page, sales page, or product page — including casual requests like "improve the website copy", "make the pricing better", "write a sales page", "offer", "pricing page", "copy", "Hormozi", or "Grand Slam Offer", in any language.
---

# Grand Slam Offer — Offer & Product Copy

Goal: build an offer so good that people feel stupid saying no — then translate it into website copy. The offer matters more than the words: build the offer first, write the copy second.

This skill has a **strict list of criteria** (see "Mandatory Criteria"). The offer and copy are not finished until every criterion is PASS or a deliberately justified N/A.

## Workflow

Follow the steps in order. Do not start writing copy before Step 5.

### Step 1 — Codebase reconnaissance

Before asking any question, extract everything you can from the repository:

- Page content: page/section components (`src/`, `app/`, `pages/`, `components/`), content files (`content/`, `*.md`, `*.mdx`), translations (`locales/`, `i18n/`, `messages/*.json`), CMS data, `README`, `package.json` (name, description).
- Search for offer-related keywords in multiple languages, e.g.:
  `grep -riE "price|pricing|plan|tier|package|guarantee|refund|bonus|free|limit|spots|seats|deadline|testimonial|case study|faq|cen|zł|pln|eur|pakiet|gwaranc|zwrot|gratis|miejsc|opini" --include=*.{tsx,jsx,ts,js,vue,svelte,astro,html,md,mdx,json} .`
- Identify the brand's tone of voice (formal/casual, form of address).

Record the result as a "What I already know" table with columns: Offer element | What I found | Source (file) | Confidence (high/low/none).

### Step 1a — Copy language (mandatory)

Determine the language in which the copy will be written. The copy language is **independent of the language of this conversation** and of the language of this skill.

1. Detect it from the site context, in this order of evidence:
   - `<html lang="…">` attribute, framework i18n config (`next.config.*` `i18n.defaultLocale`, `astro.config.*`, `nuxt.config.*`, `vite`/`i18next` setup), locale folders/files (`locales/pl/`, `messages/de.json`),
   - the language of existing visible copy (headings, buttons, meta title/description),
   - currency, date formats, and legal pages (e.g. "Regulamin", "Impressum", "Terms").
2. **Use the detected language without asking** only when the evidence is unambiguous (one locale, existing copy clearly in that language).
3. **Ask the user** which language to write in when any of these apply:
   - there is no existing copy or language signal (new/empty project),
   - the site has multiple locales (ask: which one is the primary/source language, and whether other locales should be written too or left for translation),
   - signals conflict (e.g. `lang="en"` but content is in Polish, template placeholder text, lorem ipsum),
   - the user explicitly mentioned a different target market than the site suggests.
4. Also confirm the form of address when the language has one (e.g. Polish "Ty" vs. "Państwo", German "du" vs. "Sie", French "tu" vs. "vous") if it cannot be inferred from existing copy.
5. Record the decision in the Offer Brief: `Copy language: <language> (source: detected from <file/signal> | chosen by user)`.

All customer-facing output (offer name, Offer Brief content meant for the page, and all copy) is written in the chosen copy language. Communicate with the user in the language they use in the conversation.

### Step 2 — Gap analysis

Compare "What I already know" with the inputs listed in `references/intake-questions.md`. Every element with confidence "none" or "low" goes on the question list. Do not ask about things that are clearly answered by the code — it wastes the user's time.

### Step 3 — Interview

Read `references/intake-questions.md` and ask **only the missing** questions.

- If the `AskUserQuestion` tool is available, use it (max 3–4 questions per round, with sensible clickable options + room for a custom answer). Otherwise ask in chat, in rounds of max 5 questions.
- If the copy language is still undetermined after Step 1a, include it in the first round.
- Round order: (1) customer and dream outcome, (2) product and delivery, (3) proof and obstacles, (4) constraints: real capacity, deadlines, guarantees the business will accept, (5) pricing and margins.
- When the user doesn't know an answer, propose 2–3 concrete options and ask them to choose instead of leaving a gap.
- Never invent facts: customer counts, results, testimonials, certifications, number of available spots. If missing, insert an explicit placeholder in the copy: `[TO FILL IN: …]` (write the placeholder label in the copy language, e.g. `[DO UZUPEŁNIENIA: …]` for Polish).

### Step 4 — Build the offer (Offer Brief)

Read `references/offer-framework.md`, `references/guarantees-scarcity.md` and `references/pricing-packages.md`. Build the offer in this order:

1. **Dream Outcome** — one sentence, in the customer's words, concrete and measurable.
2. **Value Equation** — list the levers: how we increase the outcome and perceived likelihood of achievement, how we reduce time delay and effort & sacrifice.
3. **Problems/obstacles list** — everything the customer must overcome before, during, and after purchase (min. 8).
4. **Problems → solutions** — turn each obstacle into a solution ("How to …").
5. **Delivery vehicles** — how each solution is delivered (1:1, group, template, tool, done-for-you, etc.), then **Trim & Stack**: cut what is expensive to deliver and low-value to the customer; keep what is cheap to deliver and highly valued.
6. **Value Stack** — components with a name, outcome, and value for each.
7. **Bonuses** — each bonus removes a specific obstacle.
8. **Risk reversal** — a guarantee (or a guarantee stack).
9. **Scarcity and urgency** — based on real constraints.
10. **Packages / price architecture** — if the product qualifies (see eligibility criteria in `pricing-packages.md`).
11. **Offer name** — MAGIC formula.

Save the result as `docs/offer/offer-brief.md` (or a location the user specifies) using the template in "Output Format". Show the brief to the user and ask for approval or changes before writing copy.

### Step 5 — Website copy

Read `references/copy-blueprint.md`. Write the copy section by section following the blueprint, adapted to the site type (single landing page vs. larger website — see blueprint). Write in the copy language chosen in Step 1a, idiomatically — not as a translation from English.

Implementation: by default save the copy to `docs/offer/landing-copy.md`. If the user wants, put the copy directly into components/content files — preserving the existing structure, i18n keys, and styles. For multi-locale sites, write into the agreed locale(s) only. Do not rebuild the layout without permission. On a larger website, once the new copy is in place, suggest the `site-consistency` skill to align the remaining pages with the new offer.

### Step 6 — Quality control

Go through "Mandatory Criteria" below and include a table in your response: Criterion | PASS/FAIL/N/A | Evidence (quote from the copy or justification for N/A). Fix every FAIL before delivering. N/A is allowed only where the criterion explicitly permits it.

## Mandatory Criteria

### L. Language
- **L1.** The copy language was determined per Step 1a (detected from unambiguous site signals or explicitly chosen by the user) and recorded in the brief with its source.
- **L2.** All customer-facing copy, the offer name, CTAs, and placeholders are in that language, written idiomatically with the agreed form of address.

### A. Value-based offer — price-based offers are FORBIDDEN
- **A1.** The copy never competes on price: messages like "cheapest", "lowest price", "cheaper than competitors", "best price anywhere", or "-50% sale" as the main argument are forbidden (and their equivalents in the copy language).
- **A2.** Price appears only **after** the value is presented (outcome → stack → bonuses → guarantee → price). Never in the hero or above the fold as a hook.
- **A3.** Price is anchored against the total stack value ("Total value: X — Your investment: Y") and/or against the cost of the problem (what not solving it costs the customer).
- **A4.** The total stack value is a multiple of the price (target: at least 5–10×). Every component's valuation must be justified (cost of the alternative, market rate, time saved) — record the justification in the brief.
- **A5.** Price is set from the value of the outcome to the customer, not from production cost or competitor prices. If the user proposes a price lower than the value justifies, flag it and suggest raising value instead of lowering price.

### B. Value Equation
- **B1.** The dream outcome is named concretely (number, state, timeframe) in the hero.
- **B2.** The copy raises perceived likelihood of achievement: proof (testimonials, case studies, numbers, method, authority) — real or as placeholders.
- **B3.** The copy communicates a shorter time to first result ("first results in …").
- **B4.** The copy communicates reduced effort and sacrifice ("without …", "we do it for you").

### C. Stack and bonuses
- **C1.** The offer consists of at least 3 named components, each with an outcome description and a valuation.
- **C2.** Every bonus solves a specific obstacle from the problems list (state which one in the brief).
- **C3.** Every bonus has a name, an outcome, and a valuation; total bonus value is at least comparable to the core offer's value.
- **C4.** At least one bonus helps the customer **achieve the goal** (not just a "free ebook"), e.g. implementation, templates, kickoff consultation, execution checklist.

### D. Risk reversal
- **D1.** The offer contains at least one clearly worded guarantee: type (unconditional / conditional / anti-guarantee / implied), timeframe, conditions, what exactly the customer gets.
- **D2.** Where possible, the guarantee is tied to the outcome, not just to "satisfaction" (e.g. "if you don't achieve X in Y days despite completing the steps, we keep working with you for free / refund …").
- **D3.** The guarantee is approved by the user — never promise anything the business hasn't agreed to.
- **D4.** The guarantee is visible next to the price and the main CTA.

### E. Scarcity and urgency
- **E1.** The offer includes scarcity (limited spots/slots/units) and/or urgency (limited time: enrollment deadline, bonus deadline, price increase).
- **E2.** Every constraint is **real** and comes from actual capacity or a business decision (e.g. max 10 clients per month, cohort enrollment closes on X). Fake countdown timers, "only 3 spots left" without backing, and resetting timers are forbidden — they mislead customers and are an unfair commercial practice in the EU and many other jurisdictions.
- **E3.** The copy gives a **reason why** for the constraint (service quality, team capacity, cohort start).
- **E4.** If the number of spots is dynamic, mark it in the copy with a placeholder/variable (`[SPOTS_LEFT]`) and suggest where to update it from.

### F. Packages and pricing psychology
- **F1.** Package eligibility was assessed (see `pricing-packages.md`) and the decision with justification is recorded in the brief.
- **F2.** If the product qualifies: at least one mechanism is used — quantity packages ("buy 4, get 6", "buy 2, get 1 free"), tiers (good/better/best with an anchor and a recommended option), decoy, one-time payment vs. installments with a bonus for paying in full.
- **F3.** If it doesn't qualify: price-presentation psychology is used (value anchor, breakdown per unit of time/result, comparison with the cost of the problem) and F2 is marked N/A with justification.
- **F4.** One recommended option is highlighted (e.g. "Most popular"), and the package mechanism is understandable within 3 seconds.
- **F5.** When communicating price reductions in the EU market: tell the user about the obligation to show the lowest price from the 30 days before the reduction (Omnibus Directive). Prefer adding value (bonuses, more units) over discounts.

### G. Naming and copy
- **G1.** The offer has a name built with MAGIC (at least 3 of 5 elements), natural in the copy language.
- **G2.** Hero: outcome-driven headline + subheadline (for whom, in what time, without what) + CTA.
- **G3.** The copy uses the customer's language (their words from the interview/testimonials), addresses the reader directly, and focuses on benefits and outcomes, not features.
- **G4.** Every page section has a CTA or leads to one; CTAs describe the next step and the benefit, not "Submit".
- **G5.** Zero invented data: every number, testimonial, and promise comes from the user or is a placeholder.
- **G6.** The FAQ answers the main objections (price, time, "will it work for me", risk) and points to the guarantee.

## Output Format

### `offer-brief.md`

```markdown
# Offer Brief: [Offer name per MAGIC]

Copy language: [language] (source: detected from [signal] | chosen by user) · Form of address: [...]

## 1. Customer (avatar) and dream outcome
## 2. Value Equation (4 levers)
## 3. Problems → solutions (table: obstacle | solution | delivery vehicle | delivery cost | customer value | Trim/Stack decision)
## 4. Value Stack (table: component | outcome | valuation | valuation rationale)
## 5. Bonuses (table: bonus | obstacle removed | outcome | valuation)
## 6. Risk reversal (type, full guarantee wording, conditions, user approval status)
## 7. Scarcity and urgency (constraint | real source | reason why | how to update)
## 8. Price and packages (eligibility decision, options, anchors, recommended option)
## 9. Open items / placeholders to fill in
```

The brief's structure and analysis may be in the conversation language; any text intended to appear on the site (offer name, component names, guarantee wording, headlines) is written in the copy language.

### `landing-copy.md`
Copy section by section per `copy-blueprint.md`, with section heading, body, and CTA — in the copy language. End with the criteria check table (L, A–G).

## Avoid

- Writing copy before the offer is built — pretty words won't save a weak offer.
- Assuming the copy language from the conversation language.
- Asking questions the code already answers.
- Overwhelming the user with 20 questions at once.
- Discounts as the main sales lever — add value instead of lowering price.
- Promising results the business can't prove or deliver, or guarantees the user hasn't approved.
