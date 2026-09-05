import { z } from "zod";

export const usernameValidation = z
  .string()
  .min(2, "username must be at least 2 characters")
  .max(20, "username must no more than 20 characters")
  .regex(/^[a-zA-Z0-9_]+$/, "username must not contains special characters");

export const signUpSchema = z.object({
  username: usernameValidation,
  email: z.string().email({ message: "invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 chracters" }),
});
