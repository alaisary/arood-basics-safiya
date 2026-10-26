# أساسيات في علم العروض — open-slide deck

Slide deck for **أ. صفية الحارثية**, مدرسة قيرون حيرتي, built with [open-slide](https://www.npmjs.com/package/@open-slide/core).

## Run locally

```sh
npm install
npm run dev
```

Then open <http://localhost:5173/s/arood-basics-safiya>. On Windows, double-click `▶ تشغيل العرض.bat` instead.

## Deploy (Cloudflare Pages)

```sh
sh deploy/build.sh
npx wrangler pages deploy dist --project-name arood-basics-safiya
```

## Folders

- `slides/arood-basics-safiya` — the deck source
