import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({ plugins: [{ name:"chatcut-preview-source", enforce:"pre", transform(code,id){ if(id.includes("/cards/")&&id.includes("Component.jsx?preview")) return `${code}\nexport { Component };`; } }, react()] });
