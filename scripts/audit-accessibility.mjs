import { chromium } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
const browser = await chromium.launch({
  args: ["--enable-unsafe-swiftshader"],
});
const context = await browser.newContext({
  viewport: { width: 1440, height: 1000 },
});
const page = await context.newPage();
await page.goto("http://localhost:3000");
await page
  .locator(".room-loading")
  .waitFor({ state: "hidden", timeout: 60000 });
let violations = 0;
for (const section of [
  "room",
  "About",
  "Projects",
  "Skills",
  "Journey",
  "Résumé",
  "Contact",
  "classic",
]) {
  if (section === "classic")
    await page.getByRole("button", { name: "Prefer a classic view?" }).click();
  else if (section !== "room")
    await page
      .getByRole("button", { name: `Open ${section}`, exact: true })
      .click();
  const result = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  console.log(
    section,
    JSON.stringify(
      result.violations.map((v) => ({
        id: v.id,
        impact: v.impact,
        nodes: v.nodes.map((n) => ({
          target: n.target,
          text: n.html.slice(0, 130),
          summary: n.failureSummary,
        })),
      })),
    ),
  );
  violations += result.violations.length;
  if (section !== "room" && section !== "classic")
    await page.keyboard.press("Escape");
}
await browser.close();
process.exitCode = violations ? 1 : 0;
