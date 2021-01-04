import * as express from "express";
import * as socketio from "socket.io";
import * as path from "path";
import {app} from '../app';

const expressapp = express();
expressapp.set("port", 3000);
// eslint-disable-next-line @typescript-eslint/no-var-requires
const http = require("http").Server(expressapp);
// set up socket.io and bind it to our
// http server.
// eslint-disable-next-line @typescript-eslint/no-var-requires
const io = require("socket.io")(http);
expressapp.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname + '/../../../socketio.html'));

});
// whenever a user connects on port 3000 via
// a websocket, log that a user has connected
io.on("connection", function(socket: any) {
    console.log("a user connected");

    socket.on("message", async function(message: any) {
        await app.handle(message);
        socket.emit('message', message)
    });
});



const server = http.listen(3000, function() {
    console.log("listening on *:3000");
});
