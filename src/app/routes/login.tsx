import { ActionFunction, LoaderFunction } from "@remix-run/node";
import { Form } from "@remix-run/react";
import { authenticator } from "../services/session.server";

export const action: ActionFunction = async ({ request }) => {
  return await authenticator.authenticate("user-pass", request, {
    successRedirect: "/admin",
    failureRedirect: "/login",
  });
};

export const loader: LoaderFunction = async ({ request }) => {
  return await authenticator.isAuthenticated(request, {
    successRedirect: "/admin",
  });
};

export default function Login() {
  return (
    <Form method="post">
      <input type="text" name="username" required />
      <input type="password" name="password" required />
      <button type="submit">Log In</button>
    </Form>
  );
}
