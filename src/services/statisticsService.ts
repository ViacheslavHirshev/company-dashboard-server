import prisma from "../config/prisma";
import { getRoleId } from "./userService";

// STATISTIC FOR ADMIN + SUPERADMIN

export async function getTotalNumberOfUsers() {
  return await prisma.app_user.count();
}

export async function getTotalNumberOfCompanies() {
  return await prisma.company.count();
}

export async function getHeighestCapitalCompanies(itemsToGet: number) {
  const companies = await prisma.company.findMany({
    orderBy: { capital: "desc" },
    take: itemsToGet,
  });

  return companies;
}

export async function getTotalNumberOfAdmins() {
  const admin_role_id = getRoleId("admin");

  return await prisma.app_user.count({ where: { id: admin_role_id } });
}

// STATISTICS FOR PLAIN USER

export async function getNumberOfOwnCompanies(userId: number) {
  return await prisma.company.count({ where: { owner_id: userId } });
}

export async function getCompaniesByCapital(
  userId: number,
  order: "asc" | "desc"
) {
  return await prisma.company.findMany({
    where: { owner_id: userId },
    orderBy: { capital: order },
  });
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

export async function getUserBestCompany(userId: number) {
  return await prisma.company.findFirst({
    where: { owner_id: userId },
    orderBy: {
      capital: "desc",
    },
  });
}

// company with the lowest capital
export async function getUserWorstCompany(userId: number) {
  return await prisma.company.findFirst({
    where: { owner_id: userId },
    orderBy: {
      capital: "desc",
    },
  });
}
