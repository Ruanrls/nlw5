import express from 'express';
import './database'
import { router } from "./routes"

import { createServer } from "http"
import { Server, Socket } from "socket.io"
import path from "path"

const app = express();

app.use(express.static(path.join(__dirname, "..", "public")));
app.set("views", path.join(__dirname, "..", "public"));
app.engine("html", require('ejs').renderFile);
app.set("view engine", "html");

app.use(express.json())
app.use(router);

app.get("/support", (req, res) => {
    res.render("html/client.html")
})

app.get("/admin", (req, res) => {
    res.render("html/admin.html")
})

const httpServer = createServer(app);
const socketServer = new Server(httpServer);

socketServer.on("connect", (socket: Socket) => {
    console.log("connected");
})

export { httpServer, socketServer }