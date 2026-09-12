# Presentation source and Git tracking

This folder keeps the scripts and image inputs used to create the MYSignVoice
presentation. Generated working artifacts stay local through the root `.gitignore`.

## Retained source files

- `build_deck.mjs`: slide content, charts, layout and presenter notes.
- `inspect_template.mjs`: import and inspect the previous presentation template.
- `prepare_evidence.py`: collect saved evaluation data and select demo originals.
- `prepare_demo.mjs`: assemble the four-image demo frames.
- `test_demo.py`: check demo predictions through an already running local API.
- `package_demo.py`: create the final demo ZIP.
- `capture_app.mjs`: capture the application screenshot for the slides.
- `finalize_deck.mjs`: validate and export the final deck.
- `verify_final.mjs`: render the exported deck for visual inspection.
- `assets/`: image inputs referenced by the slide builder.

The final deck, demo ZIP, presenter guide, standalone diagrams and small demo
checklists/manifests are retained under `outputs/MYSignVoice_Presentation/`.
The recorded `demo/verification_results.json` is retained as evidence for the
presentation's test summary.

## Local dependencies and regeneration

Run scripts from the repository root. The JavaScript scripts use the Codex
presentation runtime (`@oai/artifact-tool` and its presentation skill utilities),
`sharp`, and, for the screenshot, `playwright`. Python scripts use the standard
library. The scripts currently reference Hui Min's local runtime paths; another
machine needs equivalent runtime locations. The `node_modules` junction remains
local and ignored.

The original template is `D:/Traffic Sign Detection for AVs (1).pptx`. The report
extraction in `prepare_evidence.py` also uses the two original reports on `D:/`.
Those external source documents are required for the existing scripts and are
not included in this folder. Evaluation CSVs, model metadata and original demo
images are read from the repository's existing results and `Color Inputs/` files.
Running the API checks requires the project's existing model setup.

For regeneration, inspect the original template, prepare the evidence and demo
frames, check the demo through the local API, then build and finalize the deck.
`prepare_evidence.py` recreates `evidence.json` and the single-sign image copies.
`inspect_template.mjs` recreates `template/source-proto.json`. The demo ZIP also
contains the unpacked image folders, so they can be extracted locally for a demo.
Use a fresh output filename or staging location when re-exporting validated
files; the finalizer avoids overwriting existing final files and receipts.

## Ignored generated artifacts

Template dumps, serialized presentation JSON, extracted report text, drafts,
slide renders, inspection logs, validation receipts, chart workbook scratch
folders and dependency caches stay local. The unpacked demo image folders are
also ignored to avoid storing both the images and their final ZIP in Git.
Source scripts and `assets/` are intentionally not covered by a blanket ignore
of this folder.
