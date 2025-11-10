export type TUserRole = "user" | "admin" | "superadmin";

export type TTokenPayload = { userId: number; roleId: number };
