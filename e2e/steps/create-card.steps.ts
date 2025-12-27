import { Given, When, Then } from "@cucumber/cucumber";
import { expect, type Response } from "@playwright/test";
import path from "path";
import { PlaywrightWorld } from "../support/world";

const PAGE_PATHS: Record<string, string> = {
  "Boîtes": "../front/pages/boxes.html",
};

// GIVEN
/* Given("User is connected", async function (this: PlaywrightWorld) {
}); */

// WHEN
When("I open the {string} page", async function (this: PlaywrightWorld, pageName: string) {
  const { page } = this;

  const relativePath = PAGE_PATHS[pageName];
  if (!relativePath) {
    throw new Error(`Unknown page name: ${pageName}`);
  }

  const fileUrl = "file://" + path.resolve(relativePath);
  await page.goto(fileUrl);
});

When(
  "I type {string} in the field {string}",
  async function (this: PlaywrightWorld, value: string, fieldLabel: string) {
    const { page } = this;

    let selector: string;
    switch (fieldLabel) {
      case "Question":
        selector = "#question";
        this.lastQuestion = value;
        break;
      case "Answer":
        selector = "#answer";
        break;
      default:
        throw new Error(`Unknown field label: ${fieldLabel}`);
    }

    await page.fill(selector, "");
    await page.fill(selector, value);
  }
);

When(
  "I click on the {string} button",
  async function (this: PlaywrightWorld, buttonText: string) {
    const { page } = this;

    await Promise.all([
      page.waitForResponse((res: Response) =>
        res.url().endsWith("/cards") && res.request().method() === "POST"
      ),
      page.getByRole("button", { name: buttonText }).click(),
    ]);

    await page.waitForTimeout(200);
  }
);

// THEN
Then(
  "the card {string} is in the Category 1",
  async function (this: PlaywrightWorld, question: string) {
    const { page } = this;

    const container = page.locator("#cardsContainer");
    await expect(container).toBeVisible();

    const categoryColumn = container.locator(".category-column", {
      hasText: "CATÉGORIE 1",
    });
    await expect(categoryColumn).toBeVisible();

    const cardItem = categoryColumn.locator(".card-item", {
      hasText: question,
    });

    await expect(cardItem).toHaveCount(1);
  }
);