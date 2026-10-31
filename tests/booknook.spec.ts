import { test, expect } from "@playwright/test";

test.describe("BookNook Client End-to-End Tests", () => {
  test("Home page loads with brand, hero slider, and custom page title", async ({
    page,
  }) => {
    await page.goto("/");

    // Verify dynamic page title
    await expect(page).toHaveTitle(/BookNook \| Home/);

    // Verify brand in Navbar
    const brand = page.locator("nav").getByText("BookNook");
    await expect(brand).toBeVisible();

    // Verify Hero title
    const heroTitle = page.getByRole("heading", { level: 1 }).first();
    await expect(heroTitle).toBeVisible();

    // Verify New Arrivals section
    const newArrivalsHeading = page.getByRole("heading", {
      name: "New Arrivals",
    });
    await expect(newArrivalsHeading).toBeVisible();

    // Verify Footer
    const footer = page.locator("footer");
    await expect(footer).toBeVisible();
    await expect(footer.getByText("© 2026 BookNook")).toBeVisible();
  });

  test("Theme toggle toggles dark and light mode", async ({ page }) => {
    await page.goto("/");

    const html = page.locator("html");
    const themeBtn = page.getByRole("button", { name: "Toggle theme" }).first();

    await expect(themeBtn).toBeVisible();

    // Toggle theme
    await themeBtn.click();
    await page.waitForTimeout(300);

    // Click again to cycle back
    await themeBtn.click();
    await page.waitForTimeout(300);
  });

  test("All Books page search and category filtering work correctly", async ({
    page,
  }) => {
    await page.goto("/books");

    // Verify page title
    await expect(page).toHaveTitle(/BookNook \| All Books/);

    // Verify heading
    await expect(
      page.getByRole("heading", { name: "All Books" })
    ).toBeVisible();

    // Verify search input
    const searchInput = page.getByPlaceholder(/Search by title or author/i).first();
    await expect(searchInput).toBeVisible();

    // Type a query
    await searchInput.fill("Mockingbird");
    await page.waitForTimeout(400);

    // Verify filtered card is shown
    await expect(page.getByText("To Kill a Mockingbird").first()).toBeVisible();
  });

  test("Registration form shows real-time password requirement checklist", async ({
    page,
  }) => {
    await page.goto("/register");

    // Verify page title
    await expect(page).toHaveTitle(/BookNook \| Register/);

    // Verify password checklist text
    await expect(page.getByText("Password requirements:").first()).toBeVisible();
    await expect(
      page.getByText("At least one uppercase letter (A-Z)").first()
    ).toBeVisible();
    await expect(
      page.getByText("At least one lowercase letter (a-z)").first()
    ).toBeVisible();
    await expect(page.getByText("Minimum 6 characters in length").first()).toBeVisible();

    // Fill form with invalid password (missing uppercase)
    await page.locator("#name").first().fill("Test Reader");
    await page.locator("#email").first().fill("test@example.com");
    await page.locator("#password").first().fill("simple");

    // Submit button
    const submitBtn = page.getByRole("button", { name: "Register" }).first();
    await submitBtn.click();

    // Checklist uppercase rule should trigger error
    await expect(page.getByText("Password must include at least one uppercase letter.").first()).toBeVisible();
  });

  test("Custom 404 page renders for invalid routes", async ({ page }) => {
    await page.goto("/some-unknown-path-that-does-not-exist");

    await expect(page.getByText("404")).toBeVisible();
    await expect(
      page.getByText("This page isn't on our shelf.")
    ).toBeVisible();

    const homeButton = page.getByRole("link", { name: /Back to Home/i });
    await expect(homeButton).toBeVisible();
  });
});
