export interface EmployeeTestData {
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
}

const maleNames = ['David', 'Robert', 'Michael', 'James', 'Daniel', 'Christopher', 'William', 'Joseph', 'Thomas', 'Ryan'];
const femaleNames = ['Emily', 'Sarah', 'Jessica', 'Laura', 'Emma', 'Olivia', 'Sophia', 'Ava', 'Mia', 'Charlotte'];
const lastNames = ['Wilson', 'Brown', 'Taylor', 'Anderson', 'Thomas', 'Moore', 'Jackson', 'Martin', 'Lee', 'Walker'];
const middleNames = ['Andrew', 'Edward', 'Noah', 'Grace', 'Marie', 'Claire', 'Henry', 'Anne', 'Samuel', 'Elena'];
const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];
const nationalities = ['American', 'British', 'Canadian', 'Indian', 'Australian', 'German', 'French', 'Spanish', 'Italian', 'Japanese'];
const maritalStatuses = ['Single', 'Married', 'Divorced'];

function randomFrom<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

function randomAlphaNumeric(length: number): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

function formatDate(date: Date): string {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}

function addDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

export function generateEmployeeData(): EmployeeTestData {
  const gender = randomFrom(['Male', 'Female']);
  const firstName = gender === 'Male' ? randomFrom(maleNames) : randomFrom(femaleNames);
  const middleName = randomFrom(middleNames);
  const lastName = randomFrom(lastNames);
  const employeeId = String(Math.floor(1000 + Math.random() * 9000));
  const otherId = randomAlphaNumeric(8);
  const driverLicenseNumber = `DL${randomAlphaNumeric(7)}`;
  const licenseExpiryDate = formatDate(addDays(new Date(), 365 + Math.floor(Math.random() * 2000)));
  const nationality = randomFrom(nationalities);
  const maritalStatus = randomFrom(maritalStatuses);
  const dateOfBirth = formatDate(addDays(new Date(), -Math.floor(18 + Math.random() * 3000)));
  const bloodType = randomFrom(bloodTypes);
  const testField = randomAlphaNumeric(10);

  return {
    firstName,
    middleName,
    lastName,
    employeeId,
    gender,
    otherId,
    driverLicenseNumber,
    licenseExpiryDate,
    nationality,
    maritalStatus,
    dateOfBirth,
    bloodType,
    testField,
  };
}