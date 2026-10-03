import { Page } from '@playwright/test';
import { BasePage } from '../src/self-healing/base-page';
import { HealedLocator } from '../src/self-healing/healed-locator';

/**
 * Example Page Object demonstrating seamless integration with Self-Healing architecture.
 * Leverages BasePage, LocatorRepository, and automatic fallback resilience.
 */
export class LoginPage extends BasePage {
  constructor(page: Page) {
    super(page, 'LoginPage');
  }

  public async navigate(): Promise<void> {
    await this.page.goto('https://opensource-demo.orangehrmlive.com/');
  }

  public get usernameInput(): HealedLocator {
    return this.getElement('UsernameInput', 'input[name="username"]');
  }

  public get passwordInput(): HealedLocator {
    return this.getElement('PasswordInput', 'input[name="password"]');
  }

  public get loginButton(): HealedLocator {
    return this.getElement('LoginButton', 'button[type="submit"]');
  }

  public async login(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  public async isDashboardVisible(): Promise<boolean> {
    const dashboardHeading = this.page.find({
      name: 'DashboardHeading',
      page: 'DashboardPage',
      primary: 'h6:has-text("Dashboard")',
      fallbacks: [
        'getByRole("heading", { name: "Dashboard" })',
        '.oxd-topbar-header-breadcrumb h6',
      ],
    });
    return await dashboardHeading.isVisible();
  }
}
