import { IBet } from ".";

export type statusdoubles = "complete" | "rolling" | "waiting"
export interface DoubleUpdate {
    "type": 'v1';
    "game": 'doubles';
    "isRepeated": boolean;
    "id": string;
    "updated_at": string;
    "status": statusdoubles;
    'bets'?: string[];
    'color': number | null;
    'roll': number | null;
}
export interface DoubleUpdateV2 {
    "type": 'v2';
    "game": 'doubles';
    "isRepeated": boolean;
    "id": string;
    "color": number | null;
    "roll": number | null;
    "created_at": Date;
    "updated_at": Date;
    "status": statusdoubles;
    "bets": IBet[];

    "total_red_eur_bet": number | null;
    "total_red_bets_placed": number | null;
    "total_white_eur_bet": number | null;
    "total_white_bets_placed": number | null;
    "total_black_eur_bet": number | null;
    "total_black_bets_placed": number | null;
}