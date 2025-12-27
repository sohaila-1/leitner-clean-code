import { setWorldConstructor, World, IWorldOptions }
  from "@cucumber/cucumber";

import { chromium, request, Browser, BrowserContext, Page, APIRequestContext }
  from "@playwright/test";
export class PlaywrightWorld extends World {
  browser!: Browser;
  context!: BrowserContext;
  page!: Page;
  request!: APIRequestContext;

  lastQuestion?: string;

  constructor(options: IWorldOptions) {
    super(options);
  }

  async initBrowser(browser: Browser, apiRequest: APIRequestContext) {
    this.browser = browser;
    this.context = await browser.newContext();
    this.page = await this.context.newPage();
    this.request = apiRequest;
  }

  async closeBrowser() {
    if (this.context) {
      await this.context.close();
    }
  }
}

setWorldConstructor(PlaywrightWorld);