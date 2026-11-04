export type CitizenStatus = 'active' | 'beneficiary' | 'pensioner' | 'underReview' | 'archived';

export interface EducationRecord {
  id: string;
  institution: string;
  degree: string;
  specialization: string;
  endOfStudy: string;
}

export interface FamilyMember {
  id: string;
  fullName: string;
  degreeOfKinship: 'супруг(а)' | 'ребенок' | 'родитель' | 'иждивенец';
  dateOfBirth: string;
  isLivingTogether: boolean;
}

export interface Citizen {
  id: string;
  name: string;
  surname: string;
  patronymic: string;
  dateOfBirth: string;
  region: string;
  status: CitizenStatus;
  sex: 'male' | 'female' | 'generic';
  snils: string;
  inn: string;
  email: string;
  phoneNumber: string;

  passportSeries: string;
  passportNumber: string;
  whoIssuedPassport: string;
  dateOfIssued: string;

  registrationAddress: string;
  residentialAddress: string;

  family: FamilyMember[];
  education: EducationRecord[];
  createdAt: string;
}

export interface GetCitizenParams {
  page: number;
  pageSize: number;
  search?: string;
  status?: CitizenStatus | 'all';
  gender?: 'male' | 'female' | 'all';
  sortBy?: 'name' | 'surname' | 'dateOfBirth' | 'createdAt';
  sortOrder?: 'ascending' | 'descending';
}

export interface PaginatedResponse<T> {
  items: T[];
  totalCount: number;
  filteredCount: number;
  page: number;
  pageSize: number;
}
