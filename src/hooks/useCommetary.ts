import { useCallback, useEffect, useRef, useState } from "react";
import { CommentaryEvent, WsServerMessage} from "@/types";
 
type WsStatus = "connecting" | "connected" | "disconnected" | "error";
 
interface UseCommentaryReturn {
  events: CommentaryEvent[];
  status: WsStatus;
  subscriberCount: number;
}
 


export default function useCommentary(matchId: number | null): UseCommentaryReturn {
    const [events, setEvents] = useState<CommentaryEvent[] | []>([])
    const [status, setStatus] = useState<WsStatus>("disconnected")
    const [subscriberCount, setSubscriberCount] = useState(0);



    const wsRef = useRef<WebSocket | null>(null)
    const matchIdRef = useRef<number | null>(null)


    const loadHistory = useCallback(async (matchId: number) => {
        try{
            const response = await fetch(`http://localhost:8000/matches/${matchId}/commentary`); 
            const  json = await response.json()
            console.log(json)
            setEvents(json.commentaries?? []) 
        }catch(error) {
            console.log("useCommentry is failed to load history")
        }
    }, [])


    useEffect(() => {
        if(!matchId) return ;      
        if(matchIdRef.current === matchId && wsRef.current?.readyState === WebSocket.OPEN) {
            return 
        }
        
        matchIdRef.current = matchId; 
        
        loadHistory(matchId); 
        
        const wsClient = new WebSocket("ws://localhost:8000/ws")
        wsRef.current = wsClient; 
        setStatus("connecting")
        wsClient.onopen = () => {
            setStatus("connected")
            wsClient.send(JSON.stringify({type: "SUBSCRIBE", matchId}))
        }; 

        wsClient.onmessage = (raw) => {
            const msg: WsServerMessage = JSON.parse(raw.data.toString())

            switch (msg.type) {
                case "SUBSCRIBED" : 
                    setSubscriberCount(msg.subscriberCount)
                    break; 
                case "COMMENTARY_EVENT":
                    //@ts-ignore 
                    setEvents(prev => [msg.event, ...prev])
                     break;  
                case "SCORE_UPDATE":   
                    break; 
                case "PONG": 
                    break; 
                case "ERROR": 
                    setStatus("error")
                    break; 
                
                    
            }


        }

        wsClient.onerror = (error) => {
            console.log(JSON.parse(error.toString()))
            setStatus("error")
        }

        wsClient.onclose = () => {
            setStatus("disconnected")
            setSubscriberCount(0)
        }

        return () => {
            if (wsClient.readyState === WebSocket.OPEN) {
                wsClient.send(JSON.stringify({ type: "UNSUBSCRIBE", matchId }));
            }

            wsClient.close()
            wsRef.current = null
        }


    }, [matchId, loadHistory])

    return {events, status, subscriberCount}
}