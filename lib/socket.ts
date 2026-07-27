import { io, type Socket } from "socket.io-client";

let socket: Socket | null = null;

export function obtenirSocket(): Socket {
  if (!socket) {
    socket = io({
      autoConnect: false,
    });
  }

  return socket;
}