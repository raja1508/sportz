import { WebSocket, WebSocketServer } from "ws";
export const rooms = new Map();
const clients = new Map();
function sendJson(socket, payload) {
    if (socket.readyState !== WebSocket.OPEN)
        return;
    socket.send(JSON.stringify(payload));
}
function broadcast(wss, payload) {
    wss.clients.forEach(client => {
        if (client.readyState !== WebSocket.OPEN)
            return;
        sendJson(client, payload);
    });
}
function getRoom(matchId) {
    if (!rooms.has(matchId))
        rooms.set(matchId, new Set());
    return rooms.get(matchId);
}
function subscribe(socket, matchId) {
    const client = clients.get(socket);
    if (!client)
        return;
    if (client.subscribedMatchId !== null) {
        unsubscribe(socket, matchId, false);
    }
    const room = getRoom(matchId);
    room?.add(socket);
    client.subscribedMatchId = matchId;
    sendJson(socket, { type: "subscribed", data: client.subscribedMatchId });
}
function unsubscribe(socket, matchId, notify = true) {
    const client = clients.get(socket);
    if (!client)
        return;
    const room = getRoom(matchId);
    if (room) {
        room.delete(socket);
        if (room.size === 0)
            rooms.delete(matchId);
    }
    client.subscribedMatchId = null;
    if (notify) {
        sendJson(socket, { type: "unsubscribed", data: client });
    }
}
function broadcastToMatch(matchId, payload) {
    const room = rooms.get(matchId);
    if (!room || room.size === 0)
        return;
    room.forEach(client => {
        sendJson(client, payload);
    });
}
export function attachWebsocketServer(server) {
    const wss = new WebSocketServer({ server, path: "/ws", maxPayload: 1024 * 1024 });
    wss.on("connection", (socket) => {
        clients.set(socket, {
            socket,
            subscribedMatchId: null,
            connectedAt: new Date()
        });
        sendJson(socket, { type: "WELCOME" });
        socket.on("message", (raw) => {
            let msg;
            try {
                msg = JSON.parse(raw.toString());
            }
            catch (error) {
                return sendJson(socket, { msg: "invalid json " });
            }
            switch (msg.type) {
                case "SUBSCRIBE":
                    if (typeof msg.matchId !== "number") {
                        sendJson(socket, { type: "ERROR", message: "matchId must be a number" });
                        return;
                    }
                    subscribe(socket, msg.matchId);
                    break;
                case "UNSUBSCRIBE":
                    if (typeof msg.matchId !== "number") {
                        sendJson(socket, { type: "ERROR", message: "matchId must be a number" });
                        return;
                    }
                    unsubscribe(socket, msg.matchId);
                    break;
                case "PING":
                    sendJson(socket, { type: "PONG" });
                    break;
                default:
                    sendJson(socket, { type: "ERROR", message: "Unknown message type" });
            }
        });
        socket.on("close", () => {
            clients.delete(socket);
        });
        socket.on("error", console.error);
    });
    function broadcastMatchCreated(match) {
        broadcast(wss, { type: "MATCH_CREATED", data: match });
    }
    function broadcastCommentaryEvent(matchId, event) {
        broadcastToMatch(matchId, {
            type: "COMMENTARY_EVENT",
            matchId,
            event,
        });
    }
    function broadcastScoreUpdate(matchId, homeScore, awayScore) {
        broadcastToMatch(matchId, {
            type: "SCORE_UPDATE",
            matchId,
            homeScore,
            awayScore,
        });
    }
    function broadcastStatusChange(matchId, status) {
        broadcastToMatch(matchId, {
            type: "MATCH_STATUS_CHANGE",
            matchId,
            status,
        });
    }
    /** How many clients are watching a match right now */
    function getSubscriberCount(matchId) {
        return rooms.get(matchId)?.size ?? 0;
    }
    return { broadcastMatchCreated, broadcastCommentaryEvent, broadcastScoreUpdate, broadcastStatusChange };
}
//# sourceMappingURL=server.js.map