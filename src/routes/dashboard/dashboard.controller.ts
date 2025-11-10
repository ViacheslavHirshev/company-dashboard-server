import { NextFunction, Request, Response } from "express";
import { TTokenPayload } from "../../types/types";
import {
  getNumberOfUserCompanies,
  getTotalNumberOfAdmins,
  getTotalNumberOfCompanies,
  getTotalNumberOfUsers,
  getUserTotalCapital,
} from "../../services/dashboardService";
import { getAllCompaniesPaginated } from "../../services/companyService";
import {
  createUser,
  deleteUser,
  getAllUsersPaginated,
  getUser,
  updateUser,
} from "../../services/userService";

export async function getDashboard(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { userId } = req.user as TTokenPayload;

  const page = req.query.page ? Number(req.query.page) : 1;
  const limit = req.query.limit ? Number(req.query.limit) : 10;
  const skip = (Number(page) - 1) * Number(limit);

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

    const companiesNumber = await getNumberOfUserCompanies(userId);
    const totalCapital = await getUserTotalCapital(userId);

    return res.status(200).json({ companiesNumber, totalCapital, companies });
  } catch (error) {
    console.log(error);
    next(error);
  }
}

export async function getDashboardUsers(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const limit = req.query.limit ? Number(req.query.limit) : 10;
  const page = req.query.page ? Number(req.query.page) : 1;
  const skip = (page - 1) * limit;

  const sortBy = req.query.sortBy as "firstname" | "lastname" | undefined;
  const sortOrder = req.query.sortOrder as "asc" | "desc" | undefined;

  try {
    const usersTotal = await getTotalNumberOfUsers();
    const users = (
      await getAllUsersPaginated("user", limit, skip, sortBy, sortOrder)
    ).map((value) => {
      return {
        id: value.id,
        firstName: value.firstname,
        lastName: value.lastname,
      };
    });

    return res.status(200).json({ usersTotal, users });
  } catch (error) {
    console.log(error);
    next(error);
  }
}

export async function getDashboardCompanies(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const page = req.query.page ? Number(req.query.page) : 1;
  const limit = req.query.limit ? Number(req.query.limit) : 10;
  const skip = (Number(page) - 1) * Number(limit);

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

    const companiesNumber = await getTotalNumberOfCompanies();

    return res.status(200).json({ companiesNumber, companies });
  } catch (error) {
    console.log(error);
    next(error);
  }
}

export async function getDashboardAdmins(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const limit = req.query.limit ? Number(req.query.limit) : 10;
  const page = req.query.page ? Number(req.query.page) : 1;
  const skip = (page - 1) * limit;

  const sortBy = req.query.sortBy as "firstname" | "lastname" | undefined;
  const sortOrder = req.query.sortOrder as "asc" | "desc" | undefined;

  try {
    const adminsTotal = await getTotalNumberOfAdmins();
    const users = (
      await getAllUsersPaginated("admin", limit, skip, sortBy, sortOrder)
    ).map((value) => {
      return {
        id: value.id,
        firstName: value.firstname,
        lastName: value.lastname,
      };
    });

    return res.status(200).json({ adminsTotal, users });
  } catch (error) {
    console.log(error);
    next(error);
  }
}

export async function getDashboardAdmin(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const adminId = Number(req.params.id);
  const baseUrl = `${req.protocol}://${req.get("host")}`;

  try {
    const admin = await getUser(adminId);

    let avatarPath: string;

    if (admin?.avatar) {
      avatarPath = `${baseUrl}/uploads/avatars/${admin.avatar}`;
    } else {
      avatarPath = `${baseUrl}/uploads/fallback.png`;
    }

    res.status(200).json({
      admin: {
        id: admin?.id,
        firstName: admin?.firstname,
        lastName: admin?.lastname,
        email: admin?.email,
        avatar: avatarPath,
      },
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
}

export async function postDashboardAdmin(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { firstName, lastName, email, password } = req.body;

  try {
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    await createUser(firstName, lastName, email, password, "admin");
    return res.status(200).json({ message: "Admin created successfully" });
  } catch (error) {
    console.log(error);
    next(error);
  }
}

export async function putDashboardAdmin(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const adminId = Number(req.params.id);
  const { firstName, lastName } = req.body;
  try {
    const updated = await updateUser(adminId, firstName, lastName);
    return res.status(200).json({
      message: "Admin updated",
      admin: {
        id: updated.id,
        firstName: updated.firstname,
        lastName: updated.lastname,
      },
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
}

export async function deleteDashboardAdmin(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { userId } = req.user as TTokenPayload;
  const adminId = Number(req.params.id);

  try {
    if (adminId === userId) {
      return res.status(400).json({ message: "Cannot delete self" });
    }

    await deleteUser(adminId);
    return res.status(200).json("Admin deleted");
  } catch (error) {
    console.log(error);
    next(error);
  }
}
