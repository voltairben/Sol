import { chromium } from "playwright";
const b = await chromium.launch({ args: ["--use-angle=swiftshader"] });
const errs = [];
const p = await b.newPage({ viewport: { width: 1300, height: 850 }, deviceScaleFactor: 1 });
p.on("console", (m) => { if (m.type() === "error") errs.push(m.text().slice(0,160)); });
await p.goto("http://localhost:3000/", { waitUntil: "domcontentloaded" });
await p.waitForTimeout(1400);
await p.screenshot({ path: process.argv[2] + "/preloader.png", animations: "disabled", timeout: 40000 });
const stageText = await p.getByRole("status").textContent().catch(() => "(no status)");
console.log("preloader visible:", await p.getByRole("status").isVisible().catch(()=>false));
console.log("status text:", (stageText||"").replace(/\s+/g," ").trim().slice(0,120));
// wait for it to finish + content to reveal
await p.waitForTimeout(6000);
const gone = !(await p.getByRole("status").isVisible().catch(()=>false));
const heroVisible = await p.getByText(/SYSTEM_INIT: SUCCESS/).isVisible().catch(()=>false);
console.log("preloader gone:", gone, "| homepage revealed:", heroVisible);
// reload — should NOT show preloader again (sessionStorage)
await p.reload({ waitUntil: "domcontentloaded" });
await p.waitForTimeout(2000);
console.log("preloader on reload (should be false):", await p.getByRole("status").isVisible().catch(()=>false));
console.log("console errors:", errs.length ? errs : "NONE");
await b.close();
