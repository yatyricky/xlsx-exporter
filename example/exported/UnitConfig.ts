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
    Ability: number[];
    Item: { [key: number]: number };
}

export const UnitConfig: { [key: number]: IUnitConfig } = {
    [1331850337]: { UTID: 1331850337, PrimAtt: AttributeType.Strength, Str: 15, Agi: 10, Int: 5, HP: 700, MP: 50, Ability: [1095726955, 1095724393, 1095721842, 1095726967], Item: { [1919182130]: 1, [1920169009]: 2 } },
    [1164207469]: { UTID: 1164207469, PrimAtt: AttributeType.Agility, Str: 9, Agi: 12, Int: 9, HP: 600, MP: 300, Ability: [1095069026, 1095068013, 1095069029], Item: { [1835233141]: 1 } },
    [1214931305]: { UTID: 1214931305, PrimAtt: AttributeType.Intelligence, Str: 7, Agi: 5, Int: 18, HP: 600, MP: 600, Ability: [1097359994, 1095263859, 1095268197, 1095262562, 1095265652], Item: {  } },
};

export interface IUnitConfigExtras {
    Key: string;
    Valid: boolean;
    Flag: string[];
    Another: string;
}

export const UnitConfigExtras: { [key: string]: IUnitConfigExtras } = {
    ["unit_name"]: { Key: "unit_name", Valid: false, Flag: [], Another: "1" },
    ["unit_type"]: { Key: "unit_type", Valid: true, Flag: ["1", "2", "3"], Another: "1" },
    ["unit_scale"]: { Key: "unit_scale", Valid: true, Flag: ["a"], Another: "Something" },
};
