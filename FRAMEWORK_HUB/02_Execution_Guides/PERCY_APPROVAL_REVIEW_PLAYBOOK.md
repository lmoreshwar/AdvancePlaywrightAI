# Percy Approval/Reject Playbook

Use this playbook for every Percy build so approvals are consistent and fast.

## 1) Source of Truth

- Primary: Percy build UI (snapshot-level visual diff review).
- Secondary: GitHub Actions logs + `visual-ai-report` artifact (run/debug details only).

If Percy and logs look different, trust Percy for visual decisions.

## 2) Quick Diff Percentage Guide

There is no universal hard cutoff, but use these practical ranges:

- `0%`: perfect match.
- `0.01% - 0.10%`: usually tiny rendering noise, still inspect quickly.
- `0.10% - 0.50%`: careful review needed.
- `>0.50%`: likely meaningful change.
- `~1.00%+`: usually significant unless limited to known dynamic overlays.

Important: location of the diff matters more than percentage alone.

## 3) Approve vs Reject Rules

Approve when all changed snapshots are one of these:
- Expected feature/UI update (intended change in story/requirement).
- Known dynamic noise only (chat widget, cookie banner, summit promo, region popup, floating ad/media widget).
- Minor anti-aliasing/font/rendering change with no layout/content shift.

Reject when any changed snapshot includes:
- Unintended movement in core UI (header/nav/hero/main content/footer/cards/forms).
- Missing or broken content (text, image, CTA, alignment, spacing, clipping).
- New unexpected modal/overlay covering content.
- Change not explained by requirement/release intent.

## 4) 60-Second Review Checklist

For each `Changed` or `New` snapshot:

1. Open overlay mode and locate where pixels changed.
2. Classify diff area:
   - Core UI area -> strict check.
   - Dynamic widget/popup area -> likely ignore/noise.
3. Ask: "Is this expected by current change?"
4. Decide:
   - Expected/noise only -> keep for approval.
   - Unexpected core UI impact -> reject and fix.

Build-level decision:
- All changed snapshots expected/noise -> Approve build.
- Any unexpected core UI regression -> Reject/fix/rerun.

## 5) Known OpenText Noise Areas (Current Project)

Treat these as noise if isolated to their containers:
- Cookie consent banner (`onetrust`/cookie selectors).
- OT Agent/chat assistant widget.
- OpenText Summit promo/floating campaign widgets.
- Region selection popup and related floating UI.
- Bottom floating media/images/widgets that appear intermittently.

If these repeatedly create diffs, hide them in Percy CSS and pre-snapshot stabilization.

## 6) Standard Team Policy (Recommended)

- Smoke pages (critical landing/header/footer/contact): reject on any unexpected core UI diff.
- Non-critical/regression pages: allow tiny noise if isolated to known dynamic zones.
- Require one reviewer to confirm "expected vs unexpected" before approval.
- Re-run once after approval when large baseline updates were introduced.

## 7) What to Share for Fast Triage

When asking for script updates, share:
- Percy build URL.
- Snapshot names with highest diffs.
- One screenshot per problematic snapshot (side-by-side or overlay).
- GitHub Actions run URL if execution issue is suspected.

This is enough to quickly add stable selectors and reduce false positives.

