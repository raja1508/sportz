import { z } from "zod";
 
// ─── Shared primitives ────────────────────────────────────────────────────────
 
const MatchStatus = z.enum([
  "scheduled",
  "live",
  "finished",
  "postponed",
  "cancelled",
]);
 
/** Accepts an ISO-8601 string and coerces it to a Date */
const ISODateTime = z
  .string()
  .datetime({ offset: true })
  .transform((val) => new Date(val));
 
const CommentaryMetadata = z.record(z.string(), z.unknown());
 
// ─────────────────────────────────────────────────────────────────────────────
// MATCH
// ─────────────────────────────────────────────────────────────────────────────
 
// POST /matches
export const CreateMatchSchema = z
  .object({
    sport:     z.string().min(1).max(64),
    homeTeam:  z.string().min(1).max(128),
    awayTeam:  z.string().min(1).max(128),
    status:    MatchStatus.default("scheduled"),
    startTime: ISODateTime,
    endTime:   ISODateTime,
    homeScore: z.number().int().nonnegative().default(0),
    awayScore: z.number().int().nonnegative().default(0),
  })
  .refine((data) => data.endTime > data.startTime, {
    message: "endTime must be after startTime",
    path: ["endTime"],
  });

export type CreateMatchInput = z.input<typeof CreateMatchSchema>;
export type CreateMatchOutput = z.output<typeof CreateMatchSchema>;
 
export const MatchIdParamSchema = z.object({
    id: z.coerce.number().int().positive()
})  

  
export type MatchIdParam = z.infer<typeof MatchIdParamSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// COMMENTARY
// ─────────────────────────────────────────────────────────────────────────────

// POST /matches/:matchId/commentary
export const CreateCommentarySchema = z.object({
    matchId:   z.number().int().positive(),
    minute:    z.number().int().min(0).max(999),
    sequence:  z.number().int().nonnegative(),
    period:    z.string().min(1).max(64),
    eventType: z.string().min(1).max(64),
    actor:     z.string().min(1).max(128),
    team:      z.string().min(1).max(128),
    message:   z.string().min(1),
    metadata:  CommentaryMetadata.optional(),
    tags:      z.array(z.string().min(1)).optional(),
});

export type CreateCommentaryInput = z.infer<typeof CreateCommentarySchema>;

export const CommentaryParamSchema = z.object({
  matchId: z.coerce.number().int().positive()
})  

export const CommentaryIdParamSchema = z.object({
    id: z.coerce.number().int().positive()
})  

  
export type CommentaryParam = z.infer<typeof MatchIdParamSchema>;