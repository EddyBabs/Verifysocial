/**
 * An array of routes that are accessible to the public
 * These routes do not requore authentication
 * @type {string[]}
 */
export const publicRoutes = [];

/**
 * An array of routes that ares used for authentication
 * These routes will redirect logged in users to /
 * @type {string[]}
 */
export const authRoutes = [
  "/auth/signin",
  "/auth/signup",
  "/vendor/auth/signup",
];

/**
 * The prefix for API Authentication routes
 * Never Block this route
 * Route that start with the prefix are used for API authentication purposes
 * @type {string}
 */
export const apiAuthPRefix = "/api/auth";

/**
 * The default path after login
 * @type {string}
 */
export const DEFAULT_LOGIN_REDIRECT = "/dashboard";
