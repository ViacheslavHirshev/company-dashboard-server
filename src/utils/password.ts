import bcrypt from "bcryptjs";

export async function encryptPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export async function comparePassword(plain: string, hashed: string) {
  return bcrypt.compare(plain, hashed);
}
