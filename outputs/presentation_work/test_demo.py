from pathlib import Path
import json,time,urllib.request,uuid,statistics
ROOT=Path(__file__).resolve().parents[2]
DEMO=ROOT/'outputs/MYSignVoice_Presentation/demo'
inventory=json.loads((DEMO/'class_inventory.json').read_text())
groups=json.loads((DEMO/'four_sign_manifest.json').read_text())
def predict(path):
    boundary='----mysignvoice'+uuid.uuid4().hex
    body=(f'--{boundary}\r\nContent-Disposition: form-data; name="confidence"\r\n\r\n0.20\r\n--{boundary}\r\nContent-Disposition: form-data; name="image"; filename="{path.name}"\r\nContent-Type: image/png\r\n\r\n').encode()+path.read_bytes()+f'\r\n--{boundary}--\r\n'.encode()
    req=urllib.request.Request('http://127.0.0.1:8000/api/detect',data=body,headers={'Content-Type':f'multipart/form-data; boundary={boundary}'})
    started=time.perf_counter()
    with urllib.request.urlopen(req,timeout=60) as response:data=json.load(response)
    data['round_trip_ms']=round((time.perf_counter()-started)*1000,1)
    return data
results=[]
for s in inventory['available']:
    r=predict(DEMO/'single_signs'/s['file'])
    found={d['class_name'] for d in r['detections']}
    row={'kind':'single','file':s['file'],'expected':[s['class_name']],'passed':s['class_name'] in found,'missing':list({s['class_name']}-found),'extra':list(found-{s['class_name']}),'response':r}
    results.append(row);print(s['file'],row['passed'],r['total_ms'],flush=True)
for s in groups:
    r=predict(DEMO/'four_sign_frames'/s['file']);found={d['class_name'] for d in r['detections']};expected=set(s['expected'])
    row={'kind':'four_sign','file':s['file'],'expected':s['expected'],'passed':expected.issubset(found),'missing':list(expected-found),'extra':list(found-expected),'response':r}
    results.append(row);print(s['file'],row['passed'],'missing',row['missing'],flush=True)
(DEMO/'verification_results.json').write_text(json.dumps(results,indent=2),encoding='utf-8')
print('Summary',sum(r['passed'] for r in results if r['kind']=='single'),'/48 singles',sum(r['passed'] for r in results if r['kind']=='four_sign'),'/12 collages',flush=True)
