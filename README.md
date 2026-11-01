# MX Series Kiosk Demo

A standalone Logitech-style product and marketing showcase designed for an exhibition stall or trade-show kiosk.

## Run

Open `index.html` in a browser, or run a small local server:

```powershell
python -m http.server 5500
```

Then visit `http://localhost:5500`.

## Kiosk features

- Full-screen mode
- MX-series product filtering
- Product information dialogs
- Interactive workflow demonstration
- Saved-product hearts
- Optional hosted-video URL
- Local MP4 upload through the gear button
- Responsive layout

## Offline video setup

For the most reliable exhibition demo, place an MP4 next to this folder and use the gear control at the right edge to upload it. Browsers cannot persist an uploaded `File` object between visits, so local files remain the fastest option but typically need to be selected once per browser session. You can instead add a stable path to the application if hosted by a server.

## Brand and content note

This is an independent demo concept and is not an official Logitech website. Product names and descriptions should be checked against current official product documentation before a public launch.
