export interface TournamentPlacement {
    placement: number | null;
    tournamentName: string | null;
}

export interface BracketStats {
    rival: {
        tag: string;
        matches: number;
    } | null;
    setsWon: number;
    setsPlayed: number;
    bracketsWon: number;
    bracketCount: number;
    bestPlacement: TournamentPlacement;
    topEightFinishes: number;
    timesOutplacedSeed: number;
}

export interface PlayerStats {
    main: BracketStats;
    redemption: BracketStats;
    tournamentsAttended: number;
}

export interface PlayerMapping {
    name: string;
    stats: PlayerStats;
}
