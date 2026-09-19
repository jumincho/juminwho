# DESIGN.md — jumincho.github.io/juminwho

Guidance for anyone, human or AI agent, who changes this site. Judgement lives here as
prose; repeatable mechanics live in `src/styles/tokens.css`. If a rule here and the
tokens disagree, fix the tokens.

## What the site is

A one-page profile for Jumin Cho, an AI researcher and Ph.D. student. Readers are
recruiters, collaborators and reviewers who want to answer three questions fast: who
is this person, what have they done, how do I reach them. The page is a research
notebook, not a landing page. It should read like a well-set CV, not sell like a
product.

## Priority order

1. Facts are correct and sourced (`src/data/profile.ts` is the only place content lives).
2. Reading is effortless at 375px and 1440px, in light and dark, with and without motion.
3. The page looks quiet and deliberate. Personality comes from two things only: the
   "JUMIN WHO?" name flip and the live age counter.

## Visual system

**Colour.** Design in monochrome. Surfaces are near-white or near-black; ink is three
steps of grey (`--fg`, `--fg-muted`, `--fg-faint`). One accent hue (`--accent`) exists
for links on hover, focus rings and the alias state of the name. Never use colour to
decorate. Never add gradients, glows, glass panels or coloured cards.

**Type.** Pretendard Variable for everything, JetBrains Mono only for the age counter.
Sentence-case headings. No all-caps eyebrows, kickers or numbered section labels.
Body is 16px at 1.65 leading, measure capped at 42rem. Section headings are small and
muted; the content carries the weight, not the label.

**Layout.** One column of content at 64rem max width, with a 12rem heading rail on the
left from 720px up. Every list is a two-column grid: period or year on the left, detail
on the right, separated by hairlines. Hairlines (`--line`) are the only dividers. No
cards, no boxes within boxes.

**Spacing.** 4px base scale (`--space-1` … `--space-9`). Sections breathe with
`--space-8`; rows inside a list with `--space-4`. Do not invent values.

**Motion.** Default to stillness. The two allowed motions are the 160ms name flip and
the age counter repaint. Both respect `prefers-reduced-motion`. No scroll reveals,
no page transitions, no background animation, no parallax.

**Theme.** Follows the operating system via `prefers-color-scheme`. There is no visible
theme toggle; `data-theme` on `<html>` exists for tooling and tests.

## Content rules

- Every fact traces to the LinkedIn profile or a citable record. Mark expected dates as
  "(expected)". Do not pad thin sections with placeholder text; drop the section.
- Author lists are complete and in the published order. Emphasise Jumin's name.
- Link to the primary source (publisher PDF, proceedings page). If none exists, list the
  venue without a link rather than a search result.
- Dates use `YYYY.MM – YYYY.MM` or `YYYY.MM – present`.

## Anti-patterns to reject

Decorative gradients or blurred blobs · glassmorphism · nested cards · icons in front
of every list item · stock or generated imagery · marquees · scroll-triggered reveals ·
tiny muted paragraphs for real content · centred paragraphs · numeric section labels ·
"scroll to explore" prompts · admin or CMS chrome in the public page.

## Checklist before merging

- `npm run lint` and `npm run build` pass.
- Rendered at 375px and 1280px in light and dark: no horizontal scroll, no clipped text.
- Keyboard: tab order reaches the name (flips alias on focus), every link and nothing else.
- With reduced motion enabled the page is static except a 1 Hz counter update.
