# Design canvas

The visual design was validated on a Claude Design canvas (private Artifact, owner only):
https://claude.ai/code/artifact/7077f4a1-cb5d-43d2-b0ac-b8e29bd5f0ec

`artboards/` holds the source of each artboard (`.dc.html`, static mockups) and the
`canvas.json` layout. They reference images by basename (listing thumbnails and the logo)
that live in the canvas itself; the production site under the repo root is the implementation
of these artboards and is the source of truth from here on.
