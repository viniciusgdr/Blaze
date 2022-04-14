import { IBet } from "./IBet";

export type statusCrash = "complete" | "graphing" | "waiting"
export interface CrashUpdate {
    "type": 'v1';
    "id": string;
    "updated_at": string;
    "status": statusCrash;
    "crash_point": string | null;
    'bets'?: string[];
}
export interface CrashUpdateV2 {
    "type": 'v2';
    "crash_point": string | null;
    "id": string;
    "status": statusCrash;
    "total_bets_placed": string;
    "total_eur_bet": string;
    "total_eur_won": string | null;
    "updated_at": string;
    "bets": IBet[];
}