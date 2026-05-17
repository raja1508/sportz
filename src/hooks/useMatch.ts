import { Match, MatchStatus, WsServerMessage } from "@/types";
import { useCallback, useEffect, useRef, useState } from "react";

interface UseMatchReturn {
    matches: Match[];
    // matchStatus: MatchStatus;
    // matchScore: MatchScore;
  }

export interface MatchScore {
    homeScore: number,
    awayScore: number
}

export function useMatch(): UseMatchReturn{
    const [matches, setMatches] = useState<Match[] | []>([]); 
    // const [matchStatus, setMatchStatus] = useState<MatchStatus>("scheduled")
    // const [matchScore, setMatchScore] = useState<MatchScore | null>(null)
    const wsRef = useRef<WebSocket>(null); 


    const loadMatches = useCallback(async () => {
        try{
            const response = await fetch("http://localhost:8000/matches");
            const json = await response.json(); 
            console.log(json)
            // console.log(json.matches)
            setMatches(json.matches)
        }catch(error) {
            console.log("useMatches is failed to load matches")
        }
    }, [])

    const setMatchStatus = useCallback(async (matchId: number, matchStatus: MatchStatus) => {
        try{
            if(!matchId) return; 
            // ✅ Returns new array
            setMatches(prev => prev.map(match =>
                match.id === matchId ? { ...match, status: matchStatus } : match
            ))
            
        }catch(error) {
            console.log("setMatchStatus throw an error")
        }
    }, [])

    useEffect(() => {


        loadMatches()
        if(wsRef.current?.readyState === WebSocket.OPEN){
            return
        }

        const wsClient = new WebSocket("ws://localhost:8000/ws"); 
        wsRef.current = wsClient; 

        wsClient.onopen = () => {
            console.log("connection is open")
        }

        wsClient.onmessage = (raw) => {
            let msg: WsServerMessage; 
            msg = JSON.parse(raw.data.toString());

            switch (msg.type) {
                case "MATCH_CREATED" : 
                    setMatches(prev => [msg.match, ...prev])
                    break; 
                case "MATCH_STATUS_CHANGE": 
                    //@ts-ignore
                    setMatchStatus(msg.matchId, msg.status)
                    break; 
                    
            }
        }

        wsClient.onerror = (error) => {
            console.log("error occured " + JSON.stringify(error))
        }

        wsClient.onclose = () => {
            console.log("websocket connection is closed")
        }

       return () => {
           wsClient.close()
       }


    }, [loadMatches])



    return {matches}

}