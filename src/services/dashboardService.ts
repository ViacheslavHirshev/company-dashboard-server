import prisma from "../config/prisma";
import { getRoleId } from "./userService";

// STATISTICS FOR USER
export async function getNumberOfUserCompanies(userId: number) {
  return await prisma.company.count({ where: { owner_id: userId } });
}

export async function getUserTotalCapital(userId: number) {
  return await prisma.company.aggregate({
    _sum: {
      capital: true,
    },
    where: {
      owner_id: userId,
    },
  });
}

// STATISTIC FOR ADMIN/SUPERADMIN
export async function getTotalNumberOfUsers() {
  return await prisma.app_user.count();
}

export async function getTotalNumberOfCompanies() {
  return await prisma.company.count();
}

export async function getTotalNumberOfAdmins() {
  const role_id = await getRoleId("admin");

  return await prisma.app_user.count({ where: { id: role_id } });
}
