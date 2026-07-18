const { test, expect } = require("playwright/test");

async function openPicker(page) {
  await page.getByRole("button", { name: "Where to next?", exact: true }).click();
  await expect(page.getByRole("dialog", { name: "What sounds good?" })).toBeVisible();
}

async function choosePlace(page) {
  await page.getByRole("button", { name: "Choose for me" }).click();
  await expect(page.getByRole("dialog", { name: "Try this one" })).toBeVisible();
}

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => localStorage.clear());
  await page.reload();
});

test("picker keeps setup states distinct and returns current map data", async ({ page }) => {
  await openPicker(page);

  await expect(page.getByRole("button", { name: "Another one" })).toBeHidden();
  await expect(page.getByText("Blue Bottle Coffee", { exact: true })).toHaveCount(0);
  await expect(page.getByRole("tab", { name: "From my map" })).toHaveAttribute("aria-selected", "true");
  await expect(page.getByText("Only places worth returning to.")).toBeVisible();
  await expect(page.locator("#pickSetup")).not.toContainText("Trusted picks");

  const trustedByDefault = await page.evaluate(() => pickEligible(pickConstraints()).every((pin) => pin.recommended));
  expect(trustedByDefault).toBe(true);

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
  await expect(page.getByRole("button", { name: "Another one" })).toBeVisible();

  const resultName = (await page.locator(".pick-card h3").innerText()).trim();
  const currentNames = await page.evaluate(() =>
    window.TRAVEL_PINS.map((pin) => pin.name.replace(/\s+\((?:side|inside|near|opposite|next)[^)]+\)$/i, ""))
  );
  expect(currentNames).toContain(resultName);
});

test("nearby mode returns one sourced place that is not already on the map", async ({ page, context }) => {
  await context.grantPermissions(["geolocation"]);
  await context.setGeolocation({ latitude: -33.8688, longitude: 151.2093 });
  await page.route("**/search?*", async (route) => route.fulfill({
    status: 200,
    contentType: "application/json",
    body: JSON.stringify([
      { osm_type:"node",osm_id:991,lat:"-33.8677",lon:"151.2082",name:"Aster Coffee Room",type:"cafe",address:{house_number:"12",road:"New Lane"} },
      { osm_type:"node",osm_id:992,lat:"-33.8675",lon:"151.2080",name:"Central Roasters Coffee",type:"cafe",address:{} }
    ])
  }));

  await openPicker(page);
  await page.getByRole("tab", { name: "Somewhere new" }).click();
  await expect(page.getByRole("heading", { name: "A place not on your map yet." })).toBeVisible();
  await expect(page.getByText("Your location is used only for this search.")).toBeVisible();
  await page.getByRole("button", { name: "Find a place" }).click();

  await expect(page.getByRole("dialog", { name: "Try somewhere new" })).toBeVisible();
  await expect(page.locator(".pick-card h3")).toHaveText("Aster Coffee Room");
  await expect(page.locator(".source-note")).toContainText("OpenStreetMap");
  await expect(page.getByRole("button", { name: "Open directions" })).toBeVisible();
});

test("nearby mode handles a declined location without losing the picker", async ({ page }) => {
  await page.evaluate(() => {
    Object.defineProperty(navigator, "geolocation", { configurable: true, value: {
      getCurrentPosition(_success, error){ error({ code: 1, message: "denied" }); }
    }});
  });
  await openPicker(page);
  await page.getByRole("tab", { name: "Somewhere new" }).click();
  await page.getByRole("button", { name: "Find a place" }).click();

  await expect(page.getByRole("dialog", { name: "Location needed" })).toBeVisible();
  await expect(page.getByText("Allow location access, then try once more.")).toBeVisible();
  await expect(page.getByRole("button", { name: "Try again" })).toBeVisible();
});

test("nearby mode uses a configured Google Places provider with compliant attribution", async ({ page, context }) => {
  await context.grantPermissions(["geolocation"]);
  await context.setGeolocation({ latitude: -33.8688, longitude: 151.2093 });
  await page.evaluate(() => { window.TRAVELPINS_GOOGLE_MAPS_KEY = "restricted-browser-key"; });
  let requestedFields="";
  await page.route("**/v1/places:searchNearby", async (route) => {
    requestedFields=route.request().headers()["x-goog-fieldmask"]||"";
    await route.fulfill({ status:200, contentType:"application/json", body:JSON.stringify({ places:[{
      id:"google-place-1",displayName:{text:"Juniper Coffee"},formattedAddress:"14 Market Street",location:{latitude:-33.8677,longitude:151.2082},primaryType:"cafe",googleMapsUri:"https://maps.google.com/?cid=1"
    }] }) });
  });

  await openPicker(page);
  await page.getByRole("tab", { name:"Somewhere new" }).click();
  await page.getByRole("button", { name:"Find a place" }).click();
  await expect(page.locator(".pick-card h3")).toHaveText("Juniper Coffee");
  const attribution=page.locator(".source-note .google-maps");
  await expect(attribution).toHaveText("Google Maps");
  await expect(attribution).toHaveAttribute("translate","no");
  expect(requestedFields).not.toContain("rating");
  expect(requestedFields).not.toContain("reviews");
});

