import prisma from "../config/prisma";

// Update company info

export async function createCompany(
  userId: number,
  companyName: string,
  createdAt: Date,
  capital: number,
  logoPath: string | null = null
) {
  await prisma.company.create({
    data: {
      company_name: companyName,
      created_at: createdAt,
      capital: capital,
      logo: logoPath,
      owner_id: userId,
    },
  });
}

export async function getCompany(companyId: number) {
  const company = await prisma.company.findUnique({
    where: {
      id: companyId,
    },
  });

  return company;
}

export async function getAllCompanies(userId: number, skip: number) {
  const companies = await prisma.company.findMany({
    skip,
    take: 5,
    where: { id: userId },
  });

  return companies;
}

export async function deleteCompany(companyId: number) {
  await prisma.company.delete({ where: { id: companyId } });
}

export async function updateCompany(companyId: number) {}
