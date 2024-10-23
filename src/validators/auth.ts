import z from "zod";

const CONFIRM_PASSWORD_FIELD = "confirmPassword";

export const registerSchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(6, "Password must be at least 6 characters long."),
    [CONFIRM_PASSWORD_FIELD]: z.string(),
    firstName: z.string().min(1, "First Name can't be empty."),
    lastName: z.string().min(1, "Last Name can't be empty."),
  })
  .refine((register) => register.password === register.confirmPassword, {
    message: "Passwords do not match.",
    path: [CONFIRM_PASSWORD_FIELD],
  });

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});
