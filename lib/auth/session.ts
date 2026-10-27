import { cookies } from "next/headers";
import {
  signToken,
  verifyToken,
  getJwtSecret,
  getJwtKey,
  type SessionPayload,
} from "./jwt";

export { signToken, verifyToken, getJwtSecret, getJwtKey };
export type { SessionPayload };

export async function getSession(): Promise<SessionPayload | null> {
  const session = cookies().get("session")?.value;
  if (!session) return null;
  return await verifyToken<SessionPayload>(session);
}
