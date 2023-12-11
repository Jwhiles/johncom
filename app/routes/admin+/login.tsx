import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData, useNavigation } from "@remix-run/react";
import { metaV1 } from "@remix-run/v1-meta";
import * as React from "react";

import { createAdminSession, getAdminId, verifyLogin } from "~/auth.server";
import { isRouteSubmitting } from "~/utils/isSubmitting";

export function validateEmail(email: unknown): email is string {
  return typeof email === "string" && email.length > 3 && email.includes("@");
}

export async function loader({ request }: LoaderFunctionArgs) {
  const adminId = await getAdminId(request);
  if (adminId) return redirect("/");

  return json({});
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");
  const remember = formData.get("remember");

  if (!validateEmail(email)) {
    return json(
      { errors: { email: "Email is invalid", password: null } },
      { status: 400 },
    );
  }

  if (typeof password !== "string" || password.length === 0) {
    return json(
      { errors: { email: null, password: "Password is required" } },
      { status: 400 },
    );
  }

  const admin = await verifyLogin(email, password);

  if (admin) {
    return createAdminSession({
      request,
      adminId: admin.id,
      remember: remember === "on" ? true : false,
    });
  }

  return json(
    { errors: { email: "Invalid email or password", password: null } },
    { status: 400 },
  );
}

export const meta: MetaFunction = (args) =>
  metaV1(args, {
    title: "Login",
  });

export default function LoginPage() {
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const emailRef = React.useRef<HTMLInputElement>(null);
  const passwordRef = React.useRef<HTMLInputElement>(null);

  const submitting = isRouteSubmitting(navigation);

  React.useEffect(() => {
    if (actionData?.errors?.email) {
      emailRef.current?.focus();
    } else if (actionData?.errors?.password) {
      passwordRef.current?.focus();
    }
  }, [actionData]);

  return (
    <div className="p-4 leading-tight max-w-2xl mx-auto">
      <div className="flex w-full justify-center">
        <h1 className="mb-8">Welcome back!</h1>
      </div>
      <Form method="POST" className="form-control w-full max-w-sm">
        <div>
          <label htmlFor="email">Email address</label>
          <input
            className="w-full"
            id="email"
            ref={emailRef}
            required
            name="email"
            type="email"
            placeholder="something@somewhere.com"
            autoComplete="email"
            aria-invalid={actionData?.errors?.email ? true : undefined}
            aria-describedby="email-error"
          />
          {actionData?.errors?.email ? (
            <div className="pt-1 text-error" id="email-error">
              {actionData.errors.email}
            </div>
          ) : (
            <div className="pt-1">&nbsp;</div>
          )}
        </div>

        <div>
          <label htmlFor="password">Password</label>
          <div>
            <input
              className="w-full"
              id="password"
              ref={passwordRef}
              name="password"
              type="password"
              autoComplete="current-password"
              placeholder="topsecretpassword"
              aria-invalid={actionData?.errors?.password ? true : undefined}
              aria-describedby="password-error"
            />
            {actionData?.errors?.password ? (
              <div className="pt-1 text-error" id="password-error">
                {actionData.errors.password}
              </div>
            ) : (
              <div className="pt-1">&nbsp;</div>
            )}
          </div>
        </div>
        <span className="flex items-center justify-between">
          <label htmlFor="remember" className="cursor-pointer">
            <span className="mr-2 text-sm">Remember me</span>
            <input id="remember" name="remember" type="checkbox" />
          </label>
          <button type="submit" disabled={submitting}>
            {submitting ? "Logging in..." : "Log in"}
          </button>
        </span>
      </Form>
    </div>
  );
}
