from pathlib import Path
import csv, json, shutil, zipfile, xml.etree.ElementTree as ET
ROOT=Path(__file__).resolve().parents[2]
WORK=ROOT/'outputs/presentation_work'
OUT=ROOT/'outputs/MYSignVoice_Presentation'
DEMO=OUT/'demo'
for p in [OUT,DEMO/'single_signs',DEMO/'four_sign_frames',WORK/'assets']:
    p.mkdir(parents=True,exist_ok=True)
def rows(p):
    with (ROOT/p).open(encoding='utf-8-sig',newline='') as f:return list(csv.DictReader(f))
def js(p):return json.loads((ROOT/p).read_text(encoding='utf-8'))
dist=rows('training/results/v3/report_artifacts/class_distribution.csv')
mapping=rows('outputs/v2_v3_84_comparison/per_image_comparison.csv')
files={p.name:p for p in (ROOT/'Color Inputs').rglob('*.png')}
selected=[]
for c in dist:
    candidates=[r for r in mapping if r['expected_class']==c['class_name'] and r['source_image'] in files]
    if not candidates:continue
    r=max(candidates,key=lambda r:float(r['v3_top_confidence']))
    filename=f"{int(c['class_id']):02d}_{c['class_name']}.png"
    shutil.copy2(files[r['source_image']],DEMO/'single_signs'/filename)
    selected.append({'class_id':int(c['class_id']),'class_name':c['class_name'],'original':str(files[r['source_image']].relative_to(ROOT)),'file':filename})
missing=[{'class_id':int(c['class_id']),'class_name':c['class_name']} for c in dist if c['class_name'] not in {s['class_name'] for s in selected}]
data={'v3':js('models/model_manifest.json'),'v1_test':rows('training/results/final_v1/report_artifacts/final_test_tuned_cls_pw_025/final_test_summary.csv')[0],
      'v1_baseline':rows('training/results/final_v1/baseline_results.csv'),'v1_tuned':rows('training/results/final_v1/tuned_results.csv'),
      'distribution':dist,'split':rows('training/results/v3/report_artifacts/dataset_split_summary.csv'),
      'v3_per_class_validation':rows('training/results/v3/report_artifacts/validation_per_class_comparison.csv'),
      'benchmark':js('outputs/v3_84_benchmark/benchmark_summary.json'),'selected':selected,'missing':missing}
(WORK/'evidence.json').write_text(json.dumps(data,indent=2),encoding='utf-8')
(DEMO/'class_inventory.json').write_text(json.dumps({'available':selected,'remaining':missing},indent=2),encoding='utf-8')
with (DEMO/'class_coverage.csv').open('w',newline='',encoding='utf-8-sig') as f:
    w=csv.DictWriter(f,fieldnames=['class_id','class_name','status','file']);w.writeheader()
    for c in dist:
        s=next((s for s in selected if s['class_name']==c['class_name']),None)
        w.writerow({'class_id':c['class_id'],'class_name':c['class_name'],'status':'Image available' if s else 'Add image manually','file':s['file'] if s else ''})
print('Selected',len(selected),'Remaining',len(missing))
print('Missing:',', '.join(m['class_name'] for m in missing))
# Retain source slide text and report text for source checks without modifying originals.
for src in [Path('D:/MYSignVoice_Mini_Project_Report_2_Group_4_Team_4.docx'),Path('D:/MYSignVoice_Final_Report_5_Chapters_final.docx')]:
    with zipfile.ZipFile(src) as z:
        root=ET.fromstring(z.read('word/document.xml'))
        ns={'w':'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
        paras=[''.join(p.itertext()) for p in []]
        paras=[''.join(t.text or '' for t in p.findall('.//w:t',ns)) for p in root.findall('.//w:p',ns)]
        (WORK/(src.stem+'.txt')).write_text('\n'.join(paras),encoding='utf-8')

