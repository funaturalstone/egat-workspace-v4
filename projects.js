import {DEMO_SCENARIOS} from './domain/demoData.js';
import {bessScenario} from './domain/bess.js';
import {derive} from './domain/inputs.js';
import {sampleRaw,SAMPLE_ID,SAMPLE_NAME} from './domain/khunTon.js';
const sources={solar:'demo-solar',hybrid:'demo-hybrid',battery:'demo-bess'};
export const productIds=Object.keys(sources);
// Keys added after launch: older saved projects may not have them, the engine treats missing as 0
export const optionalKeys=['revenue2_y1','revenue2_growth','customer_saving_y1','revenue_growth_late','revenue2_growth_late','growth_switch_year','revenue2_reset_every','revenue2_degradation','replacement2_cost','replacement2_year','replacement2_every','tax_rate','depreciation_years','debt_share','debt_rate','debt_years'];
// Battery numbers come from the Excel BESS model (domain/bess.js, 'min' or 'max' cost case); other products keep their demo scenarios
export const template=(id,level='min')=>({...DEMO_SCENARIOS.find(s=>s.id===sources[id]),...(id==='battery'?{...bessScenario(level),note:'BESS Feasibility Model_rev01.xlsx · '+level}:{})});
const uid=()=>globalThis.crypto?.randomUUID?.()??'project-'+Date.now()+'-'+Math.random().toString(36).slice(2);
export function freshWorkspace(){
 const projects=productIds.flatMap(product=>Array.from({length:product==='solar'?4:2},(_,i)=>({id:uid(),product,name:`ลูกค้าคนที่ ${i+1}`,scenario:template(product,product==='battery'&&i===1?'max':'min')})));
 return {version:1,selected:'solar',projects,active:Object.fromEntries(productIds.map(p=>[p,projects.find(s=>s.product===p).id]))};
}
// Khun Ton (real factory, checked against the Excel file): one raw-input project per product
export function sampleScenario(product){const raw=sampleRaw(product),d=derive(product,raw);return {...template(product),...d.fields,input_mode:'raw',raw,sample:SAMPLE_ID,decision_override:'auto',note:'ข้อมูลจริงของคุณต้น · ตรวจตรงกับไฟล์ Excel แล้ว'};}
// Khun Ton is not part of a new workspace: his projects are stored only for the accounts that should have them
// (rows in client_projects, built with sampleProjects below).
export const sampleProjects=()=>productIds.map(product=>({id:uid(),product,name:SAMPLE_NAME,scenario:sampleScenario(product)}));
export const activeProject=(state,product=state.selected)=>state.projects.find(p=>p.product===product&&p.id===state.active[product])??null;
export function addProject(state,product,name,copy=false){const base=copy?activeProject(state,product)?.scenario:null;const p={id:uid(),product,name:name.trim(),scenario:{...(base??template(product)),decision_override:'auto'}};if(!p.name||!productIds.includes(product))throw Error('Invalid project');state.projects.push(p);state.active[product]=p.id;state.selected=product;return p;}
export function removeProject(state,id){const index=state.projects.findIndex(p=>p.id===id);if(index<0)return null;const [project]=state.projects.splice(index,1);if(state.active[project.product]===id)state.active[project.product]=state.projects.find(p=>p.product===project.product)?.id??null;return {project,index};}
export function restoreProject(state,entry){if(!entry||state.projects.some(p=>p.id===entry.project.id))return;state.projects.splice(Math.min(entry.index,state.projects.length),0,entry.project);state.selected=entry.project.product;state.active[state.selected]=entry.project.id;}
export function validWorkspace(s){return s?.version===1&&productIds.includes(s.selected)&&s.active&&Array.isArray(s.projects)&&new Set(s.projects.map(p=>p.id)).size===s.projects.length&&s.projects.every(p=>typeof p.id==='string'&&productIds.includes(p.product)&&typeof p.name==='string'&&p.name.trim().length>0&&p.name.length<=80&&['auto','accept','reject'].includes(p.scenario?.decision_override??'auto')&&Object.entries(template(p.product)).every(([k,v])=>typeof v!=='number'||(optionalKeys.includes(k)?p.scenario?.[k]==null||Number.isFinite(p.scenario[k]):Number.isFinite(p.scenario?.[k])))&&p.scenario.project_life>=1&&p.scenario.project_life<=40&&Number.isInteger(p.scenario.project_life)&&p.scenario.discount_rate>=0)&&productIds.every(p=>s.projects.some(v=>v.product===p)?s.projects.some(v=>v.product===p&&v.id===s.active[p]):s.active[p]==null);}
export const storageKey='egat-bento-v4-project-workspace';
