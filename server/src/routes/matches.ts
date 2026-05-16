import {Router, type Router as ExpressRouter} from "express"
import { db } from "../db/client.js";
import { matches } from "../db/schema.js";
import { safeParse } from "zod/v4/core";
import { CreateMatchSchema, MatchIdParamSchema } from "../validation.js";
import { eq} from "drizzle-orm";


const matchRouter: ExpressRouter = Router(); 

matchRouter.get("/", async (req, res) => {
    try{

        const data= await db.select()
        .from(matches)
        .orderBy(matches.startTime)
        .limit(4)

        return res.json({msg: "Matches Fetched", matches: data})
    }catch(error){
        console.error("[GET /matches]", error);
        return res.status(500).json({ msg: "Internal server error" });
    }
    
})

matchRouter.get("/:id", async (req, res) => {
    try{

        const parsed = safeParse(MatchIdParamSchema, req.params);
        if (!parsed.success) {
            return res.status(400).json({ msg: "Invalid match id", error: parsed.error });
        }
        
        const { id } = parsed.data;
        
        const [match] = await db
        .select()
        .from(matches)
        .where(eq(matches.id, id))
        .limit(1); // limit(1) avoids a full scan if the index ever misses
        
        // Explicit 404 — never return an empty body with 200 for a missing resource.
        if (!match) {
            return res.status(404).json({ msg: `Match with id ${id} not found` });
        }
        
        return res.status(200).json({ msg: "Match Fetched", match });
    }catch(error) {
        console.error("[GET /matches/:id]", error);
        return res.status(500).json({ msg: "Internal server error" });
        }
    })

matchRouter.post("/", async (req, res) => {
    try{

        const parsedBody = safeParse(CreateMatchSchema, req.body);
        if (!parsedBody.success) {
            return res.status(400).json({ msg: "Wrong Inputs Format", error: parsedBody.error });
        } 
        
        const {sport, homeTeam, awayTeam, status, startTime, endTime} = parsedBody.data
        
        if(homeTeam.trim().toLowerCase() === awayTeam.trim().toLowerCase()) {
            return res.status(422).json({msg: "home team and away team cannot be same"})
        }
        
        const now = new Date()
        
        if(startTime < now && !["finished", "cancelled"].includes(status)) {
            return res.status(422).json({msg: "Only finished or cancelled can be filled on status field"})
        }
        
        const [newMatch] = await db.insert(matches).values({
            sport, 
            homeTeam,
            awayTeam,
            status,
            startTime,
            endTime
        }).returning();
        
        req.app.locals.broadcastMatchCreated(newMatch)

        return res.json({msg: "Match Created", match: newMatch})
    }catch(error) {
        console.error("[POST /matches]", error);
        return res.status(500).json({ msg: "Internal server error" });
    }
    })


export default matchRouter;