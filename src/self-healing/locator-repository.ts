import { ElementDefinition } from './types';

/**
 * Structured locator repository that stores primary and declared fallback candidates.
 */
export class LocatorRepository {
  private static instance: LocatorRepository;
  private elements: Map<string, ElementDefinition> = new Map();

  private constructor() {
    this.registerStandardElements();
  }

  public static getInstance(): LocatorRepository {
    if (!LocatorRepository.instance) {
      LocatorRepository.instance = new LocatorRepository();
    }
    return LocatorRepository.instance;
  }

  private getKey(name: string, page?: string): string {
    return `${page || 'Global'}.${name}`.toLowerCase();
  }

  /**
   * Registers a single element definition with primary and fallback locators.
   */
  public register(def: ElementDefinition): void {
    const key = this.getKey(def.name, def.page);
    this.elements.set(key, def);
  }

  /**
   * Registers multiple element definitions.
   */
  public registerMany(defs: ElementDefinition[]): void {
    defs.forEach((d) => this.register(d));
  }

  /**
   * Finds an element definition by name and optional page.
   */
  public get(name: string, page?: string): ElementDefinition | undefined {
    // Exact page match
    const pageKey = this.getKey(name, page);
    if (this.elements.has(pageKey)) {
      return this.elements.get(pageKey);
    }

    // Global fallback match
    const globalKey = this.getKey(name);
    if (this.elements.has(globalKey)) {
      return this.elements.get(globalKey);
    }

    // Fuzzy search by element name alone across pages
    for (const [key, def] of this.elements.entries()) {
      if (key.endsWith(`.${name.toLowerCase()}`) || def.name.toLowerCase() === name.toLowerCase()) {
        return def;
      }
    }

    return undefined;
  }

  /**
   * Helper that either returns existing registration or builds a dynamic ElementDefinition.
   */
  public resolve(
    target: string | ElementDefinition,
    page?: string
  ): ElementDefinition {
    if (typeof target !== 'string') {
      return target;
    }

    const registered = this.get(target, page);
    if (registered) {
      return registered;
    }

    // If not registered in repository, synthesize an ElementDefinition from the selector
    return {
      name: target,
      page: page || 'GenericPage',
      primary: target,
      fallbacks: [],
    };
  }

  /**
   * Pre-registers standard OrangeHRM elements to showcase repository-driven healing.
   */
  private registerStandardElements(): void {
    const standardElements: ElementDefinition[] = [
      {
        name: 'UsernameInput',
        page: 'LoginPage',
        primary: 'input[name="username"]',
        fallbacks: [
          'input[placeholder="Username"]',
          'getByPlaceholder("Username")',
          '[data-testid="username"]',
          'div.oxd-input-group:has-text("Username") >> input',
          '.oxd-form-row:nth-child(1) input',
        ],
        role: 'textbox',
        accessibleName: 'Username',
        description: 'Login username text box',
      },
      {
        name: 'PasswordInput',
        page: 'LoginPage',
        primary: 'input[name="password"]',
        fallbacks: [
          'input[placeholder="Password"]',
          'input[type="password"]',
          'getByPlaceholder("Password")',
          '[data-testid="password"]',
          'div.oxd-input-group:has-text("Password") >> input',
        ],
        role: 'textbox',
        accessibleName: 'Password',
        description: 'Login password text box',
      },
      {
        name: 'LoginButton',
        page: 'LoginPage',
        primary: 'button[type="submit"]',
        fallbacks: [
          'button:has-text("Login")',
          'getByRole("button", { name: "Login" })',
          '.oxd-button--main',
          '[data-testid="login-button"]',
          'button.orangehrm-login-button',
        ],
        role: 'button',
        accessibleName: 'Login',
        description: 'Login form submit button',
      },
      {
        name: 'DashboardHeading',
        page: 'DashboardPage',
        primary: 'h6:has-text("Dashboard")',
        fallbacks: [
          'getByRole("heading", { name: "Dashboard" })',
          'header:has-text("Dashboard")',
          '.oxd-topbar-header-breadcrumb h6',
          'span.oxd-topbar-header-breadcrumb-module',
        ],
        role: 'heading',
        accessibleName: 'Dashboard',
        description: 'Dashboard top header title',
      },
      {
        name: 'RecruitmentMenuItem',
        page: 'Navigation',
        primary: 'span.oxd-main-menu-item--name:has-text("Recruitment")',
        fallbacks: [
          'a[href*="recruitment"]',
          'getByRole("link", { name: "Recruitment" })',
          'nav.oxd-navbar-nav >> text=Recruitment',
        ],
        role: 'link',
        accessibleName: 'Recruitment',
      },
      {
        name: 'VacanciesTab',
        page: 'RecruitmentPage',
        primary: 'a.oxd-topbar-body-nav-tab-item:has-text("Vacancies")',
        fallbacks: [
          'getByRole("link", { name: "Vacancies" })',
          'nav.oxd-topbar-body-nav >> text=Vacancies',
          'a[href*="viewJobVacancy"]',
        ],
        role: 'link',
        accessibleName: 'Vacancies',
      },
      {
        name: 'AddVacancyButton',
        page: 'RecruitmentPage',
        primary: 'button:has-text("Add")',
        fallbacks: [
          'getByRole("button", { name: "Add" })',
          'div.orangehrm-header-container button',
          '.oxd-button--secondary:has-text("Add")',
        ],
        role: 'button',
        accessibleName: 'Add',
      },
    ];

    this.registerMany(standardElements);
  }
}

export const locatorRepository = LocatorRepository.getInstance();
