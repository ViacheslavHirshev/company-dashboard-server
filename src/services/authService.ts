import prisma from "../config/prisma";
import { encryptPassword } from "../utils/password";

export async function createUser(
  firstname: string,
  lastname: string,
  email: string,
  password: string
) {
  const encryptedPassword = await encryptPassword(password);

  await prisma.app_user.create({
    data: {
      firstname,
      lastname,
      email,
      password: encryptedPassword,
      role: "user",
    },
  });
}

export async function createAdmin(
  firstName: string,
  lastName: string,
  email: string,
  password: string
) {
  const encryptedPassword = await encryptPassword(password);

  const user = await prisma.app_user.create({
    data: {
      firstName,
      lastName,
      email,
      password: encryptedPassword,
      role: "admin",
    },
  });

  return { id: user.id, email: user.email, role: user.role };
}

// !---- CALL ONLY ONCE WHEN FRESH SERVER START ----!
export async function createSuperAdmin(
  firstName: string,
  lastName: string,
  email: string,
  password: string
) {
  const encryptedPassword = await encryptPassword(password);

  const user = await prisma.app_user.create({
    data: {
      firstName,
      lastName,
      email,
      password: encryptedPassword,
      role: "superadmin",
    },
  });

  return { id: user.id, email: user.email, role: user.role };
}
