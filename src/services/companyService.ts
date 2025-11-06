import prisma from "../config/prisma";

// Pagination
// Sorting
// Filtering

export async function createCompany(
  userId: number,
  companyName: string,
  createdAt: Date,
  capital: number
) {
  const company = await prisma.company.create({
    data: {
      company_name: companyName,
      created_at: createdAt,
      capital: capital,
      owner_id: userId,
    },
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

export async function getAllCompanies(userId: number) {
  const companies = await prisma.company.findMany({
    where: { id: userId },
  });

  return companies;
}

export async function getAllCompaniesPaginated(
  userId: number,
  elementsToTake: number,
  skip: number
) {
  const companies = await prisma.company.findMany({
    skip,
    take: elementsToTake,
    where: { id: userId },
  });

  return companies;
}

export async function deleteCompany(companyId: number) {
  await prisma.company.delete({ where: { id: companyId } });
}

export async function updateCompany(
  companyId: number,
  companyName: string,
  createdAt: Date,
  capital: number,
  address: string
) {
  const updatedCompany = await prisma.company.update({
    where: { id: companyId },
    data: {
      company_name: companyName,
      created_at: createdAt,
      capital,
      address,
    },
  });

  return updatedCompany;
}

export async function updateCompanyLogo(companyId: number, logoPath: string) {
  const updatedCompany = await prisma.company.update({
    where: { id: companyId },
    data: { logo: logoPath },
  });

  return updatedCompany;
}
