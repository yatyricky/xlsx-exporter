# Export Excel to Code or Config

Inspired by https://github.com/davyxu/tabtoy

Export excel(xlsx only) data to various languages or serialized data format.

# Workbook Schema

- Use xlsx
- Exported config name will be `ExampleConfig.ts` (say you are exporing `Example.xlsx` to typescript)
- Exported class name will be `<File name><Sheet name>Config`. The first worksheet name will be ommited
- Enums must be defined in worksheet named with "@Enum" if any

# Define Enums

The first 3 columns will be our interest.

Enum|Name|Value
---|---|---
CareerType|Tank|1
CareerType|Healer|2
CareerType|DPS|4
CareerType|Minion|8
CareerType|Boss|16
AttributeType|None|
AttributeType|Strength|
AttributeType|Agility|
AttributeType|Intelligence|

becomes

``` typescript
export enum CareerType {
    Tank = 1,
    Healer = 2,
    DPS = 4,
    Minion = 8,
    Boss = 16,
}

export enum AttributeType {
    None = 0,
    Strength = 1,
    Agility = 2,
    Intelligence = 3,
}

```

# Worksheet

#Name|UTID|PrimAtt|Str|Agi|Int|Ability|Ability|Item
---|---|---|---|---|---|---|---|---
||int256|AttributeType|int|int|int|int256[]|int256[]|map<int256,int>
|||Default:None|Default:0|Default:0|Default:0|||
Unit Name|Unit Type Id|Primary Attribute|Strength|Agility|Intelligence|Abilities|Abilities|Items
Blade Master|Obla|Strength|15|10|5|AOwk|AOww|rde2:1,rst1:2
Demon Hunter|Edem|Agility|9|12|9|AEmb||mcou:1
Archmage|Hjai|Intelligence|7|5|18|Ahbz,AHfs|AHwe|

becomes

``` typescript
export interface IUnitConfig {
    UTID: number;
    PrimAtt: AttributeType;
    Str: number;
    Agi: number;
    Int: number;
    Ability: number[];
    Item: { [key: number]: number };
}

export const UnitConfig: IUnitConfig[] = [
    { UTID: 1331850337, PrimAtt: AttributeType.Strength, Str: 15, Agi: 10, Int: 5, Ability: [1095726955, 1095726967], Item: { [1919182130]: 1, [1920169009]: 2 } },
    { UTID: 1164207469, PrimAtt: AttributeType.Agility, Str: 9, Agi: 12, Int: 9, Ability: [1095069026], Item: { [1835233141]: 1 } },
    { UTID: 1214931305, PrimAtt: AttributeType.Intelligence, Str: 7, Agi: 5, Int: 18, Ability: [1097359994, 1095263859, 1095265652], Item: {  } },
];

```

## Worksheet Frist Row

Defines field name.

- Served as identifier, so it must be a valid variable name
- Must be unique unless it's a collection type (array or map)
- Those start with `#` will be ignored (see the first column in the example above)

## Worksheet Second Row

Defines field type.

### List of valid primitive types:

- `int` integer type (don't care about bits for now). Defaults to 0
- `float` float type (same as int, because they are all `double` in js). Defaults to 0
- `int256` Warcraft 3 short formed int32. Defaults to 0
- `bool` boolean type. Defaults to false
- `string` string type. Defaults to empty string

### Enum types:

Just use the enum identifer you defined in the "@Enum" worksheet. Defaults to the first item of the enum.

### Collection types:

All columns with the same field name will be merged in the exported contents.

- Array: defined as `<Type>[]`. E.g. `int[]`, `string[]` ... Defaults to []
- Map: defined as `map<<Type>,<Type>>`. E.g. `map<string, float>`, `map<CareerType, int>` ... Defaults to {}

## Worksheet Third Row

Defines field rules. Rules are written as `<RuleType>(:<RuleValue>)?`. Multiple rules are separated by comma. E.g. `Unique,Default:0`

### Rules available:

- `Unique`: All values in this column must be unique
- `Index`: Exported data will become a map where value of this column will be served as the key. An `Index` rule is also a `Unique` rule
- `Default`: Overrides the default value of this column

## Worksheet rest rows

The fourth row is left for you.

Data starts from the **5th** row.

# Roadmap

- [x] Core
- [ ] Cli tool
- [ ] Lua
- [ ] vJass and Zinc
