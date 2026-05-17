import { Router } from "express";
import { safeParse } from "zod/v4/core";
import { CommentaryParamSchema, CreateCommentarySchema, MatchIdParamSchema } from "../validation.js";
import { db } from "../db/client.js";
import { commentary } from "../db/schema.js";
import { desc, eq } from "drizzle-orm";
const commentaryRouter = Router({ mergeParams: true });
commentaryRouter.get("/", async (req, res) => {
    try {
        const parsed = safeParse(CommentaryParamSchema, req.params);
        if (!parsed.success) {
            return res.status(400).json({ msg: "Invalid match id", error: parsed.error });
        }
        const { matchId } = parsed.data;
        const data = await db.select()
            .from(commentary)
            .where(eq(commentary.matchId, matchId))
            .orderBy(desc(commentary.createdAt));
        return res.status(200).json({ msg: "Commentaries Fetched", commentaries: data });
    }
    catch (error) {
        console.error("[GET /matches/:id/commentary]", error);
        return res.status(500).json({ msg: "Internal server error" });
    }
});
commentaryRouter.get("/:id", async (req, res) => {
    try {
    }
    catch (error) {
        console.error("[GET /matches/:id/commentary/:id]", error);
        return res.status(500).json({ msg: "Internal server error" });
    }
});
commentaryRouter.post("/", async (req, res) => {
    try {
        const parsed = safeParse(CreateCommentarySchema, req.body);
        if (!parsed.success) {
            return res.status(400).json({ msg: "Invalid Input Types", error: parsed.error });
        }
        const { matchId, minute, sequence, period, eventType, actor, team, message, metadata, tags } = parsed.data;
        const [newCommentary] = await db.insert(commentary).values({
            matchId,
            minute,
            sequence,
            period,
            eventType,
            actor,
            team,
            message,
            metadata,
            tags
        }).returning();
        req.app.locals.broadcastCommentaryEvent(matchId, newCommentary);
        return res.json({ msg: "Commentary Created", commentary: newCommentary });
    }
    catch (error) {
        console.error("[POST /matches/:id/commentary]", error);
        return res.status(500).json({ msg: "Internal server error" });
    }
});
export default commentaryRouter;
//# sourceMappingURL=commentary.js.map