import type { ComponentType } from "react";
type MotionComponent=ComponentType<{item:{props:Record<string,unknown>}}>;
const modules=import.meta.glob("../../cards/*/versions/*/Component.jsx",{eager:true,query:"?preview",import:"Component"});
export const previewComponents=Object.fromEntries(Object.entries(modules).map(([path,component])=>[path.split("/")[3],component as MotionComponent])) as Record<string,MotionComponent>;
