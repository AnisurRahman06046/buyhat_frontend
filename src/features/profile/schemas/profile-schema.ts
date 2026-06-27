import { z } from "zod";

export const profileSchema = z.object({
  firstName: z.string().max(100).optional().or(z.literal("")),
  lastName: z.string().max(100).optional().or(z.literal("")),
  displayName: z.string().max(100).optional().or(z.literal("")),
  phone: z.string().max(20).optional().or(z.literal("")),
  marketingOptIn: z.boolean(),
});

export type ProfileValues = z.infer<typeof profileSchema>;
