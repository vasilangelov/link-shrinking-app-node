import z from "zod";

export const userProfileSchema = z.object({
  email: z.string().email(),
  firstName: z.string().min(1, "First Name can't be empty."),
  lastName: z.string().min(1, "Last Name can't be empty."),
});
