import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import {pathToFileURL} from 'node:url';
process.env.RUNTIME_NODE_MODULES='C:/Users/Hui Min/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules';
const root=process.cwd(),work=path.join(root,'outputs/presentation_work');
const skill='C:/Users/Hui Min/.codex/plugins/cache/openai-primary-runtime/presentations/26.909.12148/skills/presentations';
const source='D:/Traffic Sign Detection for AVs (1).pptx';
const layoutArgs=['--expected-slide-size-emu','18288000,10287000',...([5,13,17].flatMap(n=>['--require-native-table-slide',String(n)]))];
const {finalizePresentation}=await import(pathToFileURL(path.join(skill,'container_tools/artifact_tool_utils.mjs')).href);
try {
const result=await finalizePresentation({workspaceDir:root,candidatePath:path.join(work,'draft/candidate.pptx'),finalPath:path.join(root,'outputs/MYSignVoice_Presentation/MYSignVoice_Final_Presentation.pptx'),pythonExecutable:'C:/Users/Hui Min/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/python.exe',integrityValidatorPath:path.join(skill,'container_tools/inspect_presentation_package_integrity.py'),layoutValidatorPath:path.join(skill,'container_tools/inspect_presentation_layout_geometry.py'),layoutArgs,requiredNativeTableOwnerSlides:[5,13,17],requiredNativeChartOwnerSlides:[9,10,12],materializeLiteralChartWorkbooks:true,fontPolicy:{basis:'reference',families:['Open Sauce','Open Sauce Medium'],referencePath:source,referenceSha256:crypto.createHash('sha256').update(await fs.readFile(source)).digest('hex')},verifyArtifactToolImport:true,receiptPath:path.join(work,'final.validation.json')});
console.log(JSON.stringify(result,null,2));
} catch(e) {console.error(e.message);process.exitCode=1;}
