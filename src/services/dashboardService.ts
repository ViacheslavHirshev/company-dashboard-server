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

export async function countAllUserCompanies(
  userId: number,
  minCapital?: number,
  maxCapital?: number,
  startDate?: Date,
  endDate?: Date
) {
  const where: any = {
    owner_id: userId,
  };

  if (minCapital !== undefined) {
    where.capital = { ...where.capital, gte: minCapital };
  }
  if (maxCapital !== undefined) {
    where.capital = { ...where.capital, lte: maxCapital };
  }
  if (startDate !== undefined) {
    where.created_at = { ...where.created_at, gte: startDate };
  }
  if (endDate !== undefined) {
    where.created_at = { ...where.created_at, lte: endDate };
  }

  return await prisma.company.count({ where: where });
}

// STATISTIC FOR ADMIN/SUPERADMIN
export async function countAllCompanies(
  minCapital?: number,
  maxCapital?: number,
  startDate?: Date,
  endDate?: Date
) {
  const where: any = {};

  if (minCapital !== undefined) {
    where.capital = { ...where.capital, gte: minCapital };
  }
  if (maxCapital !== undefined) {
    where.capital = { ...where.capital, lte: maxCapital };
  }
  if (startDate !== undefined) {
    where.created_at = { ...where.created_at, gte: startDate };
  }
  if (endDate !== undefined) {
    where.created_at = { ...where.created_at, lte: endDate };
  }

  return await prisma.company.count({ where: where });
}

export async function getTotalNumberOfUsers() {
  return await prisma.app_user.count();
}

export async function getTotalNumberOfCompanies() {
  return await prisma.company.count();
}

export async function getTotalNumberOfAdmins() {
  const role_id = await getRoleId("admin");

  return await prisma.app_user.count({ where: { role_id: role_id } });
}
