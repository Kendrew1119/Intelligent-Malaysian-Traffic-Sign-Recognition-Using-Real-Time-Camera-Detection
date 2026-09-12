import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { pathToFileURL } from 'node:url';
import { Presentation, PresentationFile } from '@oai/artifact-tool';
import sharp from 'sharp';
process.on('uncaughtException',e=>{console.error('Build error:',e.message);process.exit(1);});
process.on('unhandledRejection',e=>{console.error('Build error:',e?.message||e);process.exit(1);});
const ROOT=process.cwd(), WORK=path.join(ROOT,'outputs/presentation_work'), OUT=path.join(ROOT,'outputs/MYSignVoice_Presentation');
const SKILL='C:/Users/Hui Min/.codex/plugins/cache/openai-primary-runtime/presentations/26.909.12148/skills/presentations';
const PYTHON='C:/Users/Hui Min/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/python.exe';
const SOURCE='D:/Traffic Sign Detection for AVs (1).pptx';
const data=JSON.parse(await fs.readFile(path.join(WORK,'evidence.json'),'utf8'));
const demo=JSON.parse(await fs.readFile(path.join(OUT,'demo/verification_results.json'),'utf8'));
const {finalizePresentation}=await import(pathToFileURL(path.join(SKILL,'container_tools/artifact_tool_utils.mjs')).href);
const proto=JSON.parse(await fs.readFile(path.join(WORK,'template/source-proto.json'),'utf8'));
for(const im of proto.images||[])if(im.data && !(im.data instanceof Uint8Array))im.data=Uint8Array.from(Object.values(im.data));
for(const f of proto.fonts||[])for(const face of f.embeddedFonts||[])if(face.data && !(face.data instanceof Uint8Array))face.data=Uint8Array.from(Object.values(face.data));
const sourceSlides=proto.slides;
const G='#212B21',O='#F5A000',C='#FFFDFA',M='#80875A',GRAY='#60655E';
const F='Open Sauce', FH='Open Sauce Medium';
const E=9525;
const specs=[];
function base(sourceNumber,title,presenter){
 const s=structuredClone(sourceSlides[sourceNumber-1]);
 s.id='mysign-'+String(specs.length+1);s.index=specs.length;delete s.creationId;
 if(sourceNumber===31){
  s.elements=s.elements.filter(e=>e.type===1);
  const sun=structuredClone(sourceSlides[6].elements.find(e=>e.id==='2'));
  const rule=structuredClone(sourceSlides[6].elements.find(e=>e.id==='3'));
  sun.id='sun';rule.id='rule';rule.bbox.xEmu=E*830;rule.bbox.widthEmu=E*400;
  s.elements.unshift(sun,rule);
  const [t,p]=s.elements.filter(e=>e.type===1);
  set(t,title,108,142,1700,92,60,true,G);
  set(p,`Presented by ${presenter}`,158,78,660,44,28,false,G);
 }
 specs.push({s,title,presenter,minutes:0,notes:''});return specs.at(-1);
}
function set(el,text,x,y,w,h,size,bold,color){
 el.bbox={xEmu:x*E,yEmu:y*E,widthEmu:w*E,heightEmu:h*E,rotation:0};
 el.textStyle={anchor:1,bottomInset:0,leftInset:0,rightInset:0,topInset:0};
 el.paragraphs=[{id:'',runs:[{id:'',text,textStyle:{fontSize:size*75,bold,typeface:bold?FH:F,fill:{type:1,color:{type:1,value:color.slice(1)},gradientStops:[],pictureEffects:[]}},citations:[],reviewMarkIds:[]}],level:0,inlineNodes:[],textStyle:{alignment:1},paragraphStyle:{tabStops:[]}}];
}
const defs=[
 [1,'MYSignVoice','Aedan Loh'],
 [31,'1.1 PURPOSE AND TARGET USERS','Aedan Loh'],
 [31,'1.2 OUR CONTRIBUTION','Aedan Loh'],
 [31,'3.1 FRONTEND AND USER EXPERIENCE','Tan Hui Min'],
 [31,'3.2 BACKEND DESIGN','Tan Hui Min'],
 [31,'3.3 CAMERA CONFIRMATION AND SPEECH','Tan Hui Min'],
 [31,'3.4 SYSTEM ARCHITECTURE','Kendrew Lim Yan Zhe'],
 [31,'3.5 DEEP LEARNING WORKFLOW','Kendrew Lim Yan Zhe'],
 [31,'3.6 DATASET AND EVALUATION DESIGN','Kendrew Lim Yan Zhe'],
 [31,'4.1 TRAINING AND VALIDATION CURVES','Kendrew Lim Yan Zhe'],
 [31,'4.2 PRECISION, RECALL AND CONFIDENCE','Kendrew Lim Yan Zhe'],
 [31,'4.3 FINAL DEPLOYED MODEL RESULTS','Crystalina Dibble'],
 [31,'4.4 DETECTION SPEED','Crystalina Dibble'],
 [31,'4.5 FUNCTIONAL AND CLASS TESTING','Crystalina Dibble'],
 [31,'4.6 ERROR ANALYSIS','Crystalina Dibble'],
 [31,'4.7 BETA TESTING','Crystalina Dibble'],
 [31,'5.1 LIMITATIONS AND IMPROVEMENTS','Crystalina Dibble'],
 [31,'5.2 CONCLUSION','Aedan Loh'],
 [31,'DEMONSTRATION','Tan Hui Min'],
 [59,'THANK YOU','Team 4'],
 [31,'BACKUP: VERSION 1 LOSS DETAILS','Kendrew Lim Yan Zhe'],
 [31,'BACKUP: VERSION 1 EVALUATION CURVES','Kendrew Lim Yan Zhe'],
 [31,'BACKUP: VERSION 1 CONFUSION MATRIX','Kendrew Lim Yan Zhe'],
];
defs.forEach(d=>base(...d));
const cover=specs[0].s;
set(cover.elements.find(e=>e.id==='6'),'MYSignVoice',108,250,1670,150,110,true,'#FFFFFF');
set(cover.elements.find(e=>e.id==='4'),'Traffic-sign information through vision and speech',108,440,1600,95,46,false,O);
set(cover.elements.find(e=>e.id==='5'),'Group 4 / Team 4',932,110,690,40,28,false,'#FFFFFF');
const closing=specs[19].s;
set(closing.elements.find(e=>e.id==='4'),'MYSignVoice',163,110,480,55,28,false,'#FFFFFF');
set(closing.elements.find(e=>e.id==='13'),'THANK YOU\nQuestions and discussion',108,390,1580,240,82,true,'#FFFFFF');
// Preserve the template masters, themes, embedded fonts and visual ornaments.
// Remove old slide-specific charts so obsolete workbook references cannot enter the new deck.
proto.slides=specs.map(s=>s.s);proto.charts=[];proto.threads=[];
const usedMedia=new Set();
function collectMedia(v){if(typeof v==='string'&&v.startsWith('/ppt/media/'))usedMedia.add(v);else if(Array.isArray(v))v.forEach(collectMedia);else if(v&&typeof v==='object')Object.values(v).forEach(collectMedia);}
collectMedia(proto.slides);collectMedia(proto.layouts);
proto.images=proto.images.filter(im=>usedMedia.has(im.id));
const p=Presentation.load(proto);
await fs.mkdir(path.join(WORK,'draft'),{recursive:true});
await fs.mkdir(path.join(WORK,'rendered'),{recursive:true});
function text(i,value,x,y,w,h,size=36,color=G,bold=false){
 const s=p.slides.items[i-1];const sh=s.shapes.add({name:`s${i}-text-${s.shapes.items.length}`,geometry:'textbox',position:{left:x,top:y,width:w,height:h},fill:'none',line:{fill:'none',width:0}});
 sh.text=value;sh.text.style={fontSize:size,typeface:bold?FH:F,color,bold,autoFit:'none',verticalAlignment:'top'};return sh;
}
function topic(i,title,body,x,y,w=770){text(i,title,x,y,w,60,42,O,true);text(i,body,x,y+72,w,150,36,G);}
function footer(i,value){text(i,value,108,1002,1640,42,25,GRAY);}
async function image(i,file,x,y,w,h,alt){const s=p.slides.items[i-1];s.images.add({blob:new Uint8Array(await fs.readFile(path.resolve(ROOT,file))),contentType:file.toLowerCase().endsWith('.jpg')?'image/jpeg':'image/png',position:{left:x,top:y,width:w,height:h},fit:'contain',alt});}
function notes(i,minutes,body,sources=[]){specs[i-1].minutes=minutes;specs[i-1].notes=body;p.slides.items[i-1].speakerNotes.textFrame.setText(`Presenter: ${specs[i-1].presenter}\nSuggested time: ${minutes?Math.round(minutes*60)+' seconds':'Backup / transition'}\n\n${body}\n\nSources:\n${sources.join('\n')}`);}
const chartOwners=[];
function chart(i,type,categories,series,frame,options={}){
 const s=p.slides.items[i-1];const ch=s.charts.add(type,{position:frame,categories,series,hasLegend:series.length>1,legend:{position:'bottom',textStyle:{typeface:F,fontSize:25,fill:G}},chartFill:C,plotAreaFill:C,xAxis:{textStyle:{typeface:F,fontSize:25,fill:G},majorGridlines:null},yAxis:{textStyle:{typeface:F,fontSize:25,fill:G},majorGridlines:{fill:'#D8DAD2',width:1}},...options});
 chartOwners.push(i);return ch;
}
function table(i,values,frame,widths){
 const s=p.slides.items[i-1];const t=s.tables.add({rows:values.length,columns:values[0].length,left:frame.left,top:frame.top,width:frame.width,height:frame.height,columnWidths:widths,values});
 t.borders.assign({fill:'#D2D5CC',width:1,style:'solid'});
 for(let r=0;r<values.length;r++)for(let c=0;c<values[r].length;c++){const cell=t.getCell(r,c);cell.fill=r===0?G:r%2?'#F1F0E7':C;cell.text.style={typeface:F,fontSize:32,color:r===0?'#FFFFFF':G,bold:r===0};}
 return t;
}
// 1: Retained cover design.
text(1,'Visual accessibility support\nwith driver awareness as a secondary use',108,585,1520,160,42,'#FFFFFF');
text(1,'Aedan Loh   /   Crystalina Dibble   /   Tan Hui Min   /   Kendrew Lim Yan Zhe',108,890,1710,90,29,'#FFFFFF');
notes(1,.30,'Introduce MYSignVoice as a traffic-sign information prototype. The main design goal is to make visible sign information available through speech. It is not a navigation system or a medical aid.');
// 2
topic(2,'Primary design goal','Make traffic-sign labels and meanings available through speech for users who find visual sign information difficult to read.',108,292,1040);
topic(2,'Secondary use','Support driver sign awareness and road-sign learning in demonstrations and supervised use.',108,565,1040);
text(2,'Current boundary',1240,302,560,60,40,O,true);
text(2,'The prototype identifies signs.\n\nIt does not locate safe crossings, detect approaching vehicles or guide an independent journey.',1240,385,560,360,36,G);
footer(2,'Accessibility is the intended use. Effectiveness with target users still requires evaluation.');
notes(2,.85,'Describe an example: a person can hear the name and meaning of a sign instead of relying only on the screen. Our prototype can support access to sign information, but this is a design goal rather than a proven outcome for people with visual impairment. Driver awareness is a secondary application. We have not implemented route guidance or crossing decisions.',['webapp/sign_catalog.py','webapp/static/app.js']);
// 3
topic(3,'Sign labels and meanings','63 Malaysian sign classes, with a plain-language meaning and an action message.',108,290);
topic(3,'Speech for multiple signs','The camera announces newly confirmed classes. Uploaded images have a replay button.',1020,290);
topic(3,'Confirmation before speech','Spatial matching, repeated observations and a cooldown reduce unstable or repeated speech.',108,605);
topic(3,'Numeric cross-check','OCR checks speed-limit digits while YOLO remains the fallback when OCR is uncertain.',1020,605);
footer(3,'Contribution: integration and interaction design using existing detection and OCR methods.');
notes(3,.75,'Present novelty as the way the system combines components for Malaysian sign information, not as a new neural-network architecture. The output includes meaning and speech, and the camera confirms signs over time. The system also checks the number inside a speed-limit sign. Hand over to Hui Min for the working interface.',['webapp/sign_catalog.py','webapp/static/app.js','webapp/speed_limit_ocr.py']);
// 4
await image(4,'outputs/presentation_work/assets/app_upload.png',100,255,1190,690,'Actual MYSignVoice image-upload interface with speed-limit detection');
text(4,'Visual and audio output',1340,285,470,65,37,O,true);
text(4,'Image upload or live camera\n\nSign label, confidence and box\n\nMeaning and guidance\n\nSpeech replay for uploads\n\nHistory with processing time',1340,380,470,550,34,G);
footer(4,'Actual application capture. Voice output complements the visual result.');
notes(4,.80,'Explain the two modes and point to the real interface. A user can upload an image, read the class and meaning, and press the speaker icon to hear it. The live camera uses automatic confirmation before speech. History includes processing milliseconds. These functions support the accessibility goal, although we still need a target-user evaluation.',['webapp/static/index.html','webapp/static/app.js']);
// 5
table(5,[['Stage','Backend responsibility'],['Receive','Accept an image and confidence threshold'],['Validate','Check file type, content and 12 MB limit'],['Infer','Run the loaded YOLO26s OpenVINO model'],['Check digits','Apply OCR only to speed-limit detections'],['Respond','Return class, confidence, box and processing time']],{left:108,top:285,width:1150,height:595},[270,880]);
text(5,'FastAPI service',1330,300,470,60,42,O,true);
text(5,'Model loads once at startup.\n\nA lock serializes detector calls.\n\nNormal frames are decoded in memory.\n\nThe browser receives structured JSON.',1330,400,470,450,35,G);
footer(5,'The laptop runs inference. The phone supplies images and presents the response.');
notes(5,.90,'Explain one request from the browser. The API checks the upload, decodes it to an image, runs the detector, and returns JSON. The model stays loaded instead of loading again per frame. Detector calls use a lock to avoid simultaneous access. OCR only runs on speed-limit proposals, so ordinary signs avoid that work.',['webapp/main.py','webapp/inference.py']);
// 6
topic(6,'1. Capture the next frame','Camera requests do not overlap. The browser waits for a response before sending another frame.',108,280);
topic(6,'2. Match the sign over time','A strong detection needs 2 matches. Other accepted signs need 3 matching detections.',1020,280);
topic(6,'3. Confirm and announce','Newly confirmed sign classes enter one speech message, including multiple classes in the frame.',108,595);
topic(6,'4. Control repetition','A 5-second class cooldown limits repeat announcements. Upload speech starts when the user taps replay.',1020,595);
footer(6,'These rules filter unstable messages; they do not guarantee that a class is correct.');
notes(6,.90,'The camera has to balance missed signs against noisy speech. Spatial matching compares overlapping boxes, centre movement and size. High-confidence signs require two observations; others need three. Multiple confirmed classes can be spoken together. The five-second cooldown reduces repetition. Explain that an error repeated consistently could still be announced.',['webapp/static/app.js','webapp/static/camera_safety.js']);
// 7
await image(7,'outputs/presentation_work/assets/system_architecture.png',90,250,1280,720,'Generated illustration of browser, Cloudflare Tunnel and laptop FastAPI architecture');
text(7,'Deployment used for the demo',1420,300,390,105,39,O,true);
text(7,'Phone browser\n\nHTTPS tunnel\n\nLaptop server\n\nYOLO26s + OCR\n\nResults back to browser',1420,440,390,455,35,G);
footer(7,'OCR is optional per detection. The laptop and tunnel must remain running.');
notes(7,.90,'Walk through the diagram from left to right, then back to the browser. Cloudflare provides an HTTPS route to the laptop; it does not run the model. FastAPI executes inference using OpenVINO. Only speed-limit candidates go through OCR. Browser logic confirms camera detections and produces speech. The illustration represents the implementation; it is not a cloud-compute architecture.',['webapp/main.py','webapp/inference.py','README.md: Run on a phone with Cloudflare Tunnel','Architecture illustration generated for this project']);
// 8
await image(8,'outputs/presentation_work/assets/training_workflow.png',100,260,1250,720,'Generated illustration of training, validation, held-out testing and OpenVINO deployment');
text(8,'What the model learns',1390,300,420,110,40,O,true);
text(8,'Image features\n\nSign location\n\nSign class\n\nTraining updates weights. Validation selects a checkpoint. The test set measures the selected model.',1390,435,420,500,35,G);
footer(8,'YOLO26s is the detector. OpenVINO is the exported runtime used on the CPU.');
notes(8,.80,'Explain supervised object detection using labelled images, bounding boxes and class IDs. Training adjusts weights; validation informs checkpoint selection; the held-out test is reserved for evaluation. Export changes the runtime format rather than replacing the trained task. Avoid implying that our project invented YOLO or that the test set updates the model.',['models/model_manifest.json','models/best_openvino_model/metadata.yaml','training/build_yolo26_v3_runpod_notebook.py']);
// 9
chart(9,'bar',['Training','Validation','Test'],[{name:'Images',values:[6274,1619,838],fill:G,valuesFormatCode:'#,##0'}],{left:100,top:320,width:1030,height:570},{barOptions:{direction:'column',grouping:'clustered',gapWidth:100},yAxis:{min:0,max:7000,majorUnit:1000,numberFormatCode:'#,##0',textStyle:{typeface:F,fontSize:27},majorGridlines:{fill:'#D8DAD2',width:1}},dataLabels:{showValue:true,position:'outEnd',textStyle:{typeface:F,fontSize:32,bold:true}}});
text(9,'8,731 images',1220,300,570,95,66,G,true);
text(9,'63 classes',1220,410,570,70,45,O,true);
text(9,'Related camera images stay in the same split.\n\nAugmentation applies to training.\n\nThe final test has 838 images and 867 labelled signs.',1220,530,570,350,35,G);
footer(9,'Version 3 dataset. Class support is uneven, so aggregate scores do not describe every class.');
notes(9,.80,'These are the final Version 3 image counts. Explain the separate roles of the training, validation and test splits. Related frames must stay together to avoid similar images leaking across sets. The class distribution is uneven. Some rare classes have very few test examples, which limits conclusions about those classes.',['training/results/v3/report_artifacts/dataset_split_summary.csv','training/results/v3/report_artifacts/class_distribution.csv','models/model_manifest.json']);
// 10: Native curves from the saved Version 1 run; no claim that they belong to V3.
const hist=data.v1_baseline;
const epochs=hist.map(r=>r.epoch);
text(10,'VERSION 1 TRAINING RECORD',108,265,1680,60,34,O,true);
text(10,'Box loss',108,350,770,60,38,G,true);
chart(10,'line',epochs,[{name:'Training',values:hist.map(r=>+r['train/box_loss']),line:{fill:G,width:3}},{name:'Validation',values:hist.map(r=>+r['val/box_loss']),line:{fill:O,width:3}}],{left:90,top:425,width:800,height:470},{xAxis:{title:'Epoch',textStyle:{typeface:F,fontSize:22}},yAxis:{numberFormatCode:'0.0',textStyle:{typeface:F,fontSize:24},majorGridlines:{fill:'#D8DAD2',width:1}}});
text(10,'Validation mAP',1000,350,770,60,38,G,true);
chart(10,'line',epochs,[{name:'mAP@0.5',values:hist.map(r=>+r['metrics/mAP50(B)']),line:{fill:G,width:3}},{name:'mAP@0.5:0.95',values:hist.map(r=>+r['metrics/mAP50-95(B)']),line:{fill:O,width:3}}],{left:985,top:425,width:810,height:470},{xAxis:{title:'Epoch',textStyle:{typeface:F,fontSize:22}},yAxis:{min:0,max:1,numberFormatCode:'0%',textStyle:{typeface:F,fontSize:24},majorGridlines:{fill:'#D8DAD2',width:1}}});
footer(10,'Earlier Version 1 run: learning progresses and then levels off. Final deployed scores appear on slide 12.');
notes(10,1.0,'These curves come from the saved Version 1 baseline training record. Lower loss means the predicted boxes better match the labels. Validation mAP increases and then approaches a plateau. The stricter mAP across IoU thresholds stays lower because it demands more accurate localization. Version 3 is a later fine-tuned model, and its test results are reported separately.',['training/results/final_v1/baseline_results.csv','training/results/final_v1/report_artifacts/baseline_summary.csv']);
// 11
const v1dir='training/results/final_v1/report_artifacts/final_test_tuned_cls_pw_025';
await image(11,`${v1dir}/BoxPR_curve.png`,80,310,900,570,'Version 1 tuned-model held-out precision-recall curve');
await image(11,`${v1dir}/BoxF1_curve.png`,965,310,875,570,'Version 1 tuned-model held-out F1 versus confidence curve');
text(11,'Precision–recall curve',108,253,850,55,37,O,true);
text(11,'F1 versus confidence',1000,253,800,55,37,O,true);
footer(11,'Version 1 tuned-model test curves. The deployed app uses separate upload and camera thresholds.');
notes(11,.80,'Explain precision as how often a reported sign is correct and recall as how many labelled signs are found. Raising confidence can reduce false positives but also miss more signs. F1 balances precision and recall. These are Version 1 tuned-model curves and do not establish an optimal threshold for every camera condition. The app uses 20% for uploads and a higher default for camera mode.',['training/results/final_v1/report_artifacts/final_test_tuned_cls_pw_025/BoxPR_curve.png','training/results/final_v1/report_artifacts/final_test_tuned_cls_pw_025/BoxF1_curve.png','webapp/static/app.js']);
// 12
chart(12,'bar',['Precision','Recall','F1','mAP@0.5','mAP@0.5:0.95'],[{name:'Version 3 test',values:[.930449,.866991,.8976,.938563,.776968],fill:G,valuesFormatCode:'0.00%'}],{left:80,top:340,width:1250,height:565},{barOptions:{direction:'column',grouping:'clustered',gapWidth:70},yAxis:{min:0,max:1,numberFormatCode:'0%',textStyle:{typeface:F,fontSize:26},majorGridlines:{fill:'#D8DAD2',width:1}},xAxis:{textStyle:{typeface:F,fontSize:25}},dataLabels:{showValue:true,position:'outEnd',textStyle:{typeface:F,fontSize:30,bold:true}}});
text(12,'93.86%',1400,350,420,125,82,G,true);text(12,'mAP@0.5',1400,485,420,65,40,O,true);
text(12,'838 test images\n867 labelled signs\n\nRecall remains below precision: some signs are still missed.',1400,600,420,310,35,G);
footer(12,'Version 3 held-out detection evaluation. mAP is a detection metric, not per-image classification accuracy.');
notes(12,.85,'State the final deployed Version 3 results: precision 93.04%, recall 86.70%, F1 89.76%, mAP at 0.5 of 93.86%, and stricter mAP of 77.70%. The precision-recall difference means missed signs remain important. The test set contains 838 images and 867 labelled objects. Do not describe the 84-image recognition result as the test-set accuracy.',['models/model_manifest.json','training/results/v3/report_artifacts/final_test_comparison.csv']);
// 13
table(13,[['Detector mode','Frames with detections','Throughput'],['Full frame','84 / 84','3.34 FPS'],['ROI only','2 / 84','76.63 FPS'],['Periodic hybrid','19 / 84','13.98 FPS']],{left:108,top:320,width:1180,height:440},[390,430,360]);
text(13,'Why we kept full frame',1370,310,460,110,41,O,true);
text(13,'The fast ROI route skipped most signs in this image sequence.\n\nFull-frame processing retained detection coverage.\n\nAbout 300 ms per image in this saved benchmark.',1370,475,460,410,35,G);
footer(13,'Same 84-image sequence, CPU benchmark, detector stage before temporal confirmation. Coverage is not recall.');
notes(13,.80,'Explain why the fastest measured option was not selected. ROI-only processing ran quickly because it submitted very few candidate crops to YOLO. It found detections on only 2 of the 84 images. Full-frame processing detected a sign in every image, at about 3.34 FPS. This benchmark has no ground-truth boxes, so the coverage measure must not be called recall. The hybrid interval also skips full scans in this independent-image sequence; it is not a video tracking comparison.',['outputs/v3_84_benchmark/benchmark_summary.json']);
// 14
topic(14,'Held-out detection test','838 images and 867 labelled objects. Precision, recall and mAP measure detection quality.',108,285);
topic(14,'Reviewed image check','84 / 84 expected top classes at a 20% threshold. The set represents 48 distinct classes.',1020,285);
topic(14,'Prepared demonstration set','48 / 48 selected original images returned the expected class through the local API.',108,600);
topic(14,'Application checks','Image upload, live camera, speech replay, multi-sign confirmation and history support the demonstration.',1020,600);
footer(14,'Current prepared demo coverage: 48 of 63 supported classes.');
notes(14,.70,'Keep the evidence levels separate. Held-out detection metrics assess a labelled test set. The reviewed 84 images assess the highest-confidence class only and cover 48 classes. We have also rechecked one original demo image for each available class through the running API; all 48 returned the expected class. The team will supply the remaining 15 examples. A prepared successful demo is not a replacement for an unbiased test.',['outputs/v2_v3_84_comparison/summary.json','outputs/MYSignVoice_Presentation/demo/verification_results.json','outputs/MYSignVoice_Presentation/demo/class_coverage.csv']);
// 15
topic(15,'Crowded frames','Only 4 / 12 trial collages returned all four expected classes. Sign scale and context changed after compositing.',108,285);
topic(15,'Missed detections','Final test recall is 86.70%. High precision does not mean the detector finds every sign.',1020,285);
topic(15,'Uneven class support','Rare classes have few test examples. More varied samples are needed to assess them reliably.',108,600);
topic(15,'Unknown signs and OCR','The model has 63 classes. Unsupported signs may receive a known label; weak digit crops remain difficult.',1020,600);
footer(15,'Collage test: 36 / 48 expected signs found, with 11 extra class detections across 12 frames.');
notes(15,.85,'Use the new collage test as an honest stress example. Every selected sign worked alone, but putting four full images in one square frame changed apparent size and context. Across 12 collages, 36 of 48 expected classes appeared and 11 additional class detections appeared; only four frames recovered all four expected classes. These figures are not mAP and we have not isolated the exact cause of each error. The model also has a closed set of supported labels.',['outputs/MYSignVoice_Presentation/demo/verification_results.json','models/model_manifest.json','training/results/v3/report_artifacts/class_distribution.csv']);
// 16
text(16,'PROPOSED USER EVALUATION',108,270,1600,55,34,O,true);
topic(16,'Participants and tasks','Invite non-team participants and, where feasible, users who experience difficulty reading signs. Use a stationary demonstration.',108,385,800);
topic(16,'What we will measure','Task completion, spoken-message clarity, repeat-message burden, readability and time to understand the result.',1020,385,800);
text(16,'Short procedure',108,740,700,60,39,O,true);
text(16,'Upload a sign, listen to the result, explain its meaning, then rate the experience and suggest improvements.',108,825,1660,120,37,G);
footer(16,'Planned evaluation. No participant results are reported.');
notes(16,.50,'Describe beta testing as the next user-evaluation step. Ask participants outside the team to complete tasks and provide feedback, and involve target users where feasible. Use the questionnaire to assess speech clarity, repetition and readability. Participant results remain to be collected and verified.',['D:/MYSignVoice_Final_Report_5_Chapters_final.docx: sections 4.6, 5.2 and Appendix B']);
// 17
table(17,[['Current limitation','Next improvement'],['Limited real-world evidence','Test blur, night, glare, occlusion and unsupported signs'],['Laptop and internet dependence','Evaluate on-device inference and a persistent host'],['Accessibility still unvalidated','Co-design controls, contrast and speech with target users'],['Crowded scenes and small signs','Collect multi-sign scenes and evaluate larger input sizes'],['Uneven training examples','Add rare classes and negative scenes, then re-evaluate']],{left:108,top:310,width:1700,height:620},[620,1080]);
footer(17,'Performance and usability improvements need evaluation on the same held-out and realistic camera sets.');
notes(17,.65,'Link each limitation to a concrete follow-up. More data is needed for rare signs and challenging conditions. Accessible interaction requires work with target users, including control sizes, contrast and speech. A portable deployment could remove laptop dependence but must be tested for speed and accuracy. Higher resolution and multi-sign training may help crowded scenes, but these are proposed improvements rather than proven fixes.',['models/model_manifest.json','webapp/static/app.js','outputs/v3_84_benchmark/benchmark_summary.json']);
// 18
text(18,'Sign recognition connected to spoken information',108,300,1640,130,65,G,true);
topic(18,'Working prototype','YOLO26s, OpenVINO, OCR and a browser interface form one functioning pipeline.',108,525,800);
topic(18,'Measured outcome','93.86% mAP@0.5 on the final held-out test and 84 / 84 expected top classes in the reviewed check.',1020,525,790);
text(18,'Next priority: validate useful, understandable speech with target users and improve difficult-scene detection.',108,835,1640,115,40,O,true);
footer(18,'The current result supports a prototype demonstration, not independent navigation or a vehicle-safety claim.');
notes(18,.65,'Summarize the implemented system and its main evidence. The project contributes an integrated sign-to-speech experience around a trained detector. Our key next step is user validation and more demanding camera tests. Then introduce Hui Min, who will play the recorded demonstration and show class coverage.',['models/model_manifest.json','webapp/main.py']);
// 19
text(19,'1–2 minutes',108,310,620,90,70,O,true);
text(19,'School-zone video',108,430,820,85,51,G,true);
text(19,'Recorded road scene with detection labels and spoken sign guidance.',108,555,790,180,40,G);
text(19,'About 3 minutes',1030,310,740,90,70,O,true);
text(19,'Class-coverage demonstration',1030,430,750,130,51,G,true);
text(19,'Original sign examples with predicted class names, confidence values and selected speech output.',1030,605,750,220,40,G);
footer(19,'Recorded demonstration and class examples');
notes(19,5,'Switch to the external video. Allocate about 1–2 minutes to the school-zone recording and the remaining time to class coverage. Use a fixed camera or a passenger to operate recording equipment; the driver should not operate the app. The supplied 48 originals cover 48 classes; add and test the remaining 15. A montage of actual detections can make the coverage video short enough, but keep every class name readable. The current deck does not contain the video.',['outputs/MYSignVoice_Presentation/demo/README.md']);
notes(20,0,'Return to this slide after the demonstration and invite questions. Backup plots follow only if needed.');
// Backup plots retain their original data and labels.
await image(21,'training/results/final_v1/report_artifacts/baseline_loss_curves.png',100,290,1720,650,'Original Version 1 baseline training and validation loss curves');
footer(21,'Version 1 baseline run. Box, classification and L1 losses measure different parts of training.');
notes(21,0,'Use only for questions about loss components. These plots are from Version 1, not the final Version 3 tuning run.',['training/results/final_v1/report_artifacts/baseline_loss_curves.png']);
await image(22,`${v1dir}/BoxP_curve.png`,100,300,840,580,'Version 1 test precision versus confidence');
await image(22,`${v1dir}/BoxR_curve.png`,990,300,830,580,'Version 1 test recall versus confidence');
footer(22,'Version 1 tuned-model test curves. Raising confidence changes precision and recall in opposite ways.');
notes(22,0,'Use only for threshold questions. Explain that a threshold decision depends on the intended tradeoff and operating conditions.',['training/results/final_v1/report_artifacts/final_test_tuned_cls_pw_025/BoxP_curve.png','training/results/final_v1/report_artifacts/final_test_tuned_cls_pw_025/BoxR_curve.png']);
await image(23,`${v1dir}/confusion_matrix_normalized.png`,65,250,1390,750,'Original normalized confusion matrix for Version 1 tuned-model test');
text(23,'Reading the matrix',1490,300,340,100,39,O,true);
text(23,'Diagonal: correct class\n\nOff diagonal: class confusion\n\nBackground: missed or extra detections\n\nInspect rare classes with their sample counts.',1490,450,340,480,33,G);
footer(23,'Version 1 tuned-model held-out confusion matrix. Included as a backup because 63 classes make it dense.');
notes(23,0,'This is the original Version 1 tuned-model test confusion matrix. Read its axis labels before interpreting a cell. The diagonal shows matches; off-diagonal values show confusion and the background category represents unmatched predictions or ground truth. Do not label this as the Version 3 confusion matrix.',['training/results/final_v1/report_artifacts/final_test_tuned_cls_pw_025/confusion_matrix_normalized.png']);
// Number slides unobtrusively using the template palette.
for(let i=2;i<=23;i++)if(i!==20)text(i,String(i).padStart(2,'0'),1815,1007,70,38,24,GRAY);
await fs.writeFile(path.join(WORK,'build-proto.json'),JSON.stringify(p.toProto()));
await fs.writeFile(path.join(WORK,'deck-content.json'),JSON.stringify(specs.map(({s,...rest})=>rest),null,2));
// Axis title text has a separate style from tick labels.
for(const c of p.slides.items[9].charts.items)c.xAxis.title={text:'Epoch',textStyle:{typeface:F,fontSize:22,fill:G}};
const candidate=path.join(WORK,'draft/candidate.pptx');
await (await PresentationFile.exportPptx(p)).save(candidate);console.log('Exported draft');
for(let i=0;!process.argv.includes('--export-only') && i<p.slides.items.length;i++){
 const b=await p.slides.items[i].export({format:'png',scale:.75});
 await fs.writeFile(path.join(WORK,'rendered',`${i+1}.png`),new Uint8Array(await b.arrayBuffer()));
 console.log('Rendered slide',i+1);
}
const finalPath=path.join(OUT,'MYSignVoice_Final_Presentation.pptx');
if(process.argv.includes('--finalize')){
 const result=await finalizePresentation({workspaceDir:ROOT,candidatePath:candidate,finalPath,pythonExecutable:PYTHON,integrityValidatorPath:path.join(SKILL,'container_tools/inspect_presentation_package_integrity.py'),layoutValidatorPath:path.join(SKILL,'container_tools/inspect_presentation_layout_geometry.py'),layoutArgs:['--expected-slide-size-emu','18288000,10287000'],requiredNativeTableOwnerSlides:[5,13,17],requiredNativeChartOwnerSlides:[...new Set(chartOwners)],materializeLiteralChartWorkbooks:true,fontPolicy:{basis:'reference',families:[F,FH],referencePath:SOURCE,referenceSha256:crypto.createHash('sha256').update(await fs.readFile(SOURCE)).digest('hex')},verifyArtifactToolImport:true,receiptPath:path.join(WORK,'final.validation.json')});
 console.log('Finalized',JSON.stringify(result).slice(0,1800));
}
for(let start=0;start<p.slides.items.length;start+=6){const pieces=[];for(let i=start;i<Math.min(start+6,p.slides.items.length);i++)pieces.push({input:await sharp(path.join(WORK,'rendered',`${i+1}.png`)).resize(640,360).toBuffer(),left:((i-start)%2)*640,top:Math.floor((i-start)/2)*360});await sharp({create:{width:1280,height:1080,channels:3,background:'#ddd'}}).composite(pieces).png().toFile(path.join(WORK,'rendered',`montage-${start+1}.png`));}
console.log('Speaking minutes',specs.slice(0,18).reduce((s,x)=>s+x.minutes,0));
