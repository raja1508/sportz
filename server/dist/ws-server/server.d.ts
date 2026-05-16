import { WebSocket } from "ws";
import type { Match } from "../db/schema.js";
import type { Server } from "http";
export declare const rooms: Map<number, Set<WebSocket>>;
export declare function attachWebsocketServer(server: Server): {
    broadcastMatchCreated: (match: Match) => void;
    broadcastCommentaryEvent: (matchId: number, event: unknown) => void;
    broadcastScoreUpdate: (matchId: number, homeScore: number, awayScore: number) => void;
    broadcastStatusChange: (matchId: number, status: string) => void;
};
//# sourceMappingURL=server.d.ts.map