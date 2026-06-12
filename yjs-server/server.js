import { Server } from "@hocuspocus/server";
import "dotenv/config";

const server = new Server({
  port: process.env.PORT || 3028,
  onChange: (data) => {
    console.log("Document changed:", data);
  },
});

server.listen();
