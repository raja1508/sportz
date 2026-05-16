import express from "express"
import matchRouter from "./routes/matches.js";
import commentaryRouter from "./routes/commentary.js";
import http from "http"
import { attachWebsocketServer } from "./ws-server/server.js";


const app = express();
const PORT = 8000;


app.use(express.json())
const server = http.createServer(app)


app.use("/matches", matchRouter)
app.use("/matches/:matchId/commentary", commentaryRouter)


const {broadcastMatchCreated, broadcastCommentaryEvent} = attachWebsocketServer(server)
app.locals.broadcastMatchCreated = broadcastMatchCreated; 
app.locals.broadcastCommentaryEvent = broadcastCommentaryEvent
// Start the server
server.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
