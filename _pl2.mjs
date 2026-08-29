import { chromium } from "playwright";
const b = await chromium.launch({ args: ["--use-angle=swiftshader"] });
const p = await b.newPage({ viewport: { width: 1200, height: 800 } });
await p.goto("http://localhost:3000/", { waitUntil: "commit" });
// poll for the preloader text, then for it to vanish
let sawBoot = false;
for (let i = 0; i < 20; i++) {
  await p.waitForTimeout(400);
  const t = await p.locator("body").innerText().catch(() => "");
  if (t.includes("% REMAINING")) sawBoot = true;
  if (sawBoot && !t.includes("% REMAINING")) { console.log("boot finished after ~" + (i*0.4).toFixed(1) + "s"); break; }
}
console.log("saw boot screen:", sawBoot);
const home = await p.getByText(/AUDIO_DECK: ONLINE/).isVisible().catch(() => false);
console.log("homepage content visible after boot:", home);
// second navigation (same context => sessionStorage persists)
await p.goto("http://localhost:3000/about", { waitUntil: "commit" });
await p.waitForTimeout(1000);
await p.goto("http://localhost:3000/", { waitUntil: "commit" });
await p.waitForTimeout(1500);
const bootAgain = (await p.locator("body").innerText().catch(()=>"")).includes("% REMAINING");
console.log("boot shown again on return nav (should be false):", bootAgain);
await b.close();
