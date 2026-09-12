import { expect, Page } from '@playwright/test';

export class EmployeePage {
  constructor(private page: Page) {}

  async navigateToPIM() {
    const pimLink = this.page.getByRole('link', { name: 'PIM' }).first();
    await pimLink.waitFor({ state: 'visible', timeout: 15000 });
    await pimLink.click();
    await this.page.waitForURL(/\/pim\//, { timeout: 15000 });
  }

  async openEmployeeList() {
    const employeeListLink = this.page.getByRole('link', { name: 'Employee List' }).first();
    await employeeListLink.waitFor({ state: 'visible', timeout: 15000 });
    await employeeListLink.click();
    await this.page.waitForURL(/\/pim\/viewEmployeeList/, { timeout: 15000 });
  }

  async clickAddEmployee() {
    const addEmployeeButton = this.page.getByText('Add Employee', { exact: true }).first();
    await addEmployeeButton.waitFor({ state: 'visible', timeout: 15000 });
    await addEmployeeButton.click();
  }

  async fillEmployeeDetails(firstName: string, middleName: string, lastName: string, employeeId: string) {
    await this.page.getByPlaceholder('First Name').fill(firstName);
    await this.page.getByPlaceholder('Middle Name').fill(middleName);
    await this.page.getByPlaceholder('Last Name').fill(lastName);
    await this.inputByLabel('Employee Id').fill(employeeId);
  }

  async uploadPhoto(photoPath: string) {
    await this.page.locator('input[type="file"]').setInputFiles(photoPath);
  }

  async enableCreateLoginDetails() {
    await this.page.locator('.oxd-switch-wrapper span').click();
  }

  async fillLoginDetails(username: string, password: string) {
    await this.inputByLabel('Username').fill(username);
    await this.inputByLabel('Password').fill(password);
    await this.inputByLabel('Confirm Password').fill(password);
  }

  async saveEmployee() {
    const saveButton = this.page.getByRole('button', { name: 'Save' }).last();
    await saveButton.waitFor({ state: 'visible', timeout: 15000 });
    await saveButton.click();
  }

  async verifySuccessToast(expectedMessage: string) {
    const toast = this.page.locator('.oxd-toast:visible').first();
    await toast.waitFor({ state: 'visible', timeout: 15000 });
    await expect(toast).toContainText(expectedMessage);
  }

  async waitForPersonalDetails() {
    await this.inputByLabel('Other Id').waitFor({ state: 'visible', timeout: 30000 });
  }

  async selectRandomByLabel(label: string) {
    const dropdown = this.fieldContainer(label).locator('.oxd-select-text');
    await dropdown.waitFor({ state: 'visible', timeout: 30000 });
    await dropdown.click();

    const options = this.page.locator('.oxd-select-option:visible');
    const values = (await options.allInnerTexts())
      .map(value => value.trim())
      .filter(value => value && !value.startsWith('--'));
    if (!values.length) throw new Error(`No valid options found for ${label}`);

    const selected = values[Math.floor(Math.random() * values.length)];
    await options.filter({ hasText: selected }).first().click();
    return selected;
  }

  async fillPersonalDetails(data: {
    otherId: string;
    driverLicenseNumber: string;
    licenseExpiryDate: string;
    dateOfBirth: string;
    gender: string;
    testField: string;
  }) {
    await this.inputByLabel('Other Id').fill(data.otherId);
    await this.inputByLabel("Driver's License Number").fill(data.driverLicenseNumber);
    await this.inputByLabel('License Expiry Date').fill(data.licenseExpiryDate);
    await this.inputByLabel('Date of Birth').fill(data.dateOfBirth);
    await this.selectRandomByLabel('Nationality');
    await this.selectRandomByLabel('Marital Status');
    await this.selectRandomByLabel('Blood Type');
    await this.fieldContainer('Gender').getByText(data.gender, { exact: true }).click();
    await this.inputByLabel('Test_Field').fill(data.testField);
  }

  async searchEmployee(employeeId: string) {
    await this.inputByLabel('Employee Id').fill(employeeId);
    await this.page.getByRole('button', { name: 'Search' }).click();
  }

  employeeRow(employeeId: string) {
    return this.page.locator('div.oxd-table-card').filter({ hasText: employeeId }).first();
  }

  async deleteEmployee(employeeId: string) {
    const row = this.employeeRow(employeeId);
    await expect(row).toBeVisible({ timeout: 20000 });
    await row.locator('.bi-trash').click();
    await this.page.getByRole('button', { name: 'Yes, Delete' }).click();
  }

  async employeeExists(employeeId: string) {
    return this.employeeRow(employeeId).count() > 0;
  }

  private fieldContainer(label: string) {
    return this.page.locator('.oxd-input-group').filter({ hasText: label }).first();
  }

  private inputByLabel(label: string) {
    return this.fieldContainer(label).locator('input').first();
  }
}