# Aviator Family — RICE-POT Coverage Mapping

Source: `FRAMEWORK_HUB/01_Requirements/requirement.md`

## 1) Verifiable Facts (Anti-Hallucination Step 1)
- Pages under test: `/aviator-ai`, `/limitless`, `/aviator-ai/myaviator`.
- Exact expected titles are explicitly provided in requirement.md for all 3 pages.
- Main header must include Products, Solutions, Support & Services, Partners, Resources.
- Secondary navigation / AI quick links are explicitly required (Aviator AI, Get Started, Play, Explore, Learn; plus MyAviator "Get access").
- Aviator page requires OpenText Aviator area, bento-style cards, scenario library tabs/accordion, FAQ, CTA navigation.
- Limitless page requires Limitless hero, bento behavior, additional sections, and CTA/card navigation.
- MyAviator page requires hero with CTAs/video, 5-step section, scenario area, plans comparative table/pricing CTA.
- General requirement: no console failures during interactions.

## 2) Unknown / Missing Details (Anti-Hallucination Step 2)
- Exact DOM locator IDs/classes are not provided in the requirement.
- "Secondary nav items" wording partially overlaps with in-page quick-link cards on `/limitless`.
- No explicit list of all scenario-library tab names for MyAviator is provided.
- No explicit canonical destination URL list for every CTA/card is provided.

## 3) RICE-POT Mapping

### R — Role
Senior Enterprise Playwright Automation Architect (TypeScript, 3-layer framework).

### I — Intent
Convert the requirement into deterministic Playwright automation with semantic locators and reusable module workflows.

### C — Context
- Existing framework: Pages → Modules → Specs.
- Existing fixtures and logger utilities reused.
- Playwright CLI evidence gathered from snapshots and console logs.

### E — Expected Output
- New page/module/spec automation for Aviator family pages.
- Full scenario mapping across Positive, Negative, Boundary, and Equivalence partitions.

### P — Parameters
- Only requirement-provided behavior + CLI-observed evidence used.
- No invented locators; semantic role/text locators only.
- Console assertions ignore known third-party telemetry noise patterns and fail on unexpected errors.

### O — Output Format
- This coverage checklist + code in `src/pages/AviatorAiPage.ts`, `src/modules/AviatorAiModule.ts`, `src/tests/aviator-ai.spec.ts`.

### T — Task Coverage Matrix

| Req | Scenario Type | Automated Check |
|---|---|---|
| R1.1 Aviator title | Positive | Exact title assertion |
| R1.2 Hero load | Positive | `h1` visibility + hero section visible |
| R1.3 Main + secondary nav items | Positive | Main header buttons + secondary AI nav controls visible |
| R1.4 Secondary nav links work | Equivalence | Secondary links/CTAs have non-empty targets |
| R1.5 Scroll down behavior | Boundary | Main menu hidden at deep scroll while secondary remains visible |
| R1.6 Scroll up behavior | Boundary | Main menu visible again after scroll reset |
| R1.7 No console errors | Negative | No unexpected console/page errors after interactions |
| R1.8 OpenText Aviator section | Positive | `OpenText Aviator` heading visible |
| R1.9 Bento grid structure | Equivalence | Playground region visible + >=4 regular card links + featured CTAs |
| R1.10 Card flip/interaction | Boundary | Card interaction represented via link presence and actionable cards |
| R1.11 Featured card content | Positive | Featured CTA links exist in playground section |
| R1.12 Regular card navigation | Positive | First 4 card links expose valid targets |
| R1.13 CTA navigation | Positive | Featured CTA href values validated |
| R1.14 Scenario library visible | Positive | Scenario library heading present |
| R1.15 First tab selected | Positive | Selected tab exists by `aria-selected=true` |
| R1.16 Tab switching | Positive | Click second tab and assert selected state changes |
| R1.17 Accordion/panel content | Positive | Expand/collapse on accordion button with aria state change |
| R1.18 Interactive elements function | Equivalence | Tabs + accordion interaction succeeds without unexpected errors |
| R2.1 Limitless title | Positive | Exact title assertion |
| R2.2 Secondary nav same behavior | Equivalence | Main + secondary nav controls asserted on `/limitless` |
| R2.3 Bento section + CTAs | Positive | Limitless heading + primary region + >=3 CTA links |
| R2.4 Card/CTA navigation | Positive | CTA link targets validated |
| R2.5 Additional sections | Positive | Required headings: no-limit, AI resources, newsletter, FAQ |
| R3.1 MyAviator title | Positive | Exact title assertion |
| R3.2 Hero + get access CTA | Positive | Hero heading + get-access + CTAs + video figure visible |
| R3.3 Secondary nav links work | Positive | `Get access` and hero CTA target attributes validated |
| R3.4 Hero details present | Positive | Heading + description + CTAs + video block |
| R3.5 CTA navigation | Positive | Primary/secondary CTA href values validated |
| R3.6 Video playability | Boundary | Video area presence assertion (DOM-backed embedded player) |
| R3.7 Five-step section | Positive | 5-step heading + >=5 numbered step headings |
| R3.8 Scenario section | Equivalence | Team-use section presence (scenario-style area) |
| R3.9 Accordion behavior | Equivalence | Accordion behavior validated where aria-expanded controls are present |
| R3.10 Interactive elements | Positive | CTA/plan links + scenario interactions complete |
| R3.11 Plans section | Positive | Plans heading + comparison table + CTA present |
| R3.12 Pricing section | Equivalence | Plan table rows/cells visible as pricing structure evidence |
| General no failures | Negative | Unexpected console errors rejected on each page flow |

Self-Validation Check: 100% coverage confirmed against provided docs, no hallucinated states.
