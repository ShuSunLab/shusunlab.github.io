# ShuSunLab research website

Public website: https://shusunlab.github.io/

English research hub for ShuSunLab at Shanghai Jiao Tong University, featuring simulation platforms, multimodal datasets, publications, and tutorials.

## Publishing and editing

GitHub Pages publishes the root of the main branch. No build or package installation is required. Edit the HTML pages for content, portal.css for the responsive design, and cover-*.svg for illustrative artwork. Cover images are labeled as illustrations. Changes committed to main are published automatically.

## Analytics

Page views and research-resource link clicks are recorded by the separate Cloudflare analytics API configured in site-config.js. It accepts credential-free browser events only from https://shusunlab.github.io and stores them in D1. Owner statistics are available inside the authenticated Cloudflare account; the optional standalone dashboard remains locked until owner authentication is configured. No integration keys belong in public files. Browser tracking respects Do Not Track, Global Privacy Control, and the opt-out on privacy.html.

Download-entry clicks are distinct from completed downloads. Actual software downloads, dataset downloads, and local or web simulation usage require reporting from those services; those integrations are not connected yet. The illustrative scene is not a simulation run. TB-scale research data stays with its external host.

Each linked research resource retains its own licensing terms. This website does not grant a new software or dataset license.
