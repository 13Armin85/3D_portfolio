import { expect, test } from "@playwright/test";

// Optional transport for machines whose browser intercepts PDF fetches.
// This still retrieves the real file from the running app; no PDF is mocked.
test.beforeEach(async ({ page }) => {
  if (process.env.PLAYWRIGHT_FETCH_PDF_VIA_API === "1") {
    await page.route(
      "**/resume/Armin_Nataj_Full_Stack_Resume.pdf",
      async (route) => {
        await route.fulfill({ response: await route.fetch() });
      },
    );
  }
});

test("résumé has selectable text, working links, zoom buttons and fit reset", async ({
  page,
  context,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await expect(page.locator(".room-loading")).toHaveCount(0);
  await page.getByRole("button", { name: "Open Résumé", exact: true }).click();
  const panel = page.getByRole("dialog");
  await expect(panel.locator(".pdf-page canvas")).toHaveCount(1);
  await expect(panel.locator(".textLayer span").first()).toBeAttached();
  const zoom = panel.getByLabel("Résumé zoom level");
  const canvas = panel.locator(".pdf-page canvas").first();
  await expect(canvas).toBeVisible();
  const initialWidth = (await canvas.boundingBox())!.width;
  const resolution = await canvas.getAttribute("width");
  await expect(zoom).toHaveText("100%");
  await panel
    .getByRole("button", { name: "Zoom in résumé", exact: true })
    .click();
  await expect(zoom).toHaveText("125%");
  await expect(canvas).toBeVisible();
  await expect
    .poll(async () => (await canvas.boundingBox())!.width)
    .toBeGreaterThan(initialWidth * 1.2);
  await expect(canvas).toHaveAttribute("width", resolution!);
  await panel
    .getByRole("button", { name: "Zoom out résumé", exact: true })
    .click();
  await expect(zoom).toHaveText("100%");
  await panel
    .getByRole("button", { name: "Zoom in résumé", exact: true })
    .click();
  await panel.getByRole("button", { name: "Fit résumé to width" }).click();
  await expect(zoom).toHaveText("100%");

  const website = panel.locator(
    '.annotationLayer a[href="https://arminnataj.ir/"]',
  );
  await expect(website.first()).toHaveAttribute("target", "_blank");
  await expect(website.first()).toHaveAttribute("rel", /noopener/);
  await context.route("https://arminnataj.ir/", (route) =>
    route.fulfill({
      body: "<h1>Link destination</h1>",
      contentType: "text/html",
    }),
  );
  const popupPromise = page.waitForEvent("popup");
  await website.first().click();
  const popup = await popupPromise;
  await expect(popup).toHaveURL("https://arminnataj.ir/");
  await popup.close();

  const viewport = panel.getByRole("region", {
    name: "Interactive résumé document",
  });
  await viewport.focus();
  await page.keyboard.press("+");
  await expect(zoom).toHaveText("125%");
  await page.keyboard.press("0");
  await expect(zoom).toHaveText("100%");
  await expect(panel).toBeVisible();
  expect(errors).toEqual([]);
});

test("résumé supports mouse-wheel zoom and a real mobile pinch", async ({
  page,
  context,
  isMobile,
}) => {
  await page.goto("/");
  await expect(page.locator(".room-loading")).toHaveCount(0);
  await page.getByRole("button", { name: "Open Résumé", exact: true }).click();
  const panel = page.getByRole("dialog");
  await expect(panel.locator(".pdf-page canvas")).toHaveCount(1);
  const viewport = panel.locator(".pdf-viewport");
  await viewport.scrollIntoViewIfNeeded();
  const point = await viewport.evaluate((element) => {
    const box = element.getBoundingClientRect();
    const scroll = element.closest(".panel-scroll")!.getBoundingClientRect();
    return {
      x: box.left + box.width / 2,
      y:
        (Math.max(box.top, scroll.top) + Math.min(box.bottom, scroll.bottom)) /
        2,
    };
  });
  const zoom = panel.getByLabel("Résumé zoom level");
  if (isMobile) {
    const cdp = await context.newCDPSession(page);
    const touches = (spread: number) => [
      { x: point.x - spread, y: point.y, id: 1 },
      { x: point.x + spread, y: point.y, id: 2 },
    ];
    await cdp.send("Input.dispatchTouchEvent", {
      type: "touchStart",
      touchPoints: touches(25),
    });
    await cdp.send("Input.dispatchTouchEvent", {
      type: "touchMove",
      touchPoints: touches(45),
    });
    await cdp.send("Input.dispatchTouchEvent", {
      type: "touchEnd",
      touchPoints: [],
    });
    await expect(zoom).not.toHaveText("100%");
    await cdp.detach();
  } else {
    await page.mouse.move(point.x, point.y);
    await page.keyboard.down("Control");
    await page.mouse.wheel(0, -80);
    await page.keyboard.up("Control");
    await expect(zoom).not.toHaveText("100%");
  }
  await panel.getByRole("button", { name: "Fit résumé to width" }).click();
  await expect(zoom).toHaveText("100%");
});

test("a failed PDF preview keeps the original file accessible", async ({
  page,
}) => {
  await page.route("**/resume/Armin_Nataj_Full_Stack_Resume.pdf", (route) =>
    route.fulfill({ status: 404, body: "Missing PDF" }),
  );
  await page.goto("/");
  await expect(page.locator(".room-loading")).toHaveCount(0);
  await page.getByRole("button", { name: "Open Résumé", exact: true }).click();
  const panel = page.getByRole("dialog");
  await expect(panel.getByRole("alert")).toContainText(
    "preview could not load",
  );
  await expect(
    panel.getByRole("link", { name: "Open the original PDF" }),
  ).toHaveAttribute("href", "/resume/Armin_Nataj_Full_Stack_Resume.pdf");
  await expect(
    panel.getByRole("link", { name: "Download résumé" }),
  ).toHaveAttribute("download", "");
});
