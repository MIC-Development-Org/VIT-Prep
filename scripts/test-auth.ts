import {
  isVitInstitutionalEmail,
  determineUserRole,
  extractRegNoFromEmail,
} from '../src/auth';

console.log('--- Running VIT Authentication Tests ---');

// Test 1: Institutional Email Validation
const allowedCases = [
  'aarav.sharma2022@vitstudent.ac.in',
  'prof.krishnan@vit.ac.in',
  'STUDENT.TEST@VITSTUDENT.AC.IN',
  'admin@vit.ac.in',
];

const blockedCases = [
  'student@gmail.com',
  'user@yahoo.com',
  'attacker@vitstudent.ac.in.fake.com',
  'spoofed@gmail.com',
  'vitstudent.ac.in@otherdomain.com',
  '',
];

let failed = false;

for (const email of allowedCases) {
  const result = isVitInstitutionalEmail(email);
  if (!result) {
    console.error(`FAIL: Expected ${email} to be ALLOWED, but got rejected.`);
    failed = true;
  } else {
    console.log(`PASS: [Allowed] ${email}`);
  }
}

for (const email of blockedCases) {
  const result = isVitInstitutionalEmail(email);
  if (result) {
    console.error(`FAIL: Expected ${email} to be BLOCKED, but was allowed!`);
    failed = true;
  } else {
    console.log(`PASS: [Blocked] ${email}`);
  }
}

// Test 2: Role Determination
console.log('\n--- Role Determination Tests ---');
const adminEmail = 'admin@vit.ac.in';
const modEmail = 'moderator@vitstudent.ac.in';
const studentEmail = 'student.2023@vitstudent.ac.in';

if (determineUserRole(adminEmail) !== 'admin') {
  console.error(`FAIL: Expected ${adminEmail} to be 'admin', got ${determineUserRole(adminEmail)}`);
  failed = true;
} else {
  console.log(`PASS: ${adminEmail} -> 'admin'`);
}

if (determineUserRole(modEmail) !== 'moderator') {
  console.error(`FAIL: Expected ${modEmail} to be 'moderator', got ${determineUserRole(modEmail)}`);
  failed = true;
} else {
  console.log(`PASS: ${modEmail} -> 'moderator'`);
}

if (determineUserRole(studentEmail) !== 'student') {
  console.error(`FAIL: Expected ${studentEmail} to be 'student', got ${determineUserRole(studentEmail)}`);
  failed = true;
} else {
  console.log(`PASS: ${studentEmail} -> 'student'`);
}

// Test 3: RegNo extraction
console.log('\n--- Registration Number Extraction Tests ---');
const regNoTest1 = extractRegNoFromEmail('rohan.22bce1042@vitstudent.ac.in');
if (regNoTest1 !== '22BCE1042') {
  console.error(`FAIL: Expected 22BCE1042, got ${regNoTest1}`);
  failed = true;
} else {
  console.log(`PASS: rohan.22bce1042@vitstudent.ac.in -> ${regNoTest1}`);
}

if (failed) {
  console.error('\nTests failed!');
  process.exit(1);
} else {
  console.log('\nAll Auth Verification tests PASSED successfully!');
}

