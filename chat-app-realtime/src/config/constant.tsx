export const SERVER_URL =
  process.env.NODE_ENV === "production"
    ? "https://server-nodejs-iota.vercel.app"
    : "http://localhost:8000";
// export const SERVER_URL = "https://server-nodejs-iota.vercel.app";

export const pusher_app_id = "1791182";
export const pusher_key = "cc5ed8623541c6cf51e6";
export const pusher_secret = "f755cc44774eca420b1e";
export const pusher_cluster = "ap1";
export const pusher_channel = "chat-realtime";
