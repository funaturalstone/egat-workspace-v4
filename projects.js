import {DEMO_SCENARIOS} from './domain/demoData.js';
const sources={solar:'demo-solar',hybrid:'demo-hybrid',battery:'demo-bess'};
export const productIds=Object.keys(sources);
export const template=id=>({...DEMO_SCENARIOS.find(s=>s.id===sources[id])});
const uid=()=>globalThis.crypto?.randomUUID?.()??'project-'+Date.now()+'-'+Math.random().toString(36).slice(2);
export function freshWorkspace(){
 const projects=productIds.flatMap(product=>Array.from({length:product==='solar'?4:2},(_,i)=>({id:uid(),product,name:`ลูกค้าคนที่ ${i+1}`,scenario:template(product)})));
 return {version:1,selected:'solar',projects,active:Object.fromEntries(productIds.map(p=>[p,projects.find(s=>s.product===p).id]))};
}
export const activeProject=(state,product=state.selected)=>state.projects.find(p=>p.product===product&&p.id===state.active[product])??null;
export function addProject(state,product,name,copy=false){const base=copy?activeProject(state,product)?.scenario:null;const p={id:uid(),product,name:name.trim(),scenario:{...(base??template(product)),decision_override:'auto'}};if(!p.name||!productIds.includes(product))throw Error('Invalid project');state.projects.push(p);state.active[product]=p.id;state.selected=product;return p;}
export function removeProject(state,id){const index=state.projects.findIndex(p=>p.id===id);if(index<0)return null;const [project]=state.projects.splice(index,1);if(state.active[project.product]===id)state.active[project.product]=state.projects.find(p=>p.product===project.product)?.id??null;return {project,index};}
export function restoreProject(state,entry){if(!entry||state.projects.some(p=>p.id===entry.project.id))return;state.projects.splice(Math.min(entry.index,state.projects.length),0,entry.project);state.selected=entry.project.product;state.active[state.selected]=entry.project.id;}
export function validWorkspace(s){return s?.version===1&&productIds.includes(s.selected)&&s.active&&Array.isArray(s.projects)&&new Set(s.projects.map(p=>p.id)).size===s.projects.length&&s.projects.every(p=>typeof p.id==='string'&&productIds.includes(p.product)&&typeof p.name==='string'&&p.name.trim().length>0&&p.name.length<=80&&['auto','accept','reject'].includes(p.scenario?.decision_override??'auto')&&Object.entries(template(p.product)).every(([k,v])=>typeof v!=='number'||Number.isFinite(p.scenario?.[k]))&&p.scenario.project_life>=1&&p.scenario.project_life<=40&&Number.isInteger(p.scenario.project_life)&&p.scenario.discount_rate>=0)&&productIds.every(p=>s.projects.some(v=>v.product===p)?s.projects.some(v=>v.product===p&&v.id===s.active[p]):s.active[p]==null);}
export const storageKey='egat-bento-v4-project-workspace';
