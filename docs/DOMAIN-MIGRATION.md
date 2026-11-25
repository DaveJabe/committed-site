# Moving the site to a custom domain

The site is ready to move from `https://davejabe.github.io/committed-site/` to a domain served from its root.
Nothing here has been done: no domain is registered and nothing has been deployed. Do these steps once the
domain is bought and confirmed. `example.com` below stands for the real domain.

## Before you start: check what the current URLs earn

Search Console (property `https://davejabe.github.io/committed-site/`, verified by the meta tag on the
English calculator) shows which pages get impressions. Note the calculator's clicks, impressions and
average position for "sobriety calculator" and "calculadora de sobriedad" for the last 3 months, so the
move can be judged afterwards. Every path stays the same after the move, so only the host and the
`/committed-site` prefix change.

## 1. DNS at Cloudflare

Decide between the apex (`example.com`) and `www.example.com` as the canonical host. Apex is shorter;
both work with GitHub Pages.

- Apex: four `A` records to `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
  (and optionally `AAAA` to `2606:50c0:8000::153`, `2606:50c0:8001::153`, `2606:50c0:8002::153`, `2606:50c0:8003::153`).
- `www`: a `CNAME` to `davejabe.github.io`.
- Set these records to **DNS only** (grey cloud) at first, so GitHub can issue its certificate. Proxying can
  be turned on later with SSL mode **Full (strict)** if you want Cloudflare's cache.
- Check GitHub's current IP list before entering them: https://docs.github.com/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site

## 2. Verify the domain with GitHub

GitHub > Settings (your account) > Pages > Add a domain. Add the `TXT` record it gives you at Cloudflare.
Verification stops anyone else's repository from claiming the domain.

## 3. Point the build at the new address

In `DaveJabe/committed-site` > Settings > Secrets and variables > Actions > **Variables**, add:

| Name | Value |
|---|---|
| `SITE_ORIGIN` | `https://example.com` |
| `SITE_BASE_PATH` | `/` |
| `SITE_CUSTOM_DOMAIN` | `example.com` |

(Or change the defaults in `site.config.mjs`.) The build then writes canonical URLs, hreflang, Open Graph
URLs, the sitemap, `robots.txt`, every internal link and asset path, and a `CNAME` file for the new host.
Preview it locally first:

```sh
SITE_ORIGIN=https://example.com SITE_BASE_PATH=/ SITE_CUSTOM_DOMAIN=example.com npm run build
SITE_BASE_PATH=/ npm run preview   # then open http://localhost:4321/
```

## 4. GitHub Pages settings

Repository > Settings > Pages > Custom domain: enter `example.com` and save. Wait for the DNS check to pass,
then tick **Enforce HTTPS** once the certificate is issued (can take up to an hour).

Run the deploy workflow (Actions > Deploy Committed to GitHub Pages > Run workflow) or merge to `main`.

## 5. Redirects from the old address

GitHub Pages redirects `https://davejabe.github.io/committed-site/…` to the custom domain automatically
(301) once the custom domain is set on this repository, keeping the path. Check a few:

- `https://davejabe.github.io/committed-site/` → `https://example.com/`
- `https://davejabe.github.io/committed-site/es/app-sobriedad-iphone/` → `https://example.com/es/app-sobriedad-iphone/`
- `https://davejabe.github.io/committed-site/privacy.html` → `https://example.com/privacy.html`

If the user site `davejabe.github.io` itself ever gets its own custom domain, project redirects change, so
re-check then.

## 6. Search Console

1. Add a **Domain** property for `example.com` (verified by a DNS `TXT` record at Cloudflare). It covers
   http/https and www/apex.
2. Submit `https://example.com/sitemap.xml`.
3. In the old URL-prefix property use **Settings > Change of address** to point at the new property.
4. Keep the old property and its verification tag for at least 180 days to watch the move.
5. `robots.txt` now sits at the host root, so it is read for the first time; it allows everything.

Bing Webmaster Tools: import from Search Console and use its site move tool.

## 7. App Store Connect

App Store Connect > Apps > Committed > App Information and the version page:

- **Marketing URL**: `https://example.com/sobriety-tracker-app/` (or `/es/app-sobriedad/` for the Spanish localization)
- **Support URL**: `https://example.com/support.html` (`/es/soporte.html` for Spanish)
- **Privacy Policy URL**: `https://example.com/privacy.html` (`/es/privacidad.html` for Spanish)

The privacy and support URLs can change without a new build. The Marketing URL is per version, so update it
with the next submission. Also update any link to the site inside the app (Settings, Resources) in the next
build; the old links keep working through the redirect meanwhile.

## 8. After the move

- Request indexing of the calculator and the product page in the new property.
- Update links you control: App Store description, press kit, social profiles, email signature.
- Compare calculator clicks and position after 4 to 8 weeks with the numbers from "Before you start".
