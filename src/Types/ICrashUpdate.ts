export interface CrashUpdate {
    "id": string;
    "updated_at": string;
    "status": "complete" | "graphing" | "waiting";
    "crash_point": string | null;
    'bets'?: string[];
}