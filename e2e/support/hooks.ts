import { BeforeAll, AfterAll, Before, After, setDefaultTimeout  } from "@cucumber/cucumber";
import { chromium, request, type Browser, type APIRequestContext } from "@playwright/test";
import { PlaywrightWorld } from "./world";

let browser: Browser;
let apiRequest: APIRequestContext;

setDefaultTimeout(60 * 1000);

BeforeAll(async function () {
  browser = await chromium.launch({
    headless: false,
    slowMo: 1500
  });

  apiRequest = await request.newContext({
    baseURL: "http://localhost:8080",
  });
});

AfterAll(async function () {
  await apiRequest.dispose();
  await browser.close();
});

Before(async function (this: PlaywrightWorld) {
  await this.initBrowser(browser, apiRequest);
});

After(async function (this: PlaywrightWorld) {
  await this.closeBrowser();
});