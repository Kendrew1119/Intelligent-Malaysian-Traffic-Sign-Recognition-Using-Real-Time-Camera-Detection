# MYSignVoice demonstration pack

## Suggested 5-minute demonstration

1. Play the school-zone recording for 1–2 minutes. Show the scene, detection boxes,
   readable sign names and actual spoken output. Keep the original timing visible.
   Use a fixed camera or a passenger to operate the recording setup.
2. Spend the remaining time showing class examples. The `single_signs` folder
   contains one unchanged original input for each of the 48 available classes.
   Each filename starts with the model's numeric class ID.
3. Add an image for each of the 15 remaining classes listed in `class_coverage.csv`.
   Check the predicted class before recording. Do not label the existing set as
   a 63-class demonstration until those extra examples are included.

To fit 63 classes into about 3 minutes, record the image-upload results first and
edit them into a clearly labelled sequence of about 2 seconds per class, leaving
time for the introduction and a few speech examples. Retain actual labels and
confidence values. This is a coverage demonstration, not a new accuracy test.

## Files

- `single_signs/`: 48 unchanged source images, one per represented class.
- `four_sign_frames/`: 12 exploratory 2-by-2 collages built from those images.
- `successful_four_sign_frames/`: the 4 collages that returned all expected
  classes in the recorded API check.
- `class_coverage.csv`: complete 63-class checklist with the remaining 15 marked.
- `class_inventory.json`: original source-image locations and class mapping.
- `four_sign_manifest.json`: expected classes for each collage, in top-left,
  top-right, bottom-left, bottom-right order.
- `verification_results.json`: complete detections, confidences, times, misses
  and extra classes from the verification run.

## Verification result

The running local YOLO26s/OpenVINO API checked these files at a 0.20 confidence
threshold during preparation:

- Single images: 48/48 returned the expected class, with no extra class detections.
- Four-sign frames: 4/12 returned all four expected classes.
- Across all collages: 36/48 expected signs appeared, with 11 extra class detections.

The collages preserve whole source images and aspect ratio within each tile.
Resizing and changed context make their result different from testing the
originals separately. The successful collages are selected examples for a demo;
they must not be presented as an unbiased performance estimate.

## Local website and phone access

In the repository root, run the server in PowerShell:

```powershell
python -m uvicorn webapp.main:app --host 127.0.0.1 --port 8000
```

In another PowerShell window, start the HTTPS tunnel:

```powershell
cloudflared tunnel --url http://127.0.0.1:8000
```

Open the printed HTTPS URL on the phone. Keep the laptop awake and both processes
running. A Quick Tunnel URL changes after restart.

## Remaining classes to add

- ID 3: bumps-warning
- ID 4: bus-stop
- ID 5: camera-operation-zone
- ID 7: chevron-left
- ID 8: chevron-right
- ID 11: cow-nearby-warning
- ID 12: crossroad-left-warning
- ID 17: height-limit
- ID 26: no-parking
- ID 31: parking-area
- ID 38: road-narrows-left-warning
- ID 39: road-narrows-right-warning
- ID 40: roadway-diverges-warning
- ID 43: slippery-road-warning
- ID 57: towing-area

Numbers above are model class IDs, not list sequence numbers.
