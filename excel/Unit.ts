export enum CareerType {
    Tank = 1,
    Healer = 2,
    DPS = 4,
    Minion = 8,
    Boss = 16,
    Creep = 32,
}

export enum AttributeType {
    None = 0,
    Strength = 1,
    Agility = 2,
    Intelligence = 3,
}

export interface IUnitConfig {
    UTID: number;
    PrimAtt: AttributeType;
    Str: number;
    Agi: number;
    Int: number;
    HP: number;
    MP: number;
    Def: number;
    Dodge: number;
    Crit: number;
    Career: CareerType;
    Ability: number[];
    Item: { [key: number]: number };
}

export const UnitConfig: { [key: number]: IUnitConfig } = {
    [1331850337]: { UTID: 1331850337, PrimAtt: AttributeType.Strength, Str: 15, Agi: 10, Int: 5, HP: 700, MP: 50, Def: 0.1, Dodge: 0.25, Crit: 0.1, Career: CareerType.Tank, Ability: [1095726955, 1095724393, 1095721842, 1095726967], Item: { [1919182130]: 1, [1920169009]: 2 } },
    [1164207469]: { UTID: 1164207469, PrimAtt: AttributeType.Agility, Str: 9, Agi: 12, Int: 9, HP: 600, MP: 300, Def: 0.15, Dodge: 0.35, Crit: 0.2, Career: CareerType.DPS, Ability: [1095069026, 1095068013, 1095069029], Item: { [1835233141]: 1 } },
    [1214931305]: { UTID: 1214931305, PrimAtt: AttributeType.Intelligence, Str: 7, Agi: 5, Int: 18, HP: 600, MP: 600, Def: 0.05, Dodge: 0.03, Crit: 0.05, Career: CareerType.DPS, Ability: [1097359994, 1095263859, 1095268197, 1095262562, 1095265652], Item: {  } },
};
