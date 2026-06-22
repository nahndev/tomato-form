import { WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server } from "socket.io";
import { User } from "./user.schema";

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
