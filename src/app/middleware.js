// middleware.js
export { default } from "next-auth/middleware";

export const config = {
  matcher: ["/protected/:path*"], // Protect all routes under /protected/
};
