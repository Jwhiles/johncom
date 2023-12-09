import { Form, useNavigation } from "@remix-run/react";

import { isSubmittingByPath } from "~/utils/isSubmitting";

export default function Logout({ className }: { className?: string }) {
  const navigation = useNavigation();
  const submitting = isSubmittingByPath("/logout", navigation, "/");

  return (
    <Form action="/admin/logout" method="POST">
      <button type="submit" disabled={submitting} className={className}>
        {submitting ? "Logging out" : "Logout"}
      </button>
    </Form>
  );
}
