# Moving the site to committedtracker.app

The site moves from `https://davejabe.github.io/committed-site/` to `https://committedtracker.app/`. The build
side is done in this repository (`site.config.mjs` defaults to the new origin and root path, and the build writes
a `CNAME` file). Every path stays the same: only the host changes and the `/committed-site` prefix goes away.

**Do the steps in this order.** Merging the pull request publishes pages whose links start at the domain root, so
it must not reach `main` until GitHub is serving the custom domain (step 4). Before then the live site keeps working
at the old address.

`.app` domains are on the browsers' HTTPS-only list, so `committedtracker.app` opens only once GitHub has issued its
certificate. That takes minutes to an hour after step 4. During that window the old address redirects to a domain
that browsers won't open yet, so do step 4 at a quiet time and have steps 5 and 6 ready.

## Before you start: note what the current URLs earn

In Search Console (property `https://davejabe.github.io/committed-site/`), note the calculator's clicks, impressions
and average position for "sobriety calculator" and "calculadora de sobriedad" over the last 3 months, so the move
can be judged afterwards.

## 1. Verify the domain with GitHub (any time)

GitHub > your profile picture > Settings > Pages > **Add a domain** > `committedtracker.app`. GitHub shows a `TXT`
record (host `_github-pages-challenge-DaveJabe`). Add it at your registrar, then press **Verify**. This stops anyone
else's repository from claiming the domain.

## 2. Add the DNS records (any time, at your registrar)

| Type | Host / name | Value |
|---|---|---|
| `A` | `@` (apex) | `185.199.108.153` |
| `A` | `@` | `185.199.109.153` |
| `A` | `@` | `185.199.110.153` |
| `A` | `@` | `185.199.111.153` |
| `AAAA` | `@` | `2606:50c0:8000::153` |
| `AAAA` | `@` | `2606:50c0:8001::153` |
| `AAAA` | `@` | `2606:50c0:8002::153` |
| `AAAA` | `@` | `2606:50c0:8003::153` |
| `CNAME` | `www` | `davejabe.github.io` |

Remove any parking or forwarding records the registrar added for `@` or `www` (often an `A`, `ALIAS` or "URL
redirect"). If the DNS is on Cloudflare, set these records to **DNS only** (grey cloud). GitHub's current list is at
https://docs.github.com/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site

Wait until the records resolve, for example `dig committedtracker.app +short` lists the four `185.199.…` addresses and
`dig www.committedtracker.app +short` shows `davejabe.github.io`. Usually minutes, at most a day or two.

## 3. Check the repository variables

`DaveJabe/committed-site` > Settings > Secrets and variables > Actions > **Variables** should have no `SITE_ORIGIN`,
`SITE_BASE_PATH` or `SITE_CUSTOM_DOMAIN` (the deploy logs show them empty today). The defaults in `site.config.mjs`
are the new domain.

## 4. Set the custom domain on the repository

`DaveJabe/committed-site` > Settings > Pages > Custom domain: `committedtracker.app` > **Save**. From this moment
GitHub redirects the old address to the new one, and it starts issuing the certificate (for the apex and `www`;
`www` will redirect to the apex).

## 5. Merge the pull request right away

Merging deploys the build for the new domain (canonical URLs, hreflang, Open Graph URLs, sitemap, `robots.txt`,
links). Wait for "Deploy Committed to GitHub Pages" to go green in Actions.

## 6. Turn on HTTPS

Back in Settings > Pages, once it says the DNS check succeeded and the certificate is ready, tick **Enforce HTTPS**.
Then check:

- `https://committedtracker.app/` and `https://committedtracker.app/es/` load
- `https://www.committedtracker.app/` redirects to `https://committedtracker.app/`
- `https://davejabe.github.io/committed-site/es/app-sobriedad-iphone/` redirects to `https://committedtracker.app/es/app-sobriedad-iphone/`
- `https://davejabe.github.io/committed-site/privacy.html` redirects to `https://committedtracker.app/privacy.html`

If the user site `davejabe.github.io` ever gets its own custom domain, project redirects change, so re-check then.

## 7. Search Console (same day)

1. Add a **Domain** property for `committedtracker.app`, verified by the DNS `TXT` record it gives you. It covers
   http/https and www/apex.
2. Submit `https://committedtracker.app/sitemap.xml`.
3. In the old URL-prefix property use **Settings > Change of address** and choose the new property. Do this soon,
   while the old property is still verified (its meta tag now sits behind the redirect).
4. Keep the old property for at least 180 days to watch the move.
5. `robots.txt` is now at the host root, so crawlers read it for the first time. It allows everything.

Bing Webmaster Tools: import from Search Console and use its site move tool.

## 8. App Store Connect

App Store Connect > Apps > Committed > App Information, and the version page:

| Field | English | Spanish localization |
|---|---|---|
| Privacy Policy URL | `https://committedtracker.app/privacy.html` | `https://committedtracker.app/es/privacidad.html` |
| Support URL | `https://committedtracker.app/support.html` | `https://committedtracker.app/es/soporte.html` |
| Marketing URL | `https://committedtracker.app/sobriety-tracker-app/` | `https://committedtracker.app/es/app-sobriedad/` |

The privacy and support URLs can change without a new build. The Marketing URL is per version, so update it with
the next submission. The app itself has no links to the website, so no build is needed for the move.

## 9. Other places with the old address

- In this repository, the press fact sheets and both press kit ZIPs already use the new address.
- In `DaveJabe/Committed`, `marketing/search-console-and-measurement.md` and `marketing/seo-strategy.md` still
  describe the old address. Update them when you next edit those notes.
- Links you control outside GitHub: the App Store description if it names the site, social profiles, email
  signature, and any outreach drafts.

## 10. After the move

- Request indexing of the calculator and the product page in the new property.
- Compare calculator clicks and position after 4 to 8 weeks with the numbers from "Before you start".
