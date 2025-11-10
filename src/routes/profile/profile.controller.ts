import { NextFunction, Request, Response } from "express";
import {
  deleteAvatarFile,
  getRoleName,
  getUser,
  updateUser,
  updateUserAvatar,
  updateUserPassword,
} from "../../services/userService";
import { TTokenPayload } from "../../types/types";

export async function getProfile(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { userId, roleId } = req.user as TTokenPayload;
  const baseUrl = `${req.protocol}://${req.get("host")}`;
  const roleName = await getRoleName(roleId);

  try {
    const user = await getUser(userId);

    let avatarPath: string;

    if (user?.avatar) {
      avatarPath = `${baseUrl}/uploads/avatars/${user.avatar}`;
    } else {
      avatarPath = `${baseUrl}/uploads/fallback.png`;
    }

    return res.status(200).json({
      user: {
        id: user?.id,
        firstName: user?.firstname,
        lastName: user?.lastname,
        avatar: avatarPath,
        role: roleName,
      },
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
}

export async function updateProfileData(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { userId } = req.user as TTokenPayload;
  const { firstName, lastName } = req.body;

  try {
    const updatedUser = await updateUser(userId, firstName, lastName);

    return res.status(200).json({
      message: "User data updated",
      user: {
        id: updatedUser.id,
        firstName: updatedUser.firstname,
        lastName: updatedUser.lastname,
      },
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
}

export async function changeAvatar(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { userId } = req.user as TTokenPayload;
  const deleteAvatar =
    req.body?.deleteAvatar === "true" || req.body?.deleteAvatar === true;
  const avatar = req.file;

  const baseUrl = `${req.protocol}://${req.get("host")}`;

  try {
    if (deleteAvatar) {
      await updateUserAvatar(userId, null);

      return res.status(200).json({
        message: "Avatar deleted",
        avatarPath: `${baseUrl}/uploads/fallback.png`,
      });
    }

    if (avatar) {
      const avatarName = await updateUserAvatar(userId, avatar.filename);

      return res.status(200).json({
        message: "Avatar updated",
        avatarPath: `${baseUrl}/uploads/avatars/${avatarName}`,
      });
    }

    return res.status(400).json({ message: "No avatar provided" });
  } catch (error) {
    console.error(error);
    next(error);
  }
}

export async function changePassword(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { userId } = req.user as TTokenPayload;
  const { currentPassword, newPassword } = req.body;

  try {
    await updateUserPassword(userId, currentPassword, newPassword);

    return res.status(200).json({ message: "Password updated" });
  } catch (error) {
    console.log(error);
    next(error);
  }
}
