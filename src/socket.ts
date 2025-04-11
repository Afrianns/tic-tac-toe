import { io } from "socket.io-client";

// "undefined" means the URL will be computed from the `window.location` object
const URL =
  import.meta.env.DEV_TYPE === "production"
    ? undefined
    : "http://localhost:5173";

export const socket = io(URL, {
  autoConnect: false,
});
