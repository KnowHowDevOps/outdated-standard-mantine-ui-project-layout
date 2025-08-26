import { z } from "zod";

export const UserRole = z.enum(["admin", "user", "moderator"]);

export const UserStatus = z.enum(["active", "inactive", "suspended"]);

export const UserSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, "Name is required").max(100),
  email: z.string().email("Invalid email address"),
  role: UserRole,
  status: UserStatus,
  avatar: z.string().url().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const CreateUserSchema = UserSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const UpdateUserSchema = UserSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).partial();

export const UserListSchema = z.object({
  users: z.array(UserSchema),
  total: z.number(),
  page: z.number(),
  limit: z.number(),
});

export const UserSearchParamsSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  search: z.string().optional(),
  role: UserRole.optional(),
  status: UserStatus.optional(),
});

// Type exports
export type User = z.infer<typeof UserSchema>;
export type CreateUser = z.infer<typeof CreateUserSchema>;
export type UpdateUser = z.infer<typeof UpdateUserSchema>;
export type UserList = z.infer<typeof UserListSchema>;
export type UserSearchParams = z.infer<typeof UserSearchParamsSchema>;
export type UserRoleType = z.infer<typeof UserRole>;
export type UserStatusType = z.infer<typeof UserStatus>;
