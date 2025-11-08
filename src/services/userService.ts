import prisma from "../config/prisma";
import { TUserRole } from "../types/types";
import { comparePassword, encryptPassword } from "../utils/password";
// import { Prisma } from "@prisma/client";

export async function getRoleId(roleName: TUserRole) {
  const user_role = await prisma.app_user_role.findUnique({
    where: { role_name: roleName },
  });

  return user_role?.id;
}

export async function getRoleById(roleId: number) {
  const user_role = await prisma.app_user_role.findUnique({
    where: { id: roleId },
  });

  return user_role?.role_name;
}

export async function createUser(
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  role: TUserRole = "user"
) {
  const roleId = await getRoleId(role);
  const encryptedPassword = await encryptPassword(password);

  const user = await prisma.app_user.create({
    data: {
      firstname: firstName,
      lastname: lastName,
      email,
      password: encryptedPassword,
      role_id: roleId!,
    },
  });

  return user;
}

export async function getUser(userId: number) {
  const user = await prisma.app_user.findUnique({ where: { id: userId } });

  return user;
}

export async function getAllUsers() {
  const users = await prisma.app_user.findMany();

  return users;
}

export async function getAllUsersByRole(userRole: TUserRole = "user") {
  const roleId = await getRoleId(userRole);

  const users = await prisma.app_user.findMany({
    where: { role_id: roleId },
  });

  return users;
}

export async function updateUser(
  userId: number,
  firstName: string,
  lastName: string,
  avatarPath?: string | null
) {
  const data: {
    firstname: string;
    lastname: string;
    avatar?: string | null;
  } = {
    firstname: firstName,
    lastname: lastName,
  };

  if (avatarPath !== undefined) {
    data.avatar = avatarPath;
  }

  const updatedUser = await prisma.app_user.update({
    where: { id: userId },
    data,
  });

  return updatedUser;
}

async function getUserPassword(userId: number) {
  const user = await prisma.app_user.findUnique({
    where: { id: userId },
  });

  return user?.password;
}

export async function updateUserPassword(
  userId: number,
  currentPassword: string,
  newPassword: string
) {
  //current password check
  const currentHashed = await getUserPassword(userId);
  const isPasswordSame = await comparePassword(currentPassword, currentHashed!);

  if (!isPasswordSame)
    throw { status: 401, message: "Current password incorrect" };

  const newEncrypted = await encryptPassword(newPassword);

  const updatedUser = await prisma.app_user.update({
    where: { id: userId },
    data: { password: newEncrypted },
  });

  return updatedUser;
}

export async function deleteUser(userId: number) {
  await prisma.app_user.delete({ where: { id: userId } });
}
