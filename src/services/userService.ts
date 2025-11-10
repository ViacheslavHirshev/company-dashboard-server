import path from "path";
import fs from "fs";
import prisma from "../config/prisma";
import { TUserRole } from "../types/types";
import { comparePassword, encryptPassword } from "../utils/password";
// import { Prisma } from "@prisma/client";

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

export async function getRoleId(roleName: TUserRole) {
  const user_role = await prisma.app_user_role.findUnique({
    where: { role_name: roleName },
  });

  return user_role?.id;
}

export async function getRoleName(roleId: number) {
  const user_role = await prisma.app_user_role.findUnique({
    where: { id: roleId },
  });

  return user_role?.role_name;
}

export async function getUser(userId: number) {
  const user = await prisma.app_user.findUnique({ where: { id: userId } });

  return user;
}

export async function getAllUsersPaginated(
  userRole: TUserRole = "user",
  itemsToGet: number,
  skip: number,
  sortBy?: "firstname" | "lastname",
  sortOrder: "asc" | "desc" = "asc"
) {
  const orderBy = sortBy ? { [sortBy]: sortOrder } : undefined;
  const roleId = await getRoleId(userRole);

  const users = await prisma.app_user.findMany({
    where: { role_id: roleId },
    skip,
    take: itemsToGet,
    orderBy,
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
    data: {
      firstname: firstName,
      lastname: lastName,
    },
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

export async function updateUserAvatar(userId: number, avatar?: string | null) {
  if (avatar !== undefined) {
    await deleteAvatarFile(userId);

    const updatedUser = await prisma.app_user.update({
      where: { id: userId },
      data: {
        avatar,
      },
    });

    return updatedUser.avatar;
  }
}

export async function deleteAvatarFile(userId: number) {
  const user = await getUser(userId);

  if (user?.avatar) {
    const avatarPath = path.join("uploads/avatars", path.basename(user.avatar));

    if (fs.existsSync(avatarPath)) {
      fs.unlinkSync(avatarPath);
    }
  }
}

export async function deleteUser(userId: number) {
  await deleteAvatarFile(userId);
  await prisma.app_user.delete({ where: { id: userId } });
}
