import fs from 'node:fs/promises';
import path from 'node:path';
import { FileBlob, PresentationFile } from '@oai/artifact-tool';
import sharp from 'sharp';
const out = path.resolve('outputs/presentation_work/template');
await fs.mkdir(out,{recursive:true});
const p = await PresentationFile.importPptx(await FileBlob.load('D:/Traffic Sign Detection for AVs (1).pptx'));
console.log('Imported',p.slides.items.length);
await fs.writeFile(path.join(out,'inspection.ndjson'),(await p.inspect({kind:'slide,textbox,shape,image,layout',maxChars:500000})).ndjson);
console.log('Masters',p.masters.items.length,'Layouts',p.layouts.items.length);
await fs.writeFile(path.join(out,'source-proto.json'),JSON.stringify(p.toProto()));
for(let i=0;i<p.slides.items.length;i++){
  const s=p.slides.items[i];
  try{await fs.access(path.join(out,`${i+1}.png`));continue;}catch{}
  try{
  const b=await s.export({format:'png',scale:0.5});
  await fs.writeFile(path.join(out,`${i+1}.png`),new Uint8Array(await b.arrayBuffer()));
  if([0,2,30,36,58].includes(i)) await fs.writeFile(path.join(out,`${i+1}.json`),await (await s.export({format:'layout'})).text());
  console.log('Rendered',i+1);
  }catch(e){console.log('Render issue',i+1,e.message);}
}
for(let start=0;start<p.slides.items.length;start+=12){
 const pieces=[];
 for(let i=start;i<Math.min(start+12,p.slides.items.length);i++) {try {pieces.push({input:await sharp(path.join(out,`${i+1}.png`)).resize(480,270).toBuffer(),left:((i-start)%3)*480,top:Math.floor((i-start)/3)*270});}catch{}}
 await sharp({create:{width:1440,height:1080,channels:3,background:'#ddd'}}).composite(pieces).png().toFile(path.join(out,`montage-${start+1}.png`));
}
