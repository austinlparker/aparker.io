import { createCookieSessionStorage } from "@remix-run/node";
import { Authenticator } from "remix-auth";
import { FormStrategy } from "remix-auth-form";

// Make sure SESSION_SECRET is set in your environment variables
if (!process.env.SESSION_SECRET) {
  throw new Error("SESSION_SECRET must be set");
}

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "_session",
    sameSite: "lax",
    path: "/",
    httpOnly: true,
    secrets: [process.env.SESSION_SECRET],
    secure: process.env.NODE_ENV === "production",
  },
});

export const { getSession, commitSession, destroySession } = sessionStorage;

// Create an instance of the authenticator
export const authenticator = new Authenticator<string>(sessionStorage);

// Define your user type. For this example, we're just using a string (userId)
// but you might want to use a more complex object in a real application
type User = string;

// Define the strategy
authenticator.use(
  new FormStrategy(async ({ form }) => {
    const username = form.get("username") as string;
    const password = form.get("password") as string;

    // Here you would check the username and password against your database
    // For this example, we're just checking for a hardcoded value
    if (username === "admin" && password === process.env.ADMIN_PW) {
      return username; // In a real app, return a user object or ID
    }

    throw new Error("Invalid username or password");
  }),
  "user-pass",
);

export async function requireUser(request: Request) {
  return await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });
}
