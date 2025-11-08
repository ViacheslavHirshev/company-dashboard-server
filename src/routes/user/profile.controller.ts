import { NextFunction, Request, Response } from "express";
import {
  getUser,
  updateUser,
  updateUserPassword,
} from "../../services/userService";
import path from "path";
import fs from "fs";
import { TTokenPayload } from "../../types/types";

export async function getUserData(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (!req.user) throw { status: 403, message: "User not authorized" };

  const { userId } = req.user as TTokenPayload;

  try {
    const user = await getUser(userId);

    if (!user) throw { status: 404, message: "User not found" };

    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    next(error);
  }
}

export async function changeUserData(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (!req.user) throw { status: 403, message: "User not authorized" };

  const { userId } = req.user as { userId: number; roleId: number };
  const avatar = req.file;
  const { firstName, lastName } = req.body;

  // REFACTOR IT -----> can incapsulate logic inside updateUser()
  try {
    const user = await getUser(userId);

    let newAvatarPath: string | null | undefined = undefined;

    if (avatar) {
      if (user.avatar) {
        const oldPath = path.join(
          "uploads/avatars",
          path.basename(user.avatar)
        );

        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }

      newAvatarPath = `/uploads/avatars/${avatar.filename}`;
    }

    const updatedUser = await updateUser(
      userId,
      firstName,
      lastName,
      newAvatarPath
    );

    res.status(200).json({ message: "User data updated", user: updatedUser });
  } catch (error) {
    console.log(error);
    next(error);
  }
}

export async function changeUserPassword(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (!req.user) throw { status: 403, message: "User not authorized" };

  const { userId } = req.user as { userId: number; roleId: number };
  const { currentPassword, newPassword } = req.body;

  try {
    const user = await updateUserPassword(userId, currentPassword, newPassword);
    res.status(200).json({ message: "Password updated", user });
  } catch (error) {
    console.log(error);
    next(error);
  }
}
