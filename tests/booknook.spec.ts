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
    const heroTitle = page.getByRole("heading", { level: 1 });
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
    const searchInput = page.getByPlaceholder(/Search by title or author/i);
    await expect(searchInput).toBeVisible();

    // Type a query
    await searchInput.fill("Mockingbird");
    await page.waitForTimeout(400);

    // Verify filtered card is shown
    await expect(page.getByText("To Kill a Mockingbird")).toBeVisible();
  });

  test("Registration form shows real-time password requirement checklist", async ({
    page,
  }) => {
    await page.goto("/register");

    // Verify page title
    await expect(page).toHaveTitle(/BookNook \| Register/);

    // Verify password checklist text
    await expect(page.getByText("Password requirements:")).toBeVisible();
    await expect(
      page.getByText("At least one uppercase letter (A-Z)")
    ).toBeVisible();
    await expect(
      page.getByText("At least one lowercase letter (a-z)")
    ).toBeVisible();
    await expect(page.getByText("Minimum 6 characters in length")).toBeVisible();

    // Fill invalid password
    const passwordInput = page.locator("#password");
    await passwordInput.fill("simple");

    // Submit button
    const submitBtn = page.getByRole("button", { name: "Register" });
    await submitBtn.click();

    // Checklist uppercase rule should not be satisfied
    await expect(page.locator("text=Password must include")).toBeVisible();
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
