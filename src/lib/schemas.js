import { z } from "zod";

// ── Auth ──────────────────────────────────────────────────────────────────────

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const signupSchema = z.object({
  userName: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(30)
    .regex(/^[a-zA-Z0-9_]+$/, "Only letters, numbers, and underscores"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  headLine: z.string().min(1, "Headline is required").max(160),
  about: z.string().min(1, "About is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

// ── User ──────────────────────────────────────────────────────────────────────

export const updateProfileSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  headLine: z.string().min(1, "Headline is required").max(160),
  about: z.string().max(1000).optional(),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(8, "New password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// ── Collections ───────────────────────────────────────────────────────────────

export const createCollectionSchema = z.object({
  name: z.string().min(1, "Collection name is required").max(100),
  description: z.string().max(500).optional(),
  isPublic: z.boolean().optional(),
});

// ── Posts ─────────────────────────────────────────────────────────────────────

export const commentSchema = z.object({
  content: z.string().min(1, "Comment cannot be empty").max(2000),
});

export const repostSchema = z.object({
  commentary: z.string().max(280, "Commentary must be 280 characters or fewer").optional(),
});
