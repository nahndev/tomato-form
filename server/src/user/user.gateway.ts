import { WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { User } from "@/database/prisma-client";
import { Server } from "socket.io";

@WebSocketGateway({
  cors: { origin: process.env.CORS_ORIGIN?.split(",") ?? "*" },
})
export class UserGateway {
  @WebSocketServer()
  server!: Server;

  emitUsers(users: User[]) {
    this.server.emit("users:updated", users);
  }
}
