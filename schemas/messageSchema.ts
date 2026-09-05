import { z } from "zod";

export const messageSchema = z.object({
  content: z
    .string()
    .min(10, "Message must be of 6 characters")
    .max(300, "Content must be no longer than 300 chracters"),
});
