import { IBet } from ".";

export type statusdoubles = "complete" | "rolling" | "waiting"
export interface DoubleUpdate {
    "type": 'v1';
    "id": string;
    "updated_at": string;
    "status": statusdoubles;
    'bets'?: string[];
    'color': number | null;
    'roll': number | null;
}
export interface DoubleUpdateV2 {
    "type": 'v2';
    "bets": IBet[];
    "color": number | null;
    "created_at": string;
    "id": string;
    "roll": number | null;
    "status": statusdoubles;
    "updated_at": string;
}