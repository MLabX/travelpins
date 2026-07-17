const { test, expect } = require("playwright/test");

async function openPicker(page) {
  await page.getByRole("button", { name: /Pick my next stop/ }).click();
  await expect(page.getByRole("dialog", { name: "Where to next?" })).toBeVisible();
}

async function choosePlace(page) {
  await page.getByRole("button", { name: "Pick a place" }).click();
  await expect(page.getByRole("dialog", { name: "Try this one" })).toBeVisible();
}

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => localStorage.clear());
  await page.reload();
});

test("picker keeps setup states distinct and returns current map data", async ({ page }) => {
  await openPicker(page);

  await expect(page.getByRole("button", { name: "Pick another" })).toBeHidden();
  await expect(page.getByText("Blue Bottle Coffee", { exact: true })).toHaveCount(0);

  const spacingIsClean = await page.locator(".pick-option").evaluateAll((options) =>
    options.every((option) => {
      const title = option.querySelector(".t").getBoundingClientRect();
      const detail = option.querySelector(".d").getBoundingClientRect();
      return title.bottom <= detail.top + 1;
    })
  );
  expect(spacingIsClean).toBe(true);

  await choosePlace(page);
  await expect(page.locator("#pickSetup")).toBeHidden();
  await expect(page.getByRole("button", { name: "Pick another" })).toBeVisible();

  const resultName = (await page.locator(".pick-card h3").innerText()).trim();
  const currentNames = await page.evaluate(() =>
    window.TRAVEL_PINS.map((pin) => pin.name.replace(/\s+\((?:side|inside|near|opposite|next)[^)]+\)$/i, ""))
  );
  expect(currentNames).toContain(resultName);
});

test("picker result actions stay inside a short desktop viewport", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 720 });
  await openPicker(page);
  await choosePlace(page);

  const modal = await page.locator(".pick-modal").boundingBox();
  const actions = await page.locator("#pickActions").boundingBox();
  expect(modal.y).toBeGreaterThanOrEqual(0);
  expect(modal.y + modal.height).toBeLessThanOrEqual(720);
  expect(actions.y + actions.height).toBeLessThanOrEqual(720);
});

test("mobile picker fits and visit state updates immediately", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await openPicker(page);
  await choosePlace(page);

  const modal = await page.locator(".pick-modal").boundingBox();
  expect(modal.x).toBeGreaterThanOrEqual(0);
  expect(modal.x + modal.width).toBeLessThanOrEqual(390);
  expect(modal.y + modal.height).toBeLessThanOrEqual(844);

  const markVisited = page.getByRole("button", { name: "Mark visited" });
  await markVisited.click();
  await expect(page.getByRole("button", { name: "Visited" })).toBeDisabled();
});

test("Roaming Scroll visual roles stay intentional", async ({ page }) => {
  const roles = await page.evaluate(() => {
    const root = getComputedStyle(document.documentElement);
    return {
      paper: root.getPropertyValue("--paper").trim(),
      azurite: root.getPropertyValue("--azurite").trim(),
      malachite: root.getPropertyValue("--accent").trim(),
      cinnabar: root.getPropertyValue("--place").trim(),
      ochre: root.getPropertyValue("--rating").trim(),
      ridges: [".brand", ".decision-btn", ".pick-head"].length,
    };
  });
  expect(roles).toEqual({
    paper: "#f6f0e4",
    azurite: "#2e6178",
    malachite: "#1d6656",
    cinnabar: "#c4513b",
    ochre: "#b67a20",
    ridges: 3,
  });
});

test("narrow desktop keeps popups clear of the panel and source branding out", async ({ page }) => {
  await page.setViewportSize({ width: 820, height: 900 });
  await page.getByText("Central Roasters Coffee", { exact: true }).click();
  await expect(page.locator(".leaflet-popup")).toBeVisible();

  const frames = await page.evaluate(() => {
    const panel = document.querySelector("#sidebar").getBoundingClientRect();
    const popup = document.querySelector(".leaflet-popup").getBoundingClientRect();
    return {
      overlap: popup.left < panel.right && popup.right > panel.left && popup.top < panel.bottom && popup.bottom > panel.top,
      popupInsideViewport: popup.left >= 0 && popup.right <= innerWidth && popup.top >= 0 && popup.bottom <= innerHeight,
    };
  });
  expect(frames.overlap).toBe(false);
  expect(frames.popupInsideViewport).toBe(true);

  const seedText = await page.evaluate(() => JSON.stringify(window.TRAVEL_PINS));
  expect(seedText).not.toContain("Max");
  await expect(page.locator(".leaflet-popup")).not.toContainText("Max");
});

test("updated seed adds Seven Miles with a working two-photo memory", async ({ page }) => {
  expect(await page.evaluate(() => window.TRAVEL_PINS.length)).toBe(22);
  const sevenMiles = await page.evaluate(() => window.TRAVEL_PINS.find((pin) => pin.name === "Seven Miles Cafe"));
  expect(sevenMiles).toMatchObject({ score: 7.5, recommended: true, area: "CBD" });
  expect(sevenMiles.images).toHaveLength(2);

  await page.getByText("Seven Miles Cafe", { exact: true }).click();
  const popup = page.locator(".leaflet-popup");
  await expect(popup).toBeVisible();
  await expect(popup.locator(".photo")).toHaveCount(2);
  await expect(popup.locator(".photo.active")).toHaveAttribute("alt", /photo 1/);
  await popup.getByRole("button", { name: "Next photo" }).click();
  await expect(popup.locator(".photo.active")).toHaveAttribute("alt", /photo 2/);
  await expect(popup.locator("[data-photo-index]")).toHaveText("2");
  await expect.poll(() => popup.locator(".photo.active").evaluate((image) => image.complete && image.naturalWidth > 0)).toBe(true);
});

test("existing personal maps receive the new seed visit once", async ({ page }) => {
  await page.evaluate(() => {
    const oldPins = window.TRAVEL_PINS.filter((pin) => pin.name !== "Seven Miles Cafe").map((pin, index) => ({ id: index + 1, ...pin }));
    localStorage.setItem("travelpins.v2", JSON.stringify(oldPins));
    localStorage.setItem("travelpins.v2.seedUpdates", JSON.stringify(["meisterstuck-team-tour-2026-07-10"]));
    localStorage.setItem("travelpins.v2.seedVersion", "roaming-scroll-2026-07-17");
  });
  await page.reload();

  const names = await page.evaluate(() => JSON.parse(localStorage.getItem("travelpins.v2")).map((pin) => pin.name));
  expect(names.filter((name) => name === "Seven Miles Cafe")).toHaveLength(1);
});
