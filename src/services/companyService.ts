import path from "path";
import prisma from "../config/prisma";
import fs from "fs";

export async function createCompany(
  userId: number,
  companyName: string,
  createdAt: Date,
  capital: number,
  service: string,
  address: string,
  logo?: string | null
) {
  const data: {
    company_name: string;
    created_at: Date;
    capital: number;
    service: string;
    owner_id: number;
    address: string;
    logo?: string | null;
  } = {
    company_name: companyName,
    created_at: createdAt,
    capital,
    service,
    address,
    owner_id: userId,
  };

  if (logo !== undefined) {
    data.logo = logo;
  }

  const company = await prisma.company.create({
    data,
  });

  return company;
}

export async function getCompany(companyId: number) {
  const company = await prisma.company.findUnique({
    where: {
      id: companyId,
    },
  });

  return company;
}

export async function getAllCompaniesPaginated(
  itemsToGet: number,
  skip: number,
  userId?: number,
  sortBy?: "company_name" | "service",
  sortOrder: "asc" | "desc" = "asc",
  minCapital?: number,
  maxCapital?: number,
  startDate?: Date,
  endDate?: Date
) {
  const where: any = {};

  if (userId) {
    where.owner_id = userId;
  }

  if (minCapital !== undefined || maxCapital !== undefined) {
    where.capital = {};
    if (minCapital) where.capital.gte = minCapital;
    if (maxCapital) where.capital.lte = maxCapital;
  }

  if (startDate !== undefined || endDate !== undefined) {
    where.created_at = {};
    if (startDate) where.created_at.gte = startDate;
    if (endDate) where.created_at.lte = endDate;
  }

  const orderBy = sortBy ? { [sortBy]: sortOrder } : undefined;

  const companies = await prisma.company.findMany({
    skip,
    take: itemsToGet,
    where,
    orderBy,
  });

  return companies;
}

export async function updateCompany(
  companyId: number,
  companyName: string,
  createdAt: Date,
  capital: number,
  service: string,
  address: string
) {
  const updatedCompany = await prisma.company.update({
    where: { id: companyId },
    data: {
      company_name: companyName,
      created_at: createdAt,
      capital,
      service,
      address,
    },
  });

  return updatedCompany;
}

export async function updateCompanyLogo(
  companyId: number,
  logo?: string | null
) {
  if (logo !== undefined) {
    await deleteLogoFile(companyId);

    const updatedCompany = await prisma.company.update({
      where: { id: companyId },
      data: {
        logo: logo,
      },
    });

    return updatedCompany.logo;
  }
}

export async function deleteCompany(companyId: number) {
  await deleteLogoFile(companyId);
  await prisma.company.delete({ where: { id: companyId } });
}

export async function deleteLogoFile(companyId: number) {
  const company = await getCompany(companyId);

  if (company?.logo) {
    const logoPath = path.join(
      "uploads/logotypes",
      path.basename(company.logo)
    );

    if (fs.existsSync(logoPath)) {
      fs.unlinkSync(logoPath);
    }
  }
}
