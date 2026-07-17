const { test, expect } = require("playwright/test");

async function openPicker(page) {
  await page.getByRole("button", { name: /Pick for me/ }).click();
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

test("map toggle yields while a popup is open and returns when it closes", async ({ page }) => {
  const toggle = page.getByRole("button", { name: "Toggle panel" });
  await expect(toggle).toBeVisible();
  await page.getByText("Central Roasters Coffee", { exact: true }).click();
  await expect(page.locator("body")).toHaveClass(/popup-open/);
  await expect(toggle).toHaveCSS("pointer-events", "none");
  await page.locator(".leaflet-popup-close-button").click();
  await expect(page.locator("body")).not.toHaveClass(/popup-open/);
  await expect(toggle).toHaveCSS("pointer-events", "auto");
});

test("updated seed adds Seven Miles with a working two-photo memory", async ({ page }) => {
  expect(await page.evaluate(() => window.TRAVEL_PINS.length)).toBe(22);
  const sevenMiles = await page.evaluate(() => window.TRAVEL_PINS.find((pin) => pin.name === "Seven Miles Cafe"));
  expect(sevenMiles).toMatchObject({ score: 7.5, recommended: true, area: "CBD", visitedAt: "2026-07-17" });
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

test("place photography has a generous preview and an immersive viewer", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.getByText("Seven Miles Cafe", { exact: true }).click();
  const frame = page.locator(".leaflet-popup .photo-frame");
  const preview = await frame.boundingBox();
  expect(preview.width).toBeGreaterThanOrEqual(300);
  expect(preview.height).toBeGreaterThanOrEqual(220);
  const close = await page.locator(".leaflet-popup-close-button").boundingBox();
  expect(close.width).toBeGreaterThanOrEqual(40);
  expect(close.height).toBeGreaterThanOrEqual(40);
  expect(close.x).toBeGreaterThanOrEqual(preview.x + 8);
  expect(close.x + close.width).toBeLessThanOrEqual(preview.x + preview.width - 8);
  expect(close.y).toBeGreaterThanOrEqual(preview.y + 8);
  expect(close.y + close.height).toBeLessThan(preview.y + preview.height);

  await frame.click();
  const viewer = page.getByRole("dialog", { name: "Photo viewer" });
  await expect(viewer).toBeVisible();
  await expect(viewer.locator("#viewerCount")).toHaveText("1 of 2");
  await viewer.getByRole("button", { name: "Next photo" }).click();
  await expect(viewer.locator("#viewerCount")).toHaveText("2 of 2");
  await expect.poll(() => viewer.locator("#viewerImage").evaluate((image) => image.complete && image.naturalWidth > 0)).toBe(true);
  await page.keyboard.press("Escape");
  await expect(viewer).toBeHidden();
  await expect(frame).toBeFocused();
});

test("photo viewer stays inside a phone viewport", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByText("Seven Miles Cafe", { exact: true }).click();
  await page.locator(".leaflet-popup .photo-frame").click();
  const bounds = await page.locator("#photoViewer .viewer-figure").boundingBox();
  expect(bounds.x).toBeGreaterThanOrEqual(0);
  expect(bounds.x + bounds.width).toBeLessThanOrEqual(390);
  expect(bounds.y).toBeGreaterThanOrEqual(0);
  expect(bounds.y + bounds.height).toBeLessThanOrEqual(844);
});

test("mobile place details own the viewport and restore the map sheet", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByText("Seven Miles Cafe", { exact: true }).click();

  const sidebar = page.locator("#sidebar");
  await expect(sidebar).toHaveClass(/popup-peek/);
  await expect(sidebar).toHaveCSS("opacity", "0");
  await expect(sidebar).toHaveCSS("pointer-events", "none");
  await expect(page.locator(".leaflet-control-zoom")).toHaveCSS("pointer-events", "none");
  await expect(page.locator(".fitall")).toHaveCSS("pointer-events", "none");

  const regular = await page.evaluate(() => {
    const popup = document.querySelector(".leaflet-popup").getBoundingClientRect();
    const sheet = document.querySelector("#sidebar").getBoundingClientRect();
    return {
      popupInside: popup.left >= 0 && popup.right <= innerWidth && popup.top >= 0 && popup.bottom <= innerHeight,
      sheetGone: sheet.top >= innerHeight,
      overflow: document.documentElement.scrollWidth > innerWidth,
    };
  });
  expect(regular).toEqual({ popupInside: true, sheetGone: true, overflow: false });

  await page.setViewportSize({ width: 320, height: 568 });
  await expect.poll(() => page.locator(".leaflet-popup").evaluate((popup) => {
    const box = popup.getBoundingClientRect();
    return box.left >= 0 && box.right <= innerWidth && box.top >= 0 && box.bottom <= innerHeight;
  })).toBe(true);
  const scroll = await page.locator(".leaflet-popup-content").evaluate((content) => ({
    canScroll: content.scrollHeight > content.clientHeight,
    noPageOverflow: document.documentElement.scrollWidth <= innerWidth,
  }));
  expect(scroll).toEqual({ canScroll: true, noPageOverflow: true });

  await page.locator(".leaflet-popup-close-button").click();
  await expect(sidebar).not.toHaveClass(/popup-peek/);
  await expect(sidebar).toHaveCSS("opacity", "1");
  await expect(sidebar).toHaveCSS("pointer-events", "auto");
});

