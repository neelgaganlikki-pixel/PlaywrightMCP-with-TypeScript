import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import { EmployeePage } from '../../pages/EmployeePage';

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
  await expect(toast.first()).toContainText(regex, { timeout: 30000 });
}

test.setTimeout(180000);

test('PIM employee creation flow in OrangeHRM', async ({ page }) => {
  const employeePage = new EmployeePage(page);
  const employeeData = generateEmployeeData();
  const employeeUsername = `${employeeData.firstName}${employeeData.lastName}${randomAlphaNumeric(6)}`;
  const employeePassword = `Auto${randomAlphaNumeric(10)}9!`;

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

  await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
  await page.getByPlaceholder('Username').fill('Admin');
  await page.getByPlaceholder('Password').fill('admin123');
  await page.getByRole('button', { name: 'Login' }).click();
  await expect(page).toHaveURL(/dashboard/);

  await page.locator('span.oxd-main-menu-item--name').filter({ hasText: 'PIM' }).click();
  await employeePage.openEmployeeList();
  await page.getByRole('button', { name: 'Add' }).click();

  await employeePage.fillEmployeeDetails(employeeData.firstName, employeeData.middleName, employeeData.lastName, employeeData.employeeId);
  await employeePage.uploadPhoto('test_data/employee_photo.png');
  await employeePage.enableCreateLoginDetails();
  await employeePage.fillLoginDetails(employeeUsername, employeePassword);

  await employeePage.saveEmployee();
  await waitForToast(page, /Successfully Saved|Success/i);
  await page.waitForURL(/\/pim\/viewPersonalDetails\//, { timeout: 30000 });

  await expect(page.locator('body')).toContainText(employeeData.firstName);
  await employeePage.waitForPersonalDetails();
  await employeePage.fillPersonalDetails(employeeData);

  await page.getByRole('button', { name: 'Save' }).last().click();
  await waitForToast(page, /Successfully Saved|Success/i);

  await page.locator('span.oxd-main-menu-item--name').filter({ hasText: 'PIM' }).click();
  await page.getByRole('link', { name: 'Employee List' }).click();

  await employeePage.searchEmployee(employeeData.employeeId);
  await expect(employeePage.employeeRow(employeeData.employeeId)).toContainText(employeeData.employeeId, { timeout: 20000 });
  await employeePage.deleteEmployee(employeeData.employeeId);
  await waitForToast(page, /Successfully Deleted|Deleted/i);

  await page.getByRole('link', { name: 'Employee List' }).click();
  await employeePage.searchEmployee(employeeData.employeeId);
  await expect(employeePage.employeeRow(employeeData.employeeId)).toHaveCount(0, { timeout: 20000 });
});