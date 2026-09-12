import { chromium } from 'playwright';
import path from 'node:path';
const browser=await chromium.launch({headless:true,channel:'msedge'});
try{
 const page=await browser.newPage({viewport:{width:1440,height:1050},deviceScaleFactor:1});
 await page.goto('http://127.0.0.1:8000',{waitUntil:'networkidle'});
 await page.locator('#imageInput').setInputFiles(path.resolve('outputs/MYSignVoice_Presentation/demo/single_signs/48_speed-limit-5.png'));
 await page.locator('#detectButton').click();
 await page.locator('#resultList .result-card').first().waitFor({timeout:15000}).catch(()=>{});
 await page.screenshot({path:'outputs/presentation_work/assets/app_upload.png',fullPage:true});
 console.log('App screenshot saved');
}finally{await browser.close();}
