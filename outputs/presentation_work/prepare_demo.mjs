import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
const root=process.cwd(), out=path.join(root,'outputs/MYSignVoice_Presentation/demo');
const data=JSON.parse(await fs.readFile(path.join(root,'outputs/presentation_work/evidence.json'),'utf8'));
const groups=[];
for(let i=0;i<data.selected.length;i+=4){
 const signs=data.selected.slice(i,i+4), overlays=[];
 for(let j=0;j<signs.length;j++){
  const buf=await sharp(path.join(out,'single_signs',signs[j].file)).resize(300,300,{fit:'contain',background:'#ffffff'}).png().toBuffer();
  overlays.push({input:buf,left:10+(j%2)*320,top:10+Math.floor(j/2)*320});
 }
 const file=`frame_${String(groups.length+1).padStart(2,'0')}.png`;
 await sharp({create:{width:640,height:640,channels:3,background:'#ffffff'}}).composite(overlays).png().toFile(path.join(out,'four_sign_frames',file));
 groups.push({file,expected:signs.map(s=>s.class_name),class_ids:signs.map(s=>s.class_id)});
}
await fs.writeFile(path.join(out,'four_sign_manifest.json'),JSON.stringify(groups,null,2));
console.log('Created',groups.length,'four-sign frames');
