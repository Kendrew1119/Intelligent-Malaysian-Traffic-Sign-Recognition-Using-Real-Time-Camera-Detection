"""Independent, loopback-only manual video demonstration editor."""
import os
from pathlib import Path
import subprocess
import tempfile

from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse, Response
from pydantic import BaseModel, Field
from webapp.sign_catalog import SIGN_DETAILS

app = FastAPI(title="MYSignVoice Manual Demo Editor")
HERE = Path(__file__).resolve().parent


@app.get("/")
def index():
    return FileResponse(HERE / "index.html")


@app.get("/catalog")
def catalog():
    return [{"label": label, "guidance": " ".join(detail)} for label, detail in sorted(SIGN_DETAILS.items())]


class Speech(BaseModel):
    text: str = Field(min_length=1, max_length=1200)


@app.post("/speech")
def speech(request: Speech):
    # Text is passed as environment data, never interpolated into executable code.
    with tempfile.TemporaryDirectory(prefix="mysignvoice-speech-") as folder:
        target = Path(folder) / "speech.wav"
        env = dict(os.environ, DEMO_SPEECH_TEXT=request.text, DEMO_SPEECH_PATH=str(target))
        script = """Add-Type -AssemblyName System.Speech
$speaker = New-Object System.Speech.Synthesis.SpeechSynthesizer
try {
 $speaker.SetOutputToWaveFile($env:DEMO_SPEECH_PATH)
 $speaker.Speak($env:DEMO_SPEECH_TEXT)
} finally { $speaker.Dispose() }
"""
        try:
            subprocess.run(["powershell.exe", "-NoProfile", "-NonInteractive", "-Command", script], env=env,
                           check=True, capture_output=True, timeout=90,
                           creationflags=subprocess.CREATE_NO_WINDOW)
            return Response(target.read_bytes(), media_type="audio/wav")
        except (subprocess.SubprocessError, OSError) as exc:
            raise HTTPException(500, "Windows speech generation failed. You can upload a voice recording instead.") from exc
