import crypto from "crypto";

// 비밀번호 해싱 함수
export function hashPassword(password: string): string {
  const hashKey = process.env.NEXT_PUBLIC_HASHED_KEY || "default-key";
  return crypto.createHmac("sha256", hashKey).update(password).digest("hex");
}
