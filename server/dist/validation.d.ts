import { z } from "zod";
export declare const CreateMatchSchema: z.ZodObject<{
    sport: z.ZodString;
    homeTeam: z.ZodString;
    awayTeam: z.ZodString;
    status: z.ZodDefault<z.ZodEnum<{
        scheduled: "scheduled";
        live: "live";
        finished: "finished";
        postponed: "postponed";
        cancelled: "cancelled";
    }>>;
    startTime: z.ZodPipe<z.ZodString, z.ZodTransform<Date, string>>;
    endTime: z.ZodPipe<z.ZodString, z.ZodTransform<Date, string>>;
    homeScore: z.ZodDefault<z.ZodNumber>;
    awayScore: z.ZodDefault<z.ZodNumber>;
}, z.core.$strip>;
export type CreateMatchInput = z.input<typeof CreateMatchSchema>;
export type CreateMatchOutput = z.output<typeof CreateMatchSchema>;
export declare const MatchIdParamSchema: z.ZodObject<{
    id: z.ZodCoercedNumber<unknown>;
}, z.core.$strip>;
export type MatchIdParam = z.infer<typeof MatchIdParamSchema>;
export declare const CreateCommentarySchema: z.ZodObject<{
    matchId: z.ZodNumber;
    minute: z.ZodNumber;
    sequence: z.ZodNumber;
    period: z.ZodString;
    eventType: z.ZodString;
    actor: z.ZodString;
    team: z.ZodString;
    message: z.ZodString;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    tags: z.ZodOptional<z.ZodArray<z.ZodString>>;
}, z.core.$strip>;
export type CreateCommentaryInput = z.infer<typeof CreateCommentarySchema>;
export declare const CommentaryParamSchema: z.ZodObject<{
    matchId: z.ZodCoercedNumber<unknown>;
}, z.core.$strip>;
export declare const CommentaryIdParamSchema: z.ZodObject<{
    id: z.ZodCoercedNumber<unknown>;
}, z.core.$strip>;
export type CommentaryParam = z.infer<typeof MatchIdParamSchema>;
//# sourceMappingURL=validation.d.ts.map