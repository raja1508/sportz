import {
    pgTable,
    serial,
    integer,
    varchar,
    text,
    timestamp,
    pgEnum,
    jsonb,
  } from "drizzle-orm/pg-core";
  import { relations } from "drizzle-orm";
  
  // ─── Enums ────────────────────────────────────────────────────────────────────
  
  export const matchStatusEnum = pgEnum("match_status", [
    "scheduled",
    "live",
    "finished",
    "postponed",
    "cancelled",
  ]);
  
  // ─── Matches ──────────────────────────────────────────────────────────────────
  
  export const matches = pgTable("matches", {
    id:        serial("id").primaryKey(),
    sport:     varchar("sport", { length: 64 }).notNull(),
    homeTeam:  varchar("home_team", { length: 128 }).notNull(),
    awayTeam:  varchar("away_team", { length: 128 }).notNull(),
    status:    matchStatusEnum("status").notNull().default("scheduled"),
    startTime: timestamp("start_time", { withTimezone: true }).notNull(),
    endTime:   timestamp("end_time",   { withTimezone: true }).notNull(),
    homeScore: integer("home_score").notNull().default(0),
    awayScore: integer("away_score").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true })
                 .notNull()
                 .defaultNow(),
  });
  
  // ─── Commentary ───────────────────────────────────────────────────────────────
  
  export const commentary = pgTable("commentary", {
    id:        serial("id").primaryKey(),
    matchId:   integer("match_id")
                 .notNull()
                 .references(() => matches.id, { onDelete: "cascade" }),
    minute:    integer("minute").notNull(),
    sequence:  integer("sequence").notNull(),
    period:    varchar("period", { length: 64 }).notNull(),   // "1st half", "2nd half", "1st innings" …
    eventType: varchar("event_type", { length: 64 }).notNull(), // "goal", "wicket", "run" …
    actor:     varchar("actor", { length: 128 }).notNull(),   // player name
    team:      varchar("team",  { length: 128 }).notNull(),   // team name
    message:   text("message").notNull(),
    metadata:  jsonb("metadata").$type<Record<string, unknown>>(),
    tags:      jsonb("tags").$type<string[]>(),
    createdAt: timestamp("created_at", { withTimezone: true })
                 .notNull()
                 .defaultNow(),
  });
  
  // ─── Relations ────────────────────────────────────────────────────────────────
  
  export const matchesRelations = relations(matches, ({ many }) => ({
    commentary: many(commentary),
  }));
  
  export const commentaryRelations = relations(commentary, ({ one }) => ({
    match: one(matches, {
      fields:     [commentary.matchId],
      references: [matches.id],
    }),
  }));
  
  // ─── Inferred Types ───────────────────────────────────────────────────────────
  
  import type { InferSelectModel, InferInsertModel } from "drizzle-orm";
  
  export type Match             = InferSelectModel<typeof matches>;
  export type NewMatch          = InferInsertModel<typeof matches>;
  export type Commentary        = InferSelectModel<typeof commentary>;
  export type NewCommentary     = InferInsertModel<typeof commentary>;