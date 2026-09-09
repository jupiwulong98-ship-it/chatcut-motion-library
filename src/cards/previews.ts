import type { ComponentType } from "react";
type MotionComponent=ComponentType<{item:{props:Record<string,unknown>}}>;
const modules=import.meta.glob("../../cards/*/versions/*/Component.jsx",{eager:true,query:"?preview",import:"Component"});
const pointers=import.meta.glob("../../cards/*/current.json",{eager:true,import:"default"}) as Record<string,{version:string}>;
export const previewComponents=Object.fromEntries(Object.entries(modules).flatMap(([path,component])=>{
  const match=path.match(/cards\/([^/]+)\/versions\/([^/]+)\/Component\.jsx$/);
  if(!match)return [];
  const[,id,version]=match;
  const pointer=pointers[`../../cards/${id}/current.json`];
  return pointer?.version===version?[[id,component as MotionComponent]]:[];
})) as Record<string,MotionComponent>;
