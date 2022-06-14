import { IBet } from "./IBet";

export type statusCrash = "complete" | "graphing" | "waiting"
export interface CrashUpdate {
    "type": 'v1';
    "game": 'crash';
    "isRepeated": boolean;
    "id": string;
    "updated_at": string;
    "status": statusCrash;
    "crash_point": string | null;
    'bets'?: string[];
}
export interface CrashUpdateV2 {
    "type": 'v2';
    "game": 'crash';
    "isRepeated": boolean;
    "id": string;
    "updated_at": string;
    "status": statusCrash;
    "crash_point": string | null;
    "bets": IBet[];
    "total_eur_bet": string;
    "total_bets_placed": string;
    "total_bets_won": string | null;
}