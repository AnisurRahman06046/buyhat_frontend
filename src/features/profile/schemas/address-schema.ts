import { z } from "zod";

export const addressSchema = z.object({
  label: z.string().max(50).optional().or(z.literal("")),
  recipientName: z.string().min(1, "Recipient name is required").max(100),
  phone: z.string().min(6, "Enter a valid phone number").max(20),
  line1: z.string().min(1, "Address is required").max(200),
  line2: z.string().max(200).optional().or(z.literal("")),
  city: z.string().min(1, "City is required").max(100),
  state: z.string().min(1, "State / division is required").max(100),
  postalCode: z.string().min(1, "Postal code is required").max(20),
  country: z.string().min(2, "Country is required").max(2),
});

export type AddressValues = z.infer<typeof addressSchema>;
