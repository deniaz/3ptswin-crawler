type Side = {
    team_id: number,
    score: number
};

export type Fixture = {
    id: number,
    timestamp: number,
    home: Side,
    away: Side,
};
