import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("Persian pages translate all sections, mirror the layout, and remember language", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/en");
  await page.getByRole("link", { name: "Switch to Persian" }).click();
  await expect(page).toHaveURL(/\/fa$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "fa");
  await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
  await expect(page).toHaveTitle("آرمین نتاج — توسعه‌دهنده فول‌استک");
  await expect(
    page.getByRole("heading", { name: /یک فضای کوچک/ }),
  ).toBeVisible();
  await expect(page.locator(".room-loading")).toHaveCount(0);
  await page.evaluate(() => document.fonts.ready);
  const roomScan = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(
    roomScan.violations.filter(
      (item) => item.impact === "critical" || item.impact === "serious",
    ),
  ).toEqual([]);
  expect(
    await page
      .locator("body")
      .evaluate((element) => getComputedStyle(element).fontFamily),
  ).toContain("Vazirmatn");
  const sections = [
    ["درباره من", "کمی درباره من."],
    ["پروژه‌ها", "ساخته‌شده با دقت."],
    ["مهارت‌ها", "ابزارهای روزمره من."],
    ["مسیر کاری", "مسیر من تا امروز."],
    ["تماس", "با هم چیزی بسازیم."],
  ];
  for (const [label, title] of sections) {
    await page
      .getByRole("button", { name: `باز کردن ${label}`, exact: true })
      .click();
    const panel = page.getByRole("dialog");
    await expect(
      panel.getByRole("heading", { name: title, exact: true }),
    ).toBeVisible();
    await expect(
      panel.getByRole("link", { name: "تغییر زبان به انگلیسی" }),
    ).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBeTruthy();
    if (label === "تماس") {
      const scan = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze();
      expect(
        scan.violations.filter(
          (item) => item.impact === "critical" || item.impact === "serious",
        ),
      ).toEqual([]);
    }
    await panel
      .getByRole("button", { name: "بازگشت به اتاق", exact: true })
      .click();
  }
  await page
    .getByRole("button", { name: "نمای کلاسیک را ترجیح می‌دهید؟" })
    .click();
  await expect(
    page
      .locator(".classic-portfolio")
      .getByRole("heading", { name: "سامانه مدیریت شهرداری", exact: true }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBeTruthy();
  await page.goto("/");
  await expect(page).toHaveURL(/\/fa$/);
  await page.getByRole("link", { name: "تغییر زبان به انگلیسی" }).click();
  await expect(page).toHaveURL(/\/en$/);
  await expect(page.locator("html")).toHaveAttribute("dir", "ltr");
  await page.goto("/");
  await expect(page).toHaveURL(/\/en$/);
});

test("Persian form translates server errors and confirmations", async ({
  page,
}) => {
  let attempts = 0;
  await page.route("**/api/contact", async (route) => {
    const data = route.request().postDataJSON();
    expect(data.name).toBe("آرمین");
    expect(data.message).toBe("برای همکاری در توسعه وب پیام می‌دهم.");
    attempts++;
    await route.fulfill({
      status: attempts === 1 ? 502 : 200,
      json:
        attempts === 1
          ? { error: "Your message could not be sent. Please try again." }
          : { message: "Thanks! Your message has been sent." },
    });
  });
  await page.goto("/fa");
  await page
    .getByRole("button", { name: "باز کردن تماس", exact: true })
    .click();
  const panel = page.getByRole("dialog");
  await panel.getByLabel("نام شما", { exact: true }).fill("آرمین");
  await expect(panel.getByLabel("آدرس ایمیل", { exact: true })).toHaveAttribute(
    "dir",
    "ltr",
  );
  await panel
    .getByLabel("آدرس ایمیل", { exact: true })
    .fill("armin@example.com");
  await panel
    .getByLabel("چه چیزی در ذهن دارید؟")
    .fill("برای همکاری در توسعه وب پیام می‌دهم.");
  await panel.getByRole("button", { name: "گفت‌وگو را شروع کنیم" }).click();
  await expect(panel.getByRole("alert")).toContainText(
    "لطفاً دوباره تلاش کنید",
  );
  await panel.getByRole("button", { name: "گفت‌وگو را شروع کنیم" }).click();
  await expect(
    panel.getByRole("status").filter({ hasText: "پیام شما ارسال شد" }),
  ).toBeVisible();
});

test("Persian content and language links are server rendered without JavaScript", async ({
  browser,
  request,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("/fa");
  await expect(page.locator(".classic-portfolio")).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "سامانه مدیریت شهرداری", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "دانلود رزومه", exact: true }),
  ).toHaveAttribute("href", "/resume/Armin_Nataj_Full_Stack_Resume.pdf");
  await expect(
    page.locator('link[rel="alternate"][hreflang="en"]'),
  ).toHaveAttribute("href", /\/en$/);
  await page.getByRole("link", { name: "تغییر زبان به انگلیسی" }).click();
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await context.close();
  expect((await request.get("/de")).status()).toBe(404);
  const sitemap = await request.get("/sitemap.xml");
  expect(await sitemap.text()).toContain('hreflang="fa"');
});

test("Persian résumé keeps a usable original PDF with localized controls", async ({
  page,
}) => {
  await page.route(
    "**/resume/Armin_Nataj_Full_Stack_Resume.pdf",
    async (route) => route.fulfill({ response: await route.fetch() }),
  );
  await page.goto("/fa");
  await page
    .getByRole("button", { name: "باز کردن رزومه", exact: true })
    .click();
  const panel = page.getByRole("dialog");
  await expect(panel.locator(".pdf-page canvas")).toHaveCount(1);
  await expect(panel.locator(".textLayer span").first()).toBeAttached();
  await panel
    .getByRole("button", { name: "بزرگ‌نمایی رزومه", exact: true })
    .click();
  await expect(panel.getByLabel("میزان بزرگ‌نمایی رزومه")).toHaveText("125%");
  await panel.getByRole("button", { name: "تنظیم رزومه با عرض صفحه" }).click();
  await expect(panel.getByLabel("میزان بزرگ‌نمایی رزومه")).toHaveText("100%");
  await expect(
    panel.getByRole("link", { name: "دانلود رزومه" }),
  ).toHaveAttribute("download", "");
});
