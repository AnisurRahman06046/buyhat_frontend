import type { Role } from "@/constants/roles";

export interface UserProfile {
  id: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  displayName?: string | null;
  phone?: string | null;
  marketingOptIn?: boolean;
  roles?: Role[];
  status?: string;
  createdAt?: string;
}

export interface UpdateProfilePayload {
  firstName?: string;
  lastName?: string;
  displayName?: string;
  phone?: string;
  marketingOptIn?: boolean;
}

export interface Address {
  id: string;
  label?: string | null;
  recipientName: string;
  phone: string;
  line1: string;
  line2?: string | null;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefaultShipping?: boolean;
  isDefaultBilling?: boolean;
}

export interface AddressPayload {
  label?: string;
  recipientName: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefaultShipping?: boolean;
  isDefaultBilling?: boolean;
}

export interface SetDefaultAddressPayload {
  shipping?: boolean;
  billing?: boolean;
}

/** Admin user management. */
export interface UpdateUserStatusPayload {
  status: string;
}
export interface UpdateUserRolesPayload {
  roles: Role[];
}
