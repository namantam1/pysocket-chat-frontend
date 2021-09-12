import { io } from "socket.io-client";
import { myaxios } from "./myaxios";

export const socket = io("https://sleepy-stream-26298.herokuapp.com", {
  autoConnect: false,
  // reconnection: false,
});

window.socket = socket;

export const tryReconnect = () => {
  console.log("trying reconnecting...");
  setTimeout(async () => {
    const refresh = localStorage.getItem("refresh");
    const res = await myaxios.post("/api/token_refresh/", { refresh });
    localStorage.setItem("access", res.data.access);
    socket.auth = res.data.access;
    socket.io.open((err) => {
      if (err) {
        tryReconnect();
      }
    });
  }, 2000);
};

socket.on("connect", () => console.log("Connected to socker server..."));
socket.on("disconnect", () => console.log("Disconnected to socker server..."));
