# MYSignVoice

MYSignVoice is a web-based Malaysian traffic-sign detection and classification system. A browser supplies a live webcam stream or an uploaded image/video; a Python backend returns bounding boxes, one of 63 sign classes, confidence scores, and a temporally stable result for display or speech output.

## Active design

| Component | Technology | Purpose |
|---|---|---|
| Web client | Browser camera (`getUserMedia`) and throttled HTTP | Capture frames and render results |
| Backend | Python with FastAPI | Load the model once and serve inference |
| Detector | Ultralytics YOLO26s, pretrained and fine-tuned at `imgsz=640` | Final 63-class detection and classification |
| CPU deployment | OpenVINO on the Intel laptop/server | Lower-latency server inference |
| Optional candidate path | OpenCV HSV masks, morphology, and contours | Propose contextual crops for a second YOLO pass |
| Training | Roboflow annotations and RunPod Jupyter | Dataset versioning, training, validation, and export |

YOLO26s is the primary model. YOLO26n is a measured fallback for a slow or highly concurrent CPU server; YOLO26m is only a challenger for a suitable NVIDIA/cloud GPU. Model size is selected from validation accuracy and end-to-end latency on the actual deployment machine, not from model-family benchmarks alone.

The OpenCV branch is optional. Periodic full-frame YOLO inference remains the recall-preserving path, so a failed colour mask cannot hide a sign. Full-frame and ROI results are merged, then a class must remain consistent across frames before the system displays or announces it.

## Current status

- The 63-class contract is locked in `dataset/data.yaml`.
- The preliminary OpenCV code demonstrates colour segmentation, contour filtering, broad shape detection, and a hybrid webcam prototype.
- YOLO26s Version 3 fine-tuning from the Version 2 checkpoint is complete.
- The Version 3 canonical 63-class model is installed locally at `models/best.pt`, with ONNX and OpenVINO exports beside it; Version 2 remains available as a rollback model.
- On the untouched Version 3 test split, the selected checkpoint produced precision 0.9304, recall 0.8670, F1 0.8976, mAP50 0.9386, and mAP50-95 0.7770.
- On the reviewed 84-image fixed set at a 20% threshold, Version 3 selected the expected class for 84/84 images. This is a top-class recognition check, not bounding-box mAP.
- The first functional local web application is implemented in `webapp/`: image
  upload, browser camera detection, bounding-box overlays, adjustable confidence,
  stable speech output, sign meanings, session history, CSV export, and local
  difficult-frame collection for a later retraining cycle.

## Project structure

```text
miniproject/
├── dataset/                         # Canonical 63-class config and local data folders
├── models/                          # Local final model, exports, manifest, and model ID mapping
├── training/                        # Colab training, evaluation, and export utilities
├── preliminary/                     # OpenCV and hybrid webcam experiments
├── docs/                            # Dataset, training, design, and report guides
├── enhanced_block_diagram.md        # Active end-to-end system design
├── member4literature_review.md      # Literature synthesis and proposed pipeline
└── plan.md                          # Active web-project plan
```

Older Android/ncnn documents and conversion helpers are archival material from the previous project direction. They are not part of the active server-side web pipeline.

## Run on a phone with Cloudflare Tunnel

Cloudflare Tunnel gives the local FastAPI server a temporary public HTTPS URL. The
laptop performs all YOLO26/OpenVINO inference, so it must stay powered on, awake,
connected to the internet, and running both commands below.

### One-time setup

From PowerShell in the repository root, install the Python dependencies and the
Cloudflare Tunnel client:

```powershell
python -m pip install -r requirements-web.txt
winget install --exact --id Cloudflare.cloudflared
```

Close and reopen PowerShell after installing `cloudflared` so the updated PATH is
available.

### Start the website

Open the first PowerShell window in the repository root and run:

```powershell
python -m uvicorn webapp.main:app --host 127.0.0.1 --port 8000
```

Wait until the terminal shows `Application startup complete`. Keep that window
open. In a second PowerShell window, run:

```powershell
cloudflared tunnel --url http://127.0.0.1:8000
```

If PowerShell cannot find `cloudflared`, use its installed path directly:

```powershell
& "C:\Program Files (x86)\cloudflared\cloudflared.exe" tunnel --url http://127.0.0.1:8000
```

Cloudflare prints a URL similar to
`https://example-words.trycloudflare.com`. Open that HTTPS URL on a phone and
allow camera access. On Android Chrome, select **Menu > Add to Home screen** to
launch it like an app.

The Quick Tunnel address is temporary and changes whenever the tunnel is
restarted. Closing either terminal, allowing the laptop to sleep, restarting the
laptop, or losing internet access makes the public website unavailable. Share the
link only with intended testers because anyone who has it can access the public
endpoint.

## Next phase

1. Validate Version 3 with longer laptop-camera and known no-sign footage, including p50/p95 latency and missed-sign counts.
2. Keep collecting independent examples for classes whose test support remains small.
3. Run `python -m pip install -r requirements-web.txt`, then
   `python -m uvicorn webapp.main:app --host 127.0.0.1 --port 8000`.
4. Validate image upload and live camera behaviour on the target laptop.
5. Preserve `models/mysignvoice_yolo26s_63class_v2/` until Version 3 camera validation is complete.

See `docs/roboflow_training_guide.md` for the exact workflow.

## License note

This repository is an academic project. Before public or commercial web deployment, review the Ultralytics model/code licence and choose an AGPL-compliant open-source release or the appropriate commercial licence.
