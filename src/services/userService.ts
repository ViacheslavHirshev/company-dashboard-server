import prisma from "../config/prisma";
import { TUserRole } from "../types/types";
import { encryptPassword } from "../utils/password";

async function getRoleId(roleName: TUserRole) {
  const { roleId } = await prisma.app_user_role.findUnique({
    where: { role_name: roleName },
  });

  return roleId;
}

export async function createUser(
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  role: TUserRole = "user"
) {
  const encryptedPassword = await encryptPassword(password);

  const user = await prisma.app_user.create({
    data: {
      firstname: firstName,
      lastname: lastName,
      email,
      password: encryptedPassword,
      role,
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
  lastName: string
) {
  const updatedUser = await prisma.app_user.update({
    where: { id: userId },
    data: { firstname: firstName, lastname: lastName },
  });

  return updatedUser;
}

export async function updateUserAvatar(userId: number, avatarPath: string) {
  const updatedUser = await prisma.app_user.update({
    where: { id: userId },
    data: { avatar: avatarPath },
  });

  return updatedUser;
}

export async function updateUserPassword(userId: number, newPassword: string) {
  const encryptedPassword = await encryptPassword(newPassword);

  const updatedUser = await prisma.app_user.update({
    where: { id: userId },
    data: { password: encryptedPassword },
  });

  return updatedUser;
}

export async function deleteUser(userId: number) {
  await prisma.app_user.delete({ where: { id: userId } });
}
