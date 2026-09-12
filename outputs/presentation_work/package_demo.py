from pathlib import Path
import json,shutil,zipfile
ROOT=Path(__file__).resolve().parents[2]
OUT=ROOT/'outputs/MYSignVoice_Presentation'
DEMO=OUT/'demo'
results=json.loads((DEMO/'verification_results.json').read_text())
passed=DEMO/'successful_four_sign_frames'
passed.mkdir(exist_ok=True)
for r in results:
    if r['kind']=='four_sign' and r['passed']:
        shutil.copy2(DEMO/'four_sign_frames'/r['file'],passed/r['file'])
with zipfile.ZipFile(OUT/'MYSignVoice_Demo_Pack.zip','w',zipfile.ZIP_DEFLATED) as z:
    for f in sorted(DEMO.rglob('*')):
        if f.is_file():z.write(f,f.relative_to(OUT))
print('Packaged demo assets')
