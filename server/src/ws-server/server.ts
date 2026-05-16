import {WebSocket, WebSocketServer} from "ws"
import type { Match } from "../db/schema.js";
import type { Server } from "http";

// Messages sent FROM browser TO server
type ClientMessage =
  | { type: "SUBSCRIBE";   matchId: number }
  | { type: "UNSUBSCRIBE"; matchId: number }
  | { type: "PING" };
 
// Messages sent FROM server TO browser
type ServerMessage =
  | { type: "SUBSCRIBED";          matchId: number; subscriberCount: number }
  | { type: "UNSUBSCRIBED";        matchId: number }
  | { type: "COMMENTARY_EVENT";    matchId: number; event: unknown }
  | { type: "SCORE_UPDATE";        matchId: number; homeScore: number; awayScore: number }
  | { type: "MATCH_STATUS_CHANGE"; matchId: number; status: string }
  | { type: "PONG" }
  | { type: "ERROR";               message: string };


interface Client {
    socket: WebSocket,
    subscribedMatchId: number | null,
    connectedAt: Date
}

export const rooms = new Map<number, Set<WebSocket>>(); 

const clients = new Map<WebSocket,Client>()

function sendJson(socket: WebSocket, payload: unknown): void {
    if (socket.readyState !== WebSocket.OPEN) return; 

    socket.send(JSON.stringify(payload));
    
}

function broadcast(wss: WebSocketServer, payload: unknown): void {
    wss.clients.forEach(client => {
        if(client.readyState !== WebSocket.OPEN) return; 
        sendJson(client, payload); 
        
    })


}

function getRoom(matchId: number) {
    if(!rooms.has(matchId)) rooms.set(matchId, new Set()); 

    return rooms.get(matchId)
}

function subscribe(socket: WebSocket, matchId: number){
    const client = clients.get(socket)
    if(!client) return 


    if(client.subscribedMatchId !== null) {
        unsubscribe(socket, matchId, false)
    }
    const room = getRoom(matchId); 
    room?.add(socket); 

    client.subscribedMatchId = matchId

    sendJson(socket, {type: "subscribed", data: client.subscribedMatchId})
}


function unsubscribe(socket: WebSocket, matchId: number, notify=true){
    const client = clients.get(socket)
    if(!client) return 
    
    const room = getRoom(matchId)
    if(room) {
        room.delete(socket)

        if(room.size === 0) rooms.delete(matchId)
    } 
    client.subscribedMatchId = null; 


    if(notify) {
        sendJson(socket, {type: "unsubscribed", data: client})
    }
}

function broadcastToMatch(matchId: number, payload: object) {

    const room = rooms.get(matchId)
    if(!room || room.size === 0) return

    room.forEach(client => {
            sendJson(client, payload)
    })
}


export function attachWebsocketServer(server: Server) {
    const wss = new WebSocketServer({server, path: "/ws", maxPayload: 1024*1024}); 

    wss.on("connection", (socket) => {
        clients.set(socket, {
            socket,
            subscribedMatchId: null,
            connectedAt: new Date()
        })

        sendJson(socket, {type: "WELCOME"})

        socket.on("message", (raw) => {
            let msg: ClientMessage ; 
            try {
                msg = JSON.parse(raw.toString()); 
            }catch(error){
                return sendJson(socket, {msg: "invalid json "})
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


        })

        socket.on("close", () => {
            clients.delete(socket)
        })

        socket.on("error", console.error)
    })

    function broadcastMatchCreated(match: Match) {
        broadcast(wss, {type: "MATCH_CREATED", data: match})
    }

    function broadcastCommentaryEvent(matchId: number, event: unknown) {
        broadcastToMatch(matchId, {
          type: "COMMENTARY_EVENT",
          matchId,
          event,
        });
      }
       
      function broadcastScoreUpdate(
        matchId: number,
        homeScore: number,
        awayScore: number
      ) {
        broadcastToMatch(matchId, {
          type: "SCORE_UPDATE",
          matchId,
          homeScore,
          awayScore,
        });
      }
       

      function broadcastStatusChange(matchId: number, status: string) {
        broadcastToMatch(matchId, {
          type: "MATCH_STATUS_CHANGE",
          matchId,
          status,
        });
      }
       
      /** How many clients are watching a match right now */
      function getSubscriberCount(matchId: number): number {
        return rooms.get(matchId)?.size ?? 0;
      }

    return {broadcastMatchCreated, broadcastCommentaryEvent, broadcastScoreUpdate, broadcastStatusChange}
}