export type TUserRole = "user" | "admin" | "superadmin";
export type TCompanyService =
  | "Consulting"
  | "Logistics"
  | "Finance"
  | "Manufacturing"
  | "Software Development";

export type TTokenPayload = { userId: number; roleId: number };

// export type TAuthRequest = Express.Request & {
//   user: {
//     userId: number;
//     roleId: number;
//   };
// };
