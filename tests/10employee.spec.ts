import { test, expect } from '@playwright/test';
import * as fs from 'fs';

type EmployeeTestData = {
  firstName: string;
  middleName: string;
  lastName: string;
  employeeId: string;
  gender: string;
  otherId: string;
  driverLicenseNumber: string;
  licenseExpiryDate: string;
  nationality: string;
  maritalStatus: string;
  dateOfBirth: string;
  bloodType: string;
  testField: string;
};

const maleNames = ['David', 'Robert', 'Michael', 'James', 'Daniel', 'Thomas', 'William', 'Joseph', 'Christopher', 'Ryan'];
const femaleNames = ['Emily', 'Sarah', 'Jessica', 'Laura', 'Emma', 'Olivia', 'Sophia', 'Ava', 'Mia', 'Charlotte'];
const middleNames = ['Andrew', 'Edward', 'Noah', 'Marie', 'Grace', 'Claire', 'Henry', 'Anne', 'Samuel', 'Elena'];
const lastNames = ['Wilson', 'Brown', 'Taylor', 'Anderson', 'Thomas', 'Moore', 'Jackson', 'Martin', 'Lee', 'Walker'];
const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];
const nationalities = ['American', 'British', 'Canadian', 'Indian', 'Australian', 'German', 'French', 'Spanish', 'Italian', 'Japanese'];
const maritalStatuses = ['Single', 'Married', 'Divorced'];

function randomFrom<T>(values: T[]): T {
  return values[Math.floor(Math.random() * values.length)];
}

function randomAlphaNumeric(length: number): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) result += chars[Math.floor(Math.random() * chars.length)];
  return result;
}

