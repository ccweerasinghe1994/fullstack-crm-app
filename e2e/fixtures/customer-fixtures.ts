import { faker } from "@faker-js/faker";

export interface TestCustomer {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
}

export function generateCustomer(
  overrides: Partial<TestCustomer> = {}
): TestCustomer {
  return {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    phone: faker.phone.number(),
    address: faker.location.streetAddress(),
    city: faker.location.city(),
    state: faker.location.state(),
    country: "USA",
    ...overrides,
  };
}

export function generateCustomers(count: number): TestCustomer[] {
  return Array.from({ length: count }, () => generateCustomer());
}
