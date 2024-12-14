export interface PlayerStats {
    ids: number[];
    rival: {
        name: string;
        matches: number;
    };
    setsWon: number;
    fullName: string;
    setsPlayed: number;
    outplacedSeed: number;
    tournamentWins: number;
    tournamentsWon: string[];
    topSevenFinishes: number;
    tournamentsAttended: string[];
}

export interface PlayerMapping {
    name: string;
    stats: PlayerStats;
}
