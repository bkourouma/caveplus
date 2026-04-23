import { createHash, randomBytes, scrypt as scryptCallback, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { Role } from "@prisma/client";
import { sendTransactionalEmail } from "@/lib/email";
import { prisma } from "@/lib/prisma";
import { getAuthBaseUrl } from "@/lib/utils";

const hasDatabaseUrl = Boolean(process.env.DATABASE_URL);
const isDevelopment = process.env.NODE_ENV !== "production";
const scrypt = promisify(scryptCallback);
const DEV_ADMIN_EMAIL = process.env.DEV_ADMIN_EMAIL ?? "";
const DEV_ADMIN_PASSWORD = process.env.DEV_ADMIN_PASSWORD ?? "";
const DEV_ADMIN_NAME = process.env.DEV_ADMIN_NAME ?? "Admin CavePlus";

function getDevAdminUser() {
  if (!isDevelopment || !DEV_ADMIN_EMAIL || !DEV_ADMIN_PASSWORD) {
    return null;
  }

  return {
    id: "dev-admin",
    email: DEV_ADMIN_EMAIL,
    name: DEV_ADMIN_NAME,
    role: "ADMIN"
  } as const;
}

export type AuthUserPayload = {
  email: string;
  name?: string | null;
  image?: string | null;
  role?: Role;
};

export type RegisterUserPayload = {
  name: string;
  email: string;
  password: string;
};

export async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const derivedKey = (await scrypt(password, salt, 64)) as Buffer;
  return `${salt}:${derivedKey.toString("hex")}`;
}

export async function verifyPassword(password: string, storedHash?: string | null) {
  if (!storedHash) {
    return false;
  }

  const [salt, key] = storedHash.split(":");

  if (!salt || !key) {
    return false;
  }

  const derivedKey = (await scrypt(password, salt, 64)) as Buffer;
  const storedKeyBuffer = Buffer.from(key, "hex");

  if (storedKeyBuffer.length !== derivedKey.length) {
    return false;
  }

  return timingSafeEqual(storedKeyBuffer, derivedKey);
}

export async function ensureUserRecord(payload: AuthUserPayload) {
  if (!hasDatabaseUrl) {
    const fallbackUser = payload.role === Role.ADMIN ? getDevAdminUser() : null;

    return {
      id: fallbackUser?.id ?? "demo-user",
      email: payload.email,
      name: payload.name ?? fallbackUser?.name ?? "Client CavePlus",
      role: payload.role ?? Role.CUSTOMER
    };
  }

  const user = await prisma.user.upsert({
    where: { email: payload.email },
    update: {
      name: payload.name ?? undefined,
      image: payload.image ?? undefined,
      role: payload.role ?? undefined
    },
    create: {
      email: payload.email,
      name: payload.name ?? "Client CavePlus",
      image: payload.image ?? undefined,
      role: payload.role ?? "CUSTOMER"
    }
  });

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role
  };
}

export async function registerCredentialsUser(payload: RegisterUserPayload) {
  if (!hasDatabaseUrl) {
    throw new Error("DATABASE_URL is required to register a real user.");
  }

  const existingUser = await prisma.user.findUnique({
    where: { email: payload.email },
    select: { id: true }
  });

  if (existingUser) {
    throw new Error("Un compte existe deja avec cet email.");
  }

  const passwordHash = await hashPassword(payload.password);

  const user = await prisma.user.create({
    data: {
      name: payload.name,
      email: payload.email,
      passwordHash,
      role: "CUSTOMER"
    }
  });

  return {
    id: user.id,
    name: user.name ?? payload.name,
    email: user.email,
    role: user.role
  };
}

export async function authenticateCredentialsUser(email: string, password: string) {
  const devAdminUser = getDevAdminUser();

  if (devAdminUser && email === DEV_ADMIN_EMAIL && password === DEV_ADMIN_PASSWORD) {
    return devAdminUser;
  }

  if (!hasDatabaseUrl) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { email }
  });

  if (!user?.passwordHash) {
    return null;
  }

  const isValid = await verifyPassword(password, user.passwordHash);

  if (!isValid) {
    return null;
  }

  return {
    id: user.id,
    email: user.email,
    name: user.name ?? "Client CavePlus",
    role: user.role
  };
}

function hashResetToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export async function requestPasswordReset(email: string) {
  const siteUrl = getAuthBaseUrl();

  if (!hasDatabaseUrl) {
    return { ok: true };
  }

  const user = await prisma.user.findUnique({
    where: { email },
    select: { email: true, name: true }
  });

  if (!user) {
    return { ok: true };
  }

  await prisma.verificationToken.deleteMany({
    where: { identifier: email }
  });

  const rawToken = randomBytes(32).toString("hex");
  const hashedToken = hashResetToken(rawToken);
  const expires = new Date(Date.now() + 1000 * 60 * 30);

  await prisma.verificationToken.create({
    data: {
      identifier: email,
      token: hashedToken,
      expires
    }
  });

  const resetUrl = `${siteUrl}/auth/reinitialisation?token=${encodeURIComponent(rawToken)}&email=${encodeURIComponent(email)}`;

  await sendTransactionalEmail(email, "Reinitialisation de votre mot de passe CavePlus", {
    text: `Bonjour ${user.name ?? ""}, utilisez ce lien pour reinitialiser votre mot de passe: ${resetUrl}`,
    html: `<p>Bonjour ${user.name ?? ""},</p><p>Utilisez ce lien pour reinitialiser votre mot de passe:</p><p><a href="${resetUrl}">${resetUrl}</a></p>`
  });

  return {
    ok: true,
    ...(process.env.NODE_ENV !== "production" ? { devResetUrl: resetUrl } : {})
  };
}

export async function resetPasswordWithToken(input: {
  email: string;
  token: string;
  password: string;
}) {
  if (!hasDatabaseUrl) {
    throw new Error("DATABASE_URL is required to reset a password.");
  }

  const hashedToken = hashResetToken(input.token);

  const verification = await prisma.verificationToken.findUnique({
    where: { token: hashedToken }
  });

  if (!verification || verification.identifier !== input.email || verification.expires < new Date()) {
    throw new Error("Le lien de reinitialisation est invalide ou expire.");
  }

  const passwordHash = await hashPassword(input.password);

  await prisma.user.update({
    where: { email: input.email },
    data: { passwordHash }
  });

  await prisma.verificationToken.deleteMany({
    where: { identifier: input.email }
  });

  return { ok: true };
}