function toYMD(date: Date): string {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

function futureDate(daysAhead = 3650): string {
  const d = new Date();
  d.setDate(d.getDate() + daysAhead + Math.floor(Math.random() * 365));
  return toYMD(d);
}

function pastDate(minAge = 18, maxAge = 45): string {
  const d = new Date();
  d.setFullYear(d.getFullYear() - (minAge + Math.floor(Math.random() * (maxAge - minAge + 1))));
  return toYMD(d);
}

function generateEmployeeData(): EmployeeTestData {
  const gender = randomFrom(['Male', 'Female']);
  const firstName = gender === 'Male' ? randomFrom(maleNames) : randomFrom(femaleNames);
  return {
    firstName,
    middleName: randomFrom(middleNames),
    lastName: randomFrom(lastNames),
    employeeId: String(Math.floor(1000 + Math.random() * 9000)),
    gender,
    otherId: randomAlphaNumeric(8),
    driverLicenseNumber: `DL${randomAlphaNumeric(7)}`,
    licenseExpiryDate: futureDate(),
    nationality: randomFrom(nationalities),
    maritalStatus: randomFrom(maritalStatuses),
    dateOfBirth: pastDate(),
    bloodType: randomFrom(bloodTypes),
    testField: randomAlphaNumeric(10),
  };
}

async function waitForToast(page: any, regex: RegExp) {
  const toast = page.locator('.oxd-toast-content');
  const message = await toast.first().innerText({ timeout: 30000 });
  console.log(`[TOAST] ${message}`);
  expect(message).toMatch(regex);
}

function printStep(message: string) {
  console.log(`[STEP] ${message}`);
}

function fieldContainer(page: any, label: string) {
  return page.locator('.oxd-input-group').filter({ hasText: label }).first();
}

function inputByLabel(page: any, label: string) {
  return fieldContainer(page, label).locator('input').first();
}

async function selectRandomByLabel(page: any, label: string) {
  printStep(`Opening ${label} dropdown`);
  const dropdown = fieldContainer(page, label).locator('.oxd-select-text');
  await dropdown.waitFor({ state: 'visible', timeout: 30000 });
  await dropdown.click();

  const options = page.locator('.oxd-select-option:visible');
  const values = (await options.allInnerTexts())
    .map((value: string) => value.trim())
    .filter((value: string) => value && !value.startsWith('--'));
  if (!values.length) throw new Error(`No valid options found for ${label}`);

  const selected = randomFrom(values);
  await options.filter({ hasText: selected }).first().click();
  printStep(`${label} selected: ${selected}`);
  return selected;
}

async function fillPersonalDetails(page: any, data: EmployeeTestData) {
  printStep('Filling personal details');
  await inputByLabel(page, 'Other Id').fill(data.otherId);
  await inputByLabel(page, "Driver's License Number").fill(data.driverLicenseNumber);
  await inputByLabel(page, 'License Expiry Date').fill(data.licenseExpiryDate);
  await inputByLabel(page, 'Date of Birth').fill(data.dateOfBirth);
  await selectRandomByLabel(page, 'Nationality');
  await selectRandomByLabel(page, 'Marital Status');
  await selectRandomByLabel(page, 'Blood Type');
  await fieldContainer(page, 'Gender').getByText(data.gender, { exact: true }).click();
  await inputByLabel(page, 'Test_Field').fill(data.testField);
  printStep('Personal details filled');
}

async function searchEmployee(page: any, employeeId: string) {
  printStep(`Searching employee ID: ${employeeId}`);
  await inputByLabel(page, 'Employee Id').fill(employeeId);
  await page.getByRole('button', { name: 'Search' }).click();
}

function employeeRow(page: any, employeeId: string) {
  return page.locator('div.oxd-table-card').filter({ hasText: employeeId }).first();
}

test.setTimeout(180000);

test('PIM employee creation flow in OrangeHRM', async ({ page }) => {
  const employeeData = generateEmployeeData();
  const employeeUsername = `${employeeData.firstName}${employeeData.lastName}${randomAlphaNumeric(6)}`;
  const employeePassword = `Auto${randomAlphaNumeric(10)}9!`;

  printStep(`Generated employee: ${employeeData.firstName} ${employeeData.middleName} ${employeeData.lastName}`);
  printStep(`Generated employee ID: ${employeeData.employeeId}`);
  printStep(`Generated username: ${employeeUsername}`);
  printStep(`Generated password: ${employeePassword}`);

  const payload = {
    login: { username: 'Admin', password: 'admin123' },
    employee: {
      first_name: employeeData.firstName,
      middle_name: employeeData.middleName,
      last_name: employeeData.lastName,
      employee_id: employeeData.employeeId,
      gender: employeeData.gender,
      other_id: employeeData.otherId,
      driver_license_number: employeeData.driverLicenseNumber,
      license_expiry_date: employeeData.licenseExpiryDate,
      nationality: employeeData.nationality,
      marital_status: employeeData.maritalStatus,
      date_of_birth: employeeData.dateOfBirth,
      blood_type: employeeData.bloodType,
      test_field: employeeData.testField,
    },
    employee_login: {
      create_login_details: true,
      username: employeeUsername,
      status: 'Enabled',
      password: employeePassword,
      confirm_password: employeePassword,
    },
    photo: { path: 'test_data/employee_photo.png' },
  };

  fs.mkdirSync('test_data', { recursive: true });
  fs.writeFileSync('test_data/user_data1.json', JSON.stringify(payload, null, 2));
  printStep('Test data saved to test_data/user_data1.json');

  printStep('Opening OrangeHRM login page');
  await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
  printStep('Logging in as Admin');
  await page.getByPlaceholder('Username').fill('Admin');
  await page.getByPlaceholder('Password').fill('admin123');
  await page.getByRole('button', { name: 'Login' }).click();
  await expect(page).toHaveURL(/dashboard/);
  printStep('Login successful');

  printStep('Opening PIM employee list');
  await page.locator('span.oxd-main-menu-item--name').filter({ hasText: 'PIM' }).click();
  await page.getByRole('link', { name: 'Employee List' }).click();
  await page.waitForURL(/\/pim\/viewEmployeeList/);
  await page.getByRole('button', { name: 'Add' }).click();
  printStep('Add Employee page opened');

  printStep('Filling employee basic details');
  await page.getByPlaceholder('First Name').fill(employeeData.firstName);
  await page.getByPlaceholder('Middle Name').fill(employeeData.middleName);
  await page.getByPlaceholder('Last Name').fill(employeeData.lastName);
  await inputByLabel(page, 'Employee Id').fill(employeeData.employeeId);
  await page.locator('input[type="file"]').setInputFiles('test_data/employee_photo.png');
  printStep('Employee photo uploaded');
  await page.locator('.oxd-switch-wrapper span').click();
  printStep('Create Login Details enabled');
  await inputByLabel(page, 'Username').fill(employeeUsername);
  await inputByLabel(page, 'Password').fill(employeePassword);
  await inputByLabel(page, 'Confirm Password').fill(employeePassword);
  printStep('Username, password, and confirmation password filled');

  printStep('Saving new employee');
  await page.getByRole('button', { name: 'Save' }).last().click();
  await waitForToast(page, /Successfully Saved|Success/i);
  await page.waitForURL(/\/pim\/viewPersonalDetails\//, { timeout: 30000 });

  await expect(page.locator('body')).toContainText(employeeData.firstName);
  await inputByLabel(page, 'Other Id').waitFor({ state: 'visible', timeout: 30000 });
  printStep('Personal Details page opened');
  await fillPersonalDetails(page, employeeData);

  printStep('Saving personal details');
  await page.getByRole('button', { name: 'Save' }).last().click();
  await waitForToast(page, /Successfully Saved|Success/i);

  await page.locator('span.oxd-main-menu-item--name').filter({ hasText: 'PIM' }).click();
  await page.getByRole('link', { name: 'Employee List' }).click();
  printStep('Returned to employee list');

  await searchEmployee(page, employeeData.employeeId);
  await expect(employeeRow(page, employeeData.employeeId)).toContainText(employeeData.employeeId, { timeout: 20000 });
  printStep('Employee found in search results');
  await employeeRow(page, employeeData.employeeId).locator('.bi-trash').click();
  await page.getByRole('button', { name: 'Yes, Delete' }).click();
  printStep('Employee deletion confirmed');
  await waitForToast(page, /Successfully Deleted|Deleted/i);

  await page.getByRole('link', { name: 'Employee List' }).click();
  await searchEmployee(page, employeeData.employeeId);
  await expect(employeeRow(page, employeeData.employeeId)).toHaveCount(0, { timeout: 20000 });
  printStep('Employee deletion verified');
});