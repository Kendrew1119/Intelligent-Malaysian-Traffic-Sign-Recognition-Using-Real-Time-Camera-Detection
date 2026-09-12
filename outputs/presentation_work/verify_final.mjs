import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import {FileBlob,PresentationFile} from '@oai/artifact-tool';
process.on('uncaughtException',e=>{console.error(e.message);process.exit(1)});
process.on('unhandledRejection',e=>{console.error(e.message);process.exit(1)});
const out=path.resolve('outputs/presentation_work/final_rendered');
await fs.mkdir(out,{recursive:true});
const p=await PresentationFile.importPptx(await FileBlob.load(path.resolve('outputs/MYSignVoice_Presentation/MYSignVoice_Final_Presentation.pptx')));
console.log('Imported final:',p.slides.items.length);
for(let i=0;i<p.slides.items.length;i++){
 const b=await p.slides.items[i].export({format:'png',scale:.75});
 const file=path.join(out,`${i+1}.png`),bytes=new Uint8Array(await b.arrayBuffer());
 let unchanged=false;try{unchanged=crypto.createHash('sha256').update(await fs.readFile(file)).digest('hex')===crypto.createHash('sha256').update(bytes).digest('hex')}catch{}
 await fs.writeFile(file,bytes);
 console.log('Final rendered',i+1,unchanged?'unchanged':'changed');
}
