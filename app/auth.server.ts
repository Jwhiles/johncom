import { Admin, Password } from "@prisma/client";
import { createCookieSessionStorage, redirect } from "@remix-run/node";
import type { Session } from "@remix-run/node";
import bcrypt from "bcryptjs";

import { prisma } from "./db.server";

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "__session",
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secrets: [process.env.SESSION_SECRET!],
    secure: process.env.NODE_ENV === "production",
  },
});

const ADMIN_SESSION_KEY = "adminId";

async function getAdminById(adminId: string) {
  return await prisma.admin.findUnique({ where: { id: adminId } });
}

export async function getSession(request: Request) {
  const cookie = request.headers.get("Cookie");
  return sessionStorage.getSession(cookie);
}

export async function commitSession(session: Session) {
  return sessionStorage.commitSession(session);
}

export async function getAdminId(
  request: Request,
): Promise<Admin["id"] | undefined> {
  const session = await getSession(request);
  const adminId = session.get(ADMIN_SESSION_KEY);
  return adminId;
}

export async function getAdmin(request: Request) {
  const adminId = await getAdminId(request);
  if (adminId === undefined) return null;

  const admin = await getAdminById(adminId);

  if (admin) return admin;

  throw await logout(request);
}

export async function requireAdminId(request: Request) {
  const adminId = await getAdminId(request);
  if (!adminId) {
    // const searchParams = new URLSearchParams([["redirectTo", redirectTo]]);
    throw redirect(`/`);
  }
  return adminId;
}

// how best to do this?

export async function requireAdmin(request: Request) {
  const adminId = await requireAdminId(request);

  const admin = await getAdminById(adminId);
  if (admin) {
    return admin;
  }

  throw await logout(request);
}

export async function createAdminSession({
  request,
  adminId,
  remember,
}: {
  request: Request;
  adminId: string;
  remember: boolean;
}) {
  const session = await getSession(request);
  session.set(ADMIN_SESSION_KEY, adminId);

  return redirect("/admin", {
    headers: {
      "Set-Cookie": await sessionStorage.commitSession(session, {
        maxAge: remember
          ? 60 * 60 * 24 * 7 // 7 days
          : undefined,
      }),
    },
  });
}

export async function logout(request: Request) {
  const session = await getSession(request);
  return redirect("/", {
    headers: {
      "Set-Cookie": await sessionStorage.destroySession(session),
    },
  });
}

export async function verifyLogin(
  email: Admin["email"],
  password: Password["hash"],
) {
  const adminWithPassword = await prisma.admin.findUnique({
    where: { email },
    include: {
      password: true,
    },
  });

  if (!adminWithPassword || !adminWithPassword.password) {
    return null;
  }

  const isValid = await bcrypt.compare(
    password,
    adminWithPassword.password.hash,
  );

  if (!isValid) {
    return null;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password: _password, ...adminWithoutPassword } = adminWithPassword;

  return adminWithoutPassword;
}
