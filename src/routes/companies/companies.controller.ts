import { Request, Response, NextFunction } from "express";
import { TTokenPayload } from "../../types/types";
import {
  createCompany,
  deleteCompany,
  deleteLogoFile,
  getAllCompaniesPaginated,
  getCompany,
  updateCompany,
  updateCompanyLogo,
} from "../../services/companyService";
import { getUser } from "../../services/userService";

export async function userGetCompanies(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { userId } = req.user as TTokenPayload;

  const page = req.query.page ? Number(req.query.page) : 1;
  const limit = req.query.limit ? Number(req.query.limit) : 10;
  const skip = (page - 1) * limit;

  const sortBy = req.query.sortBy as "company_name" | "service" | undefined;
  const sortOrder = req.query.sortOrder as "asc" | "desc" | undefined;
  const minCapital = req.query.minCapital
    ? Number(req.query.minCapital)
    : undefined;
  const maxCapital = req.query.maxCapital
    ? Number(req.query.maxCapital)
    : undefined;
  const startDate = req.query.startDate
    ? new Date(req.query.startDate as string)
    : undefined;
  const endDate = req.query.endDate
    ? new Date(req.query.endDate as string)
    : undefined;

  try {
    const companies = (
      await getAllCompaniesPaginated(
        limit,
        skip,
        userId,
        sortBy,
        sortOrder || "asc",
        minCapital,
        maxCapital,
        startDate,
        endDate
      )
    ).map((value) => {
      return {
        id: value.id,
        name: value.company_name,
        service: value.service,
        capital: value.capital,
      };
    });

    return res.status(200).json({ companies });
  } catch (error) {
    console.log(error);
    next(error);
  }
}

export async function userGetCompany(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const companyId = Number(req.params.id);

  const baseUrl = `${req.protocol}://${req.get("host")}`;

  try {
    const company = await getCompany(companyId);

    if (company) {
      let logoPath: string;

      if (company.logo) {
        logoPath = `${baseUrl}/uploads/logotypes/${company.logo}`;
      } else {
        logoPath = `${baseUrl}/uploads/fallback.png`;
      }

      return res.status(200).json({
        company: {
          id: company.id,
          name: company.company_name,
          createdAt: company.created_at,
          capital: company.capital,
          address: company.address,
          service: company.service,
          logoPath,
        },
      });
    } else {
      return res.status(404).json({ message: "Company not found" });
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
}

export async function userAddNewCompany(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { userId } = req.user as TTokenPayload;
  const {
    companyName,
    createdAt,
    capital,
    service,
    country,
    city,
    street,
    streetNumber,
  } = req.body;
  const logo = req.file;
  const address = `${country}, ${city}, ${street}, ${streetNumber}`;

  const baseUrl = `${req.protocol}://${req.get("host")}`;

  try {
    const newCompany = await createCompany(
      userId,
      companyName,
      new Date(createdAt),
      Number(capital),
      service,
      address,
      logo?.filename
    );

    let logoPath: string;

    if (newCompany.logo) {
      logoPath = `${baseUrl}/uploads/logotypes/${logo?.filename}`;
    } else {
      logoPath = `${baseUrl}/uploads/fallback.png`;
    }

    return res.status(200).json({
      message: "Company created",
      company: {
        name: newCompany.company_name,
        created: newCompany.created_at,
        capital: newCompany.capital,
        service: newCompany.service,
        address: newCompany.address,
        logo: logoPath,
      },
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
}

export async function userUpdateCompanyInfo(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const companyId = Number(req.params.id);
  const {
    companyName,
    createdAt,
    capital,
    service,
    country,
    city,
    street,
    streetNumber,
  } = req.body;
  const address = `${country}, ${city}, ${street}, ${streetNumber}`;

  try {
    const updCompany = await updateCompany(
      companyId,
      companyName,
      new Date(createdAt),
      capital,
      service,
      address
    );

    return res.status(200).json({
      message: "Company created",
      company: {
        id: updCompany.id,
        name: updCompany.company_name,
        createdAt: updCompany.created_at,
        capital: updCompany.capital,
        service: updCompany.service,
        address: updCompany.address,
      },
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
}

export async function userUpdateCompanyLogo(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const companyId = Number(req.params.id);
  const logo = req.file;
  const deleteLogo =
    req.body?.deleteLogo === "true" || req.body?.deleteLogo === true;

  const baseUrl = `${req.protocol}://${req.get("host")}`;

  try {
    if (deleteLogo) {
      await updateCompanyLogo(companyId, null);

      return res.status(200).json({
        message: "Logo deleted",
        logoPath: `${baseUrl}/uploads/fallback.png`,
      });
    }

    const logoName = await updateCompanyLogo(companyId, logo?.filename);

    return res.status(200).json({
      message: "Logo updated",
      logoPath: `${baseUrl}/uploads/logotypes/${logoName}`,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
}

export async function userDeleteCompany(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const companyId = Number(req.params.id);

  try {
    await deleteCompany(companyId);
    return res.status(200).json({ message: "Company deleted" });
  } catch (error) {
    console.log(error);
    next(error);
  }
}

export async function adminGetCompanies(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const page = req.query.page ? Number(req.query.page) : 1;
  const limit = req.query.limit ? Number(req.query.limit) : 10;
  const skip = (page - 1) * limit;

  const sortBy = req.query.sortBy as "company_name" | "service" | undefined;
  const sortOrder = req.query.sortOrder as "asc" | "desc" | undefined;
  const minCapital = req.query.minCapital
    ? Number(req.query.minCapital)
    : undefined;
  const maxCapital = req.query.maxCapital
    ? Number(req.query.maxCapital)
    : undefined;
  const startDate = req.query.startDate
    ? new Date(req.query.startDate as string)
    : undefined;
  const endDate = req.query.endDate
    ? new Date(req.query.endDate as string)
    : undefined;

  try {
    const companies = (
      await getAllCompaniesPaginated(
        limit,
        skip,
        undefined,
        sortBy,
        sortOrder || "asc",
        minCapital,
        maxCapital,
        startDate,
        endDate
      )
    ).map((value) => {
      return {
        id: value.id,
        name: value.company_name,
        service: value.service,
      };
    });

    return res.status(200).json({ companies });
  } catch (error) {
    console.log(error);
    next(error);
  }
}

export async function adminGetCompany(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const companyId = Number(req.params.id);
  const baseUrl = `${req.protocol}://${req.get("host")}`;

  try {
    const company = await getCompany(companyId);

    if (company) {
      let logoPath: string;

      if (company.logo) {
        logoPath = `${baseUrl}/uploads/logotypes/${company.logo}`;
      } else {
        logoPath = `${baseUrl}/uploads/fallback.png`;
      }

      const user = await getUser(company.owner_id);

      return res.status(200).json({
        company: {
          id: company.id,
          name: company.company_name,
          createdAt: company.created_at,
          capital: company.capital,
          address: company.address,
          service: company.service,
          logoPath,
          owner: {
            firstName: user?.firstname,
            lastName: user?.lastname,
          },
        },
      });
    } else {
      return res.status(404).json({ message: "Company not found" });
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
}