test("an open popup reflows when a desktop window is narrowed", async ({ page }) => {
  await page.setViewportSize({ width: 1100, height: 844 });
  await page.getByText("Seven Miles Cafe", { exact: true }).click();
  await expect(page.locator("#sidebar")).not.toHaveClass(/popup-peek/);

  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.locator("#sidebar")).toHaveClass(/popup-peek/);
  await expect.poll(() => page.locator(".leaflet-popup").evaluate((popup) => {
    const box=popup.getBoundingClientRect();
    return box.left>=0&&box.right<=innerWidth&&box.top>=0&&box.bottom<=innerHeight;
  })).toBe(true);
});

test("brand typography keeps a deliberate two-level rhythm", async ({ page }) => {
  const rhythm = await page.locator(".brand").evaluate((brand) => {
    const title=brand.querySelector(".wm").getBoundingClientRect();
    const subtitle=brand.querySelector(".sub").getBoundingClientRect();
    return { titleToSubtitle:subtitle.top-title.bottom, height:brand.getBoundingClientRect().height };
  });
  expect(rhythm.titleToSubtitle).toBeGreaterThanOrEqual(6);
  expect(rhythm.height).toBeGreaterThanOrEqual(88);
  await expect(page.locator(".brand")).not.toContainText("Your personal map");
  await expect(page.locator(".mark")).toHaveCount(0);
});

test("sidebar colour roles do not compete for primary attention", async ({ page }) => {
  await expect(page.locator("#filters")).toBeHidden();
  await expect(page.locator("#statCatLabel")).toHaveText("kind");
  const roles = await page.evaluate(() => ({
    decisionBackground:getComputedStyle(document.querySelector(".decision-btn")).backgroundColor,
    decisionInk:getComputedStyle(document.querySelector(".decision-btn")).color,
    addBackground:getComputedStyle(document.querySelector("#addBtn")).backgroundColor,
    addInk:getComputedStyle(document.querySelector("#addBtn")).color,
  }));
  expect(roles.decisionBackground).not.toBe(roles.addBackground);
  expect(roles.decisionInk).not.toBe(roles.addInk);
});

test("category filters return when the map contains more than one kind", async ({ page }) => {
  await page.getByRole("button", { name: "Save a place" }).click();
  await page.locator("#fName").fill("A small lunch stop");
  await page.locator("#fCat").selectOption("food");
  await page.locator("#fLat").fill("-33.87");
  await page.locator("#fLng").fill("151.21");
  await page.getByRole("button", { name: "Save", exact: true }).click();

  await expect(page.locator("#filters")).toBeVisible();
  await expect(page.locator("#filters")).toContainText("Coffee");
  await expect(page.locator("#filters")).toContainText("Food");
  await expect(page.locator("#statCatLabel")).toHaveText("kinds");
});

test("personal list leads with recent memories and keeps ratings out of the index", async ({ page }) => {
  const cards = page.locator("#list .card");
  await expect(cards.nth(0).locator(".t")).toHaveText("Seven Miles Cafe");
  await expect(cards.nth(0).locator(".m")).toContainText("Visited 17 Jul");
  await expect(cards.nth(0).locator(".memory")).toContainText("whole group");
  await expect(cards.nth(1).locator(".t")).toHaveText("Meisterstück");
  await expect(page.locator("#list .stars")).toHaveCount(0);
  await expect(page.locator("#list .list-section")).toHaveText("More from your map");
});

test("A-Z sorting is explicit and removes the legacy date section", async ({ page }) => {
  await page.getByLabel("Sort places").selectOption("name");
  const names = await page.locator("#list .card .t").allTextContents();
  const expected = [...names].sort((a,b)=>a.localeCompare(b,undefined,{sensitivity:"base"}));
  expect(names).toEqual(expected);
  await expect(page.locator("#list .list-section")).toHaveCount(0);
});

test("memory rows remain calm and contained on a narrow screen", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const layout = await page.evaluate(() => {
    const panel = document.querySelector("#sidebar").getBoundingClientRect();
    const first = document.querySelector("#list .card").getBoundingClientRect();
    const memory = document.querySelector("#list .card .memory").getBoundingClientRect();
    const cta = document.querySelector(".decision-btn").getBoundingClientRect();
    return {
      bodyOverflow: document.documentElement.scrollWidth > innerWidth,
      panelInside: panel.left >= 0 && panel.right <= innerWidth,
      rowInside: first.left >= panel.left && first.right <= panel.right,
      memoryInside: memory.left >= first.left && memory.right <= first.right,
      ctaInside: cta.left >= panel.left && cta.right <= panel.right,
    };
  });
  expect(layout).toEqual({ bodyOverflow:false, panelInside:true, rowInside:true, memoryInside:true, ctaInside:true });
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
