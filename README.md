# Mr. Plunger Plumbing — Website Redesign

A completely new, modern website for **Mr. Plunger Plumbing**, a licensed and insured
residential and commercial plumbing company serving **Acworth, GA** and the surrounding
areas for over 46 years.

Built with **vanilla HTML, CSS and JavaScript** — no frameworks, no build step, no
environment variables, no external APIs at runtime.

## Run it

Open `index.html` directly in a browser, or serve the folder:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Files

| Path | Purpose |
| --- | --- |
| `index.html` | Single-page site: hero, credentials, values, about, services, water heaters, specials, reviews, blog, contact, footer. Includes SEO/social meta tags, `Plumber` JSON-LD structured data, an inline SVG icon sprite, and semantic landmarks. |
| `assets/css/style.css` | Design system (custom properties, typography, buttons, cards), all section styling, responsive breakpoints at 1080/1024/720/520px, `prefers-reduced-motion` support. |
| `assets/js/main.js` | Mobile navigation, services mega-menu, service filtering, scroll reveal, active-section highlighting, back-to-top, and client-side contact-form validation. |
| `favicon.svg` | Favicon placeholder (navy tile with the Mr. Plunger plunger mark). |

## Content sources

All copy, services, phone number, social profiles, blog articles and business facts come
from the existing Mr. Plunger Plumbing website content — nothing is invented:

- Tagline: “When you call, you talk to the owner. We will beat any reputable plumber’s price.”
- Phone: **(404) 587-2888**
- Service area: Acworth, GA and the surrounding areas
- Warranty: repairs under warranty for one year, new installs for five
- 45 years in business · all major credit cards accepted
- Member of the Georgia Plumbers Trade Association

## Images

- **Original business assets kept:** Mr. Plunger logos, the HGTV “as seen on” badge, and the
  Licensed & Insured, BBB, Google Guaranteed, Five-Star Google Review, Yelp and Angi marks,
  plus two original Mr. Plunger work photos in the About section.
- **Stock imagery replaced:** the inherited Pexels-hosted and generic stock images from the
  old site were swapped for contextually matched, licensed stock photography obtained from
  the Pexels API (plumbing work, water heaters, drains, commercial pipework, sewer lines,
  and each blog article’s subject).
- Every image has descriptive, business-specific `alt` text plus explicit `width`/`height`
  to prevent layout shift.

## Contact form

The form validates on the client and confirms receipt in the browser. It is a static
site with no backend, so no data is transmitted — the page directs urgent enquiries to
the phone number.

## Notes

- No analytics, trackers, cookies, or third-party scripts.
- Fully responsive and keyboard accessible (skip link, focus-visible outlines, ARIA state
  on menus/filters/form status).
