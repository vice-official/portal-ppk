import { fakerRU as faker } from '@faker-js/faker';
import type {
  Citizen,
  CitizenStatus,
  EducationRecord,
  FamilyMember,
} from '../entities/citizen/types';

faker.seed(67);

const STATUSES: CitizenStatus[] = ['active', 'beneficiary', 'pensioner', 'underReview', 'archived'];
const KINSHIPS: FamilyMember['degreeOfKinship'][] = [
  'супруг(а)',
  'ребенок',
  'родитель',
  'иждивенец',
];
const DEGREES = ['Высшее (бакалавриат)', 'Высшее (магистратура)', 'Среднее профессиональное'];
const UNIVERSITIES = [
  'НИУ ВШЭ',
  'МГУ им. М.В. Ломоносова',
  'МГТУ им. Н.Э. Баумана',
  'СПбГУ',
  'РАНХиГС',
];
const SPECIALIZATIONS = [
  'Прикладная информатика',
  'Юриспруденция',
  'Экономика',
  'Менеджмент',
  'Строительство',
];

function generateFamilyMembers(count: number): FamilyMember[] {
  return Array.from({ length: count }, () => {
    const kinSex = faker.person.sexType();
    return {
      id: faker.string.uuid(),
      fullName: `${faker.person.lastName(kinSex)} ${faker.person.firstName(kinSex)} ${faker.person.middleName(kinSex)}`,
      degreeOfKinship: faker.helpers.arrayElement(KINSHIPS),
      dateOfBirth: faker.date
        .birthdate({ min: 3, max: 70, mode: 'age' })
        .toISOString()
        .split('T')[0],
      isLivingTogether: faker.datatype.boolean(),
    };
  });
}

function generateEducationRecords(count: number): EducationRecord[] {
  return Array.from({ length: count }, () => ({
    id: faker.string.uuid(),
    institution: faker.helpers.arrayElement(UNIVERSITIES),
    degree: faker.helpers.arrayElement(DEGREES),
    specialization: faker.helpers.arrayElement(SPECIALIZATIONS),
    endOfStudy: String(faker.number.int({ min: 1995, max: 2024 })),
  }));
}

export function generateSingleCitizen(): Citizen {
  const sex = faker.person.sexType();
  const regCity = faker.location.city();
  const regAddress = `${regCity}, ${faker.location.streetAddress()}`;
  const isSameAddress = faker.datatype.boolean(0.7);

  return {
    id: faker.string.uuid(),
    sex,
    name: faker.person.firstName(sex),
    surname: faker.person.lastName(sex),
    patronymic: faker.person.middleName(sex),
    dateOfBirth: faker.date
      .birthdate({ min: 18, max: 85, mode: 'age' })
      .toISOString()
      .split('T')[0],
    region: regCity,
    status: faker.helpers.arrayElement(STATUSES),

    snils: `${faker.string.numeric(3)}-${faker.string.numeric(3)}-${faker.string.numeric(3)} ${faker.string.numeric(2)}`,
    inn: faker.string.numeric(12),
    passportSeries: faker.string.numeric(4),
    passportNumber: faker.string.numeric(6),
    whoIssuedPassport: `Отдел МВД России по г. ${regCity}`,
    dateOfIssued: faker.date.past({ years: 10 }).toISOString().split('T')[0],

    phoneNumber: `+7 (9${faker.string.numeric(2)}) ${faker.string.numeric(3)}-${faker.string.numeric(2)}-${faker.string.numeric(2)}`,
    email: faker.internet.email(),
    registrationAddress: regAddress,
    residentialAddress: isSameAddress
      ? regAddress
      : `${faker.location.city()}, ${faker.location.streetAddress()}`,

    family: generateFamilyMembers(faker.number.int({ min: 1, max: 3 })),
    education: generateEducationRecords(faker.number.int({ min: 1, max: 2 })),
    createdAt: faker.date.past({ years: 1 }).toISOString(),
  };
}

export function generateMockCitizens(count: number = 70): Citizen[] {
  return Array.from({ length: count }, () => generateSingleCitizen());
}
