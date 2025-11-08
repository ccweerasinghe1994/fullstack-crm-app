/**
 * Customer creation input model
 */
export interface CreateCustomerInput {
  /** Customer's first name */
  firstName: string;

  /** Customer's last name */
  lastName: string;

  /** Customer's email address */
  email: string;

  /** Customer's phone number (optional) */
  phoneNumber?: string | null;

  /** Customer's street address (optional) */
  address?: string | null;

  /** Customer's city (optional) */
  city?: string | null;

  /** Customer's state/province (optional) */
  state?: string | null;

  /** Customer's country (optional) */
  country?: string | null;
}

/**
 * Customer update input model
 */
export interface UpdateCustomerInput {
  /** Customer's first name */
  firstName?: string;

  /** Customer's last name */
  lastName?: string;

  /** Customer's email address */
  email?: string;

  /** Customer's phone number */
  phoneNumber?: string | null;

  /** Customer's street address */
  address?: string | null;

  /** Customer's city */
  city?: string | null;

  /** Customer's state/province */
  state?: string | null;

  /** Customer's country */
  country?: string | null;
}

/**
 * Complete customer model
 */
export interface CustomerModel {
  /** Unique identifier */
  id: string;

  /** Customer's first name */
  firstName: string;

  /** Customer's last name */
  lastName: string;

  /** Customer's email address */
  email: string;

  /** Customer's phone number */
  phoneNumber: string | null;

  /** Customer's street address */
  address: string | null;

  /** Customer's city */
  city: string | null;

  /** Customer's state/province */
  state: string | null;

  /** Customer's country */
  country: string | null;

  /** Creation timestamp */
  createdAt: Date;

  /** Last update timestamp */
  updatedAt: Date;
}
