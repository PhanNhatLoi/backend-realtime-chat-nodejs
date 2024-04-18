export const SERVER_URL =
  process.env.NODE_ENV === "production"
    ? "https://server-nodejs-iota.vercel.app"
    : "http://localhost:8000";
