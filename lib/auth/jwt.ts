import { SignJWT, jwtVerify, type JWTPayload } from "jose";

export interface SessionPayload extends JWTPayload {
  userId: string;
  email: string;
  name?: string;
}

export function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET?.trim();
  if (!secret) {
    throw new Error("JWT_SECRET environment variable is missing.");
  }
  if (secret.length < 32) {
    throw new Error("JWT_SECRET must be at least 32 characters long for security.");
  }
  return secret;
}

export function getJwtKey(): Uint8Array {
  return new TextEncoder().encode(getJwtSecret());
}

/**
 * Signs a JWT payload using HS256 and expires in 7 days.
 */
export async function signToken(payload: Record<string, unknown>): Promise<string> {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getJwtKey());
}

/**
 * Verifies a JWT token with the single shared source of truth key.
 * Edge runtime and Node.js compatible.
 */
export async function verifyToken<T = SessionPayload>(token: string): Promise<T | null> {
  try {
    const { payload } = await jwtVerify(token, getJwtKey(), {
      algorithms: ["HS256"],
    });
    return payload as unknown as T;
  } catch (error) {
    return null;
  }
}