test("nearby picker remains balanced on a phone", async ({ page, context }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await context.grantPermissions(["geolocation"]);
  await context.setGeolocation({ latitude: -33.8688, longitude: 151.2093 });
  await page.route("**/search?*", async (route) => route.fulfill({
    status: 200, contentType: "application/json",
    body: JSON.stringify([{ osm_type:"node",osm_id:993,lat:"-33.8677",lon:"151.2082",name:"Aster Coffee Room",type:"cafe",address:{} }])
  }));
  await openPicker(page);
  await page.getByRole("tab", { name: "Somewhere new" }).click();
  await page.getByRole("button", { name: "Find a place" }).click();
  await expect(page.getByRole("dialog", { name: "Try somewhere new" })).toBeVisible();

  const geometry = await page.locator(".pick-modal").evaluate((modal) => {
    const box=modal.getBoundingClientRect(), actions=modal.querySelector(".modal-actions").getBoundingClientRect();
    return { inside:box.left>=0&&box.right<=innerWidth&&box.top>=0&&box.bottom<=innerHeight, actionsInside:actions.bottom<=innerHeight, overflow:document.documentElement.scrollWidth>innerWidth };
  });
  expect(geometry).toEqual({ inside:true, actionsInside:true, overflow:false });
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

  await expect.poll(() => page.evaluate(() => {
    const popup = document.querySelector(".leaflet-popup").getBoundingClientRect();
    const sheet = document.querySelector("#sidebar").getBoundingClientRect();
    return {
      popupInside: popup.left >= 0 && popup.right <= innerWidth && popup.top >= 0 && popup.bottom <= innerHeight,
      sheetGone: sheet.top >= innerHeight,
      overflow: document.documentElement.scrollWidth > innerWidth,
    };
  })).toEqual({ popupInside: true, sheetGone: true, overflow: false });

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
  await expect(page.locator(".decision-btn")).toHaveText(/Where to next\?/);
  await expect(page.locator("#pickSetup")).not.toContainText("Tell us what sounds good");
  expect(parseFloat(await page.locator(".decision-copy").evaluate((copy) => getComputedStyle(copy).fontSize))).toBeGreaterThanOrEqual(17);
  const roles = await page.evaluate(() => ({
    decisionBackground:getComputedStyle(document.querySelector(".decision-btn")).backgroundColor,
    decisionInk:getComputedStyle(document.querySelector(".decision-btn")).color,
    addBackground:getComputedStyle(document.querySelector("#addBtn")).backgroundColor,
    addInk:getComputedStyle(document.querySelector("#addBtn")).color,
  }));
  expect(roles.decisionBackground).not.toBe(roles.addBackground);
  expect(roles.decisionInk).not.toBe(roles.addInk);
});

test("decision, search, and list follow the intended product hierarchy", async ({ page }) => {
  const layout=await page.evaluate(() => {
    const decision=document.querySelector(".decision-btn").getBoundingClientRect();
    const search=document.querySelector("#search").getBoundingClientRect();
    const tools=document.querySelector(".list-tools").getBoundingClientRect();
    const first=document.querySelector("#list .card").getBoundingClientRect();
    return {
      order:decision.top<search.top&&search.bottom<tools.top&&tools.bottom<=first.top+1,
      searchHeight:search.height,
      decisionHeight:decision.height,
      gapToList:tools.top-search.bottom,
    };
  });
  expect(layout.order).toBe(true);
  expect(layout.searchHeight).toBeLessThanOrEqual(48);
  expect(layout.decisionHeight).toBeLessThanOrEqual(60);
  expect(layout.gapToList).toBeLessThanOrEqual(24);
});

test("fine-pointer feedback reveals the journey artwork without reflowing the sidebar", async ({ page }) => {
  const button=page.locator(".decision-btn");
  const before=await button.boundingBox();
  await button.hover({ position:{ x:120,y:27 } });
  await expect(button).toHaveClass(/pointer-reveal/);
  await page.waitForTimeout(280);

  const feedback=await button.evaluate((element)=>({
    opacity:parseFloat(getComputedStyle(element,"::before").opacity),
    revealX:element.style.getPropertyValue("--reveal-x"),
    revealY:element.style.getPropertyValue("--reveal-y"),
  }));
  const after=await button.boundingBox();
  expect(feedback.opacity).toBeGreaterThan(.35);
  expect(feedback.revealX).toMatch(/px$/);
  expect(feedback.revealY).toMatch(/px$/);
  expect(after.width).toBe(before.width);
  expect(after.height).toBe(before.height);

  await page.mouse.move(1000,700);
  await expect(button).not.toHaveClass(/pointer-reveal/);
});

test("place feedback uses one quiet cinnabar gesture", async ({ page }) => {
  const card=page.locator("#list .card:not(.sel)").first();
  await card.hover();
  await page.waitForTimeout(240);
  const ringOpacity=await card.locator(".pin").evaluate((pin)=>parseFloat(getComputedStyle(pin,"::after").opacity));
  expect(ringOpacity).toBeGreaterThan(.5);

  await card.click();
  const selected=page.locator("#list .card.sel");
  await expect(selected).toHaveCount(1);
  await page.waitForTimeout(240);
  const selection=await selected.evaluate((element)=>({
    opacity:parseFloat(getComputedStyle(element,"::before").opacity),
    transform:getComputedStyle(element,"::before").transform,
  }));
  expect(selection.opacity).toBe(1);
  expect(selection.transform).not.toContain("0.25");
});

test("reduced-motion preference keeps pointer ornament still", async ({ page }) => {
  await page.emulateMedia({ reducedMotion:"reduce" });
  await page.reload();
  const button=page.locator(".decision-btn");
  await button.hover({ position:{ x:120,y:27 } });
  await expect(button).not.toHaveClass(/pointer-reveal/);
  await expect.poll(()=>button.evaluate((element)=>getComputedStyle(element,"::before").display)).toBe("none");
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
