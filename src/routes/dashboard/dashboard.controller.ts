import { NextFunction, Request, Response } from "express";
import { TTokenPayload } from "../../types/types";
import {
  countAllCompanies,
  countAllUserCompanies,
  getTotalNumberOfAdmins,
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

// FOR USER
export async function getDashboard(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { userId } = req.user as TTokenPayload;

  const page = req.query.page ? Number(req.query.page) : 1;
  const limit = req.query.limit ? Number(req.query.limit) : 10;
  const skip = (Number(page) - 1) * Number(limit);

  try {
    const [companiesResult, totalCount, totalCapital] = await Promise.all([
      getAllCompaniesPaginated(limit, skip, userId),
      countAllUserCompanies(userId),
      getUserTotalCapital(userId),
    ]);

    const companies = companiesResult.map((value) => {
      return {
        id: value.id,
        name: value.company_name,
        service: value.service,
        capital: value.capital,
      };
    });

    const totalPages = Math.ceil(totalCount / limit);

    return res.status(200).json({
      totalCapital,
      companies,
      totalPages,
      currentPage: page,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
}

//FOR ADMINS
export async function getAllUsers(
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
    const [usersTotal, usersResult] = await Promise.all([
      getTotalNumberOfUsers(),
      getAllUsersPaginated("user", limit, skip, sortBy, sortOrder),
    ]);

    const users = usersResult.map((value) => ({
      id: value.id,
      firstName: value.firstname,
      lastName: value.lastname,
    }));

    const totalPages = Math.ceil(usersTotal / limit);

    return res.status(200).json({
      users,
      totalPages,
      currentPage: page,
      totalCount: usersTotal,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
}

export async function getAllCompanies(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const page = req.query.page ? Number(req.query.page) : 1;
  const limit = req.query.limit ? Number(req.query.limit) : 10;
  const skip = (Number(page) - 1) * Number(limit);

  try {
    const [companiesResult, totalCount] = await Promise.all([
      getAllCompaniesPaginated(limit, skip, undefined),
      countAllCompanies(),
    ]);

    const companies = companiesResult.map((value) => ({
      id: value.id,
      name: value.company_name,
      service: value.service,
    }));

    const totalPages = Math.ceil(totalCount / limit);

    return res.status(200).json({
      companies,
      totalPages,
      currentPage: page,
      totalCount,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
}

export async function getUserById(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const userId = Number(req.params.id);
  const baseUrl = `${req.protocol}://${req.get("host")}`;

  try {
    const user = await getUser(userId);

    let avatarPath: string;

    if (user?.avatar) {
      avatarPath = `${baseUrl}/uploads/avatars/${user.avatar}`;
    } else {
      avatarPath = `${baseUrl}/uploads/fallback.png`;
    }

    res.status(200).json({
      user: {
        id: user?.id,
        firstName: user?.firstname,
        lastName: user?.lastname,
        email: user?.email,
        avatar: avatarPath,
      },
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
}

export async function changeUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const userId = Number(req.params.id);
  const { firstName, lastName } = req.body;
  try {
    const updated = await updateUser(userId, firstName, lastName);
    return res.status(200).json({
      message: "User updated",
      user: {
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

export async function deleteUserById(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // const { userId } = req.user as TTokenPayload;
  const userId = Number(req.params.id);

  try {
    // Why i even need it???????
    // if (userId === userId) {
    //   return res.status(400).json({ message: "Cannot delete self" });
    // }

    await deleteUser(userId);
    return res.status(200).json("Admin deleted");
  } catch (error) {
    console.log(error);
    next(error);
  }
}

// FOR SUPERADMIN
export async function getAllAdmins(
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
    const [adminsTotal, usersResult] = await Promise.all([
      getTotalNumberOfAdmins(),
      getAllUsersPaginated("admin", limit, skip, sortBy, sortOrder),
    ]);

    const users = usersResult.map((value) => ({
      id: value.id,
      firstName: value.firstname,
      lastName: value.lastname,
    }));

    const totalPages = Math.ceil(adminsTotal / limit);

    return res.status(200).json({
      users,
      totalPages,
      currentPage: page,
      totalCount: adminsTotal,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
}

export async function createAdmin(
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
