import z from "zod";

export const signUpSchema = z.object({
  name: z.string().min(3, "Name Should be minimum of 3 character long"),
  username: z.string().min(3, "Username Should be minimum of 3 character long"),
  email: z.string().email(),
  password: z
    .string()
    .min(6, "Passsword should be at least of 6 character long"),
});

export const profileSchema = z.object({
  name: z.string().min(3, "Name should be a minimum of 3 characters long"),
  photo: z.string().url("Image should be a valid URL").nullable().optional(),
  headerPhoto: z
    .string()
    .url("Header image should be a valid URL")
    .nullable()
    .optional(),
  bio: z
    .string()
    .min(3, "Bio should be a minimum of 3 characters long")
    .max(100, "Bio should be no more than 100 characters"),
});
