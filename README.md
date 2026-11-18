# Talks

Slidev slide decks for talks by Marc Rußwurm, using the same Bonn slide template as
[teaching-grl](https://github.com/meo-lab/teaching-grl). Published via GitHub Pages at
<https://meo-lab.github.io/talks/>.

## Layout

```
talks/
  <YYYYMMDD_Name>/slides.md   one folder per talk (figures, components, data live next to it)
layouts/                      shared Bonn layouts (cover, content, section, image-right, ...)
components/                   shared Vue components
assets/                       logo and fonts
style.css                     shared theme
scripts/                      dev / export / build helpers
```

The shared theme is loaded through `addons: ["../"]` in each deck's frontmatter.

## Usage

```bash
npm install
npm run dev                          # newest talk
npm run dev -- 20261202_DiesAcademicus
npm run export -- 20261202_DiesAcademicus   # PDF
npm run build                        # all talks + index page -> dist/
```

## Adding a new talk

1. `cp -r talks/20261202_DiesAcademicus talks/<YYYYMMDD_Name>` and edit `slides.md`
   (frontmatter `title`, `event`, `date` feed the index page).
2. Put figures in the talk's own `figures/` folder; reference them as `./figures/...`.
3. Push to `main`: the workflow builds every talk and deploys it to
   `https://meo-lab.github.io/talks/<YYYYMMDD_Name>/`.

## Talks

- `20261202_DiesAcademicus` — Wie KI durch GeoGuessr-Spielen die Welt verstehen lernt (Dies Academicus, 2 Dec 2026)
