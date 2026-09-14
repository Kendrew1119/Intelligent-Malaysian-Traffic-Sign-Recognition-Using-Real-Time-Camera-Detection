# Local manual demo video editor

First clone the repository (or pull the latest `codex/render-deployment` branch), then run these commands from the repository root. Use Python 3.10 or newer:

```powershell
python -m pip install -r demo_editor/requirements.txt
python -m uvicorn demo_editor.server:app --host 127.0.0.1 --port 8001
```

Open http://127.0.0.1:8001 in Edge or Chrome. This editor reads the existing sign catalogue but does not load or change the detector.

Keep the terminal running while editing. Press Ctrl+C to stop. No model downloads, GPU, Cloudflare tunnel, or detector server are needed. Generate voice requires Windows PowerShell and Windows speech synthesis. On other operating systems, use Upload voice with an existing audio recording.

1. Open your recorded MP4 or WebM. Video stays in your browser.
2. Pause at the first appearance of a sign and draw a box.
3. Choose its class and set the start/end seconds.
4. Keep that annotation selected, seek forward, and redraw to add keyframes. Box positions interpolate linearly between keyframes and hold the nearest box outside their range. Use New sign box to annotate another sign, including overlapping signs.
5. Edit guidance and Generate voice, or upload an audio recording. Windows speech synthesis runs locally. Voice starts at the annotation start time; overlapping annotations may produce overlapping speech. Space start times or shorten narration as appropriate.
6. Play to preview. Save project downloads JSON including boxes and audio. Open the original video again when restoring a project.
7. Export downloads a WebM with the original audio (optional), narration and boxes. Export runs in real time, up to 1280 pixels wide at 30 fps. Keep the tab visible and laptop awake. Chrome/Edge must support the video's input codec. Use a standard H.264 MP4 if your phone's HEVC video does not play.

The permanent “Manually annotated demo” overlay identifies this as a demonstration of the intended experience. The boxes are manual annotations, not recorded model predictions, and no confidence scores are fabricated. It should be presented alongside a candid explanation of the live-camera limitations, not as evidence of detection accuracy.

Exports end at the source video's end, so voice that extends beyond it is cut off. Long videos and embedded audio increase memory and project-file size. Keep presentation clips short. Never upload private footage or project files to Git.
