local config = {}

config.EnumCareerType = {}
config.EnumCareerType.Tank = 1
config.EnumCareerType.Healer = 2
config.EnumCareerType.DPS = 4
config.EnumCareerType.Minion = 8
config.EnumCareerType.Boss = 16
config.EnumCareerType.Creep = 32


config.EnumAttributeType = {}
config.EnumAttributeType.None = 0
config.EnumAttributeType.Strength = 1
config.EnumAttributeType.Agility = 2
config.EnumAttributeType.Intelligence = 3


---@class IUnitConfig
---@field UTID number
---@field PrimAtt AttributeType
---@field Str number
---@field Agi number
---@field Int number
---@field HP number
---@field MP number
---@field Ability number[]
---@field Item table<number, number>


---@type table<number, IUnitConfig>
config.UnitConfig = {
    [1331850337] = { UTID = 1331850337, PrimAtt = config.EnumAttributeType.Strength, Str = 15, Agi = 10, Int = 5, HP = 700, MP = 50, Ability = { 1095726955, 1095724393, 1095721842, 1095726967 }, Item = { [1919182130] = 1, [1920169009] = 2 } },
    [1164207469] = { UTID = 1164207469, PrimAtt = config.EnumAttributeType.Agility, Str = 9, Agi = 12, Int = 9, HP = 600, MP = 300, Ability = { 1095069026, 1095068013, 1095069029 }, Item = { [1835233141] = 1 } },
    [1214931305] = { UTID = 1214931305, PrimAtt = config.EnumAttributeType.Intelligence, Str = 7, Agi = 5, Int = 18, HP = 600, MP = 600, Ability = { 1097359994, 1095263859, 1095268197, 1095262562, 1095265652 }, Item = {  } },
}

---@class IUnitConfigExtras
---@field Key string
---@field Valid boolean
---@field Flag string[]
---@field Another string


---@type IUnitConfigExtras[]
config.UnitConfigExtras = {
    { Key = "unit_name", Valid = false, Flag = {  }, Another = "1" },
    { Key = "unit_type", Valid = true, Flag = { "1", "2", "3" }, Another = "1" },
    { Key = "unit_scale", Valid = true, Flag = { "a" }, Another = "Something" },
}

return config
