# Playwright TypeScript End-to-End Automation Framework

A test automation framework built with **Playwright** and **TypeScript** for end-to-end testing of the OrangeHRM demo platform, featuring continuous integration via Jenkins.

---

## 🚀 Tech Stack

- **Language:** TypeScript
- **Automation Framework:** [Microsoft Playwright](https://playwright.dev/) (`@playwright/test`)
- **Runtime:** Node.js
- **CI/CD:** Jenkins Declarative Pipeline with GitHub Webhook triggers (`githubPush`)
- **Reporting:** Playwright HTML Report, JSON Reporter, and JUnit XML (integrated with Jenkins)

---

## 📁 Project Structure

```text
PlaywrightMCP-with-TypeScript/
├── tests/
│   ├── 01login.spec.ts             # Login to OrangeHRM and dashboard validation
│   ├── 02logout.spec.ts            # Logout and session invalidation
│   ├── 03buzz-post.spec.ts         # Create and publish dynamic Buzz post
│   ├── 04delete-buzz-post.spec.ts  # Delete created Buzz post
│   ├── 05system-user.spec.ts       # Verify Admin system users
│   ├── 06add-user.spec.ts          # Create new Admin system user
│   ├── 07practice-login.spec.ts    # Authentication on practice test site
│   ├── 08add-vacancy.spec.ts       # Recruitment: create new vacancy
│   ├── 09delete-vacancy.spec.ts    # Recruitment: delete created vacancy
│   └── 10employee.spec.ts          # PIM: end-to-end employee lifecycle
├── test_data/                      # Test data and assets
├── utils/                          # Helper functions & test data generators
├── Jenkinsfile                     # Declarative CI/CD pipeline definition
├── playwright.config.ts            # Playwright runner configuration
├── package.json                    # Project dependencies and test scripts
└── tsconfig.json                   # TypeScript configuration
```

---

## 🧪 Test Scenarios

The suite automated tests run sequentially (`workers: 1`):

1. **Authentication:**
   - [`01login.spec.ts`](tests/01login.spec.ts): Verifies successful login and dashboard visibility.
   - [`02logout.spec.ts`](tests/02logout.spec.ts): Verifies profile logout and redirect to login page.
2. **Buzz Module:**
   - [`03buzz-post.spec.ts`](tests/03buzz-post.spec.ts): Publishes a unique timestamped Buzz post.
   - [`04delete-buzz-post.spec.ts`](tests/04delete-buzz-post.spec.ts): Locates and deletes the post.
3. **Admin User Management:**
   - [`05system-user.spec.ts`](tests/05system-user.spec.ts): Verifies Admin system user table search.
   - [`06add-user.spec.ts`](tests/06add-user.spec.ts): Adds a new user account with employee linkage.
4. **Practice Site:**
   - [`07practice-login.spec.ts`](tests/07practice-login.spec.ts): Verifies login flow on external practice site.
5. **Recruitment Module:**
   - [`08add-vacancy.spec.ts`](tests/08add-vacancy.spec.ts): Adds a new job vacancy and verifies creation.
   - [`09delete-vacancy.spec.ts`](tests/09delete-vacancy.spec.ts): Searches and removes the created vacancy.
6. **PIM Employee Lifecycle:**
   - [`10employee.spec.ts`](tests/10employee.spec.ts): Creates a complete employee profile (photo upload, credentials, personal details), verifies creation, and cleans up.

---

## ⚙️ Prerequisites

- **Node.js** (v18 or higher recommended)
- **npm** (bundled with Node.js)
- **Git**

---

## 🛠️ Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/neelgaganlikki-pixel/PlaywrightMCP-with-TypeScript.git
cd PlaywrightMCP-with-TypeScript
```

### 2. Install dependencies
```bash
npm install
```

### 3. Install Playwright browser binaries
```bash
npx playwright install chromium
```

---

## 🏃 Running Tests

### Run all tests
```bash
npx playwright test
```
*(or via npm script)*:
```bash
npm test
```

### Run in Interactive UI Mode
```bash
npx playwright test --ui
```

### Run a specific test file
```bash
npx playwright test tests/01login.spec.ts
```

### Run in Headed mode
```bash
npx playwright test --headed
```

### View test report
```bash
npx playwright show-report
```

---

## 🔄 CI/CD with Jenkins

The framework is configured with a declarative `Jenkinsfile`:
- **Triggers:** Automatically triggered on code pushes to the `main` branch via GitHub Webhook (`githubPush()`), or scheduled nightly via cron.
- **Reporting:** Archives test results, publishes JUnit reports, and parses JSON output to deliver email summaries.

