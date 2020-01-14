//! zinc
library UnitConfig {

    public struct EnumCareerType {
        static integer Tank = 1;
        static integer Healer = 2;
        static integer DPS = 4;
        static integer Minion = 8;
        static integer Boss = 16;
        static integer Creep = 32;
    }

    public struct EnumAttributeType {
        static integer None = 0;
        static integer Strength = 1;
        static integer Agility = 2;
        static integer Intelligence = 3;
    }



    public struct UnitConfig {
        private static Table ht;
        private static UnitConfig data[];

        integer UTID;
        integer PrimAtt;
        integer Str;
        integer Agi;
        integer Int;
        integer HP;
        integer MP;
        integer Ability;
         Item;
        static method get(integer id) -> thistype {
            return thistype.ht[id]
        }

        private static method create(integer UTID, integer PrimAtt, integer Str, integer Agi, integer Int, integer HP, integer MP, integer Ability,  Item) -> thistype {
            thistype this = thistype.allocate();
            this.UTID = UTID;
            this.PrimAtt = PrimAtt;
            this.Str = Str;
            this.Agi = Agi;
            this.Int = Int;
            this.HP = HP;
            this.MP = MP;
            this.Ability = Ability;
            this.Item = Item;
            return this;
        }

        private static method onInit() {
            thistype.ht = Table.create();
            thistype.ht['Obla'] = thistype.create('Obla', EnumAttributeType.Strength, 15, 10, 5, 700, 50, , ),
            thistype.ht['Edem'] = thistype.create('Edem', EnumAttributeType.Agility, 9, 12, 9, 600, 300, , ),
            thistype.ht['Hjai'] = thistype.create('Hjai', EnumAttributeType.Intelligence, 7, 5, 18, 600, 600, , ),

        }
    }



    public struct UnitConfigExtras {
        private static Table ht;
        private static UnitConfigExtras data[];

        string Key;
        boolean Valid;
        string Flag;
        string Another;
        static method get(integer id) -> thistype {
            return thistype.ht[id]
        }

        private static method create(string Key, boolean Valid, string Flag, string Another) -> thistype {
            thistype this = thistype.allocate();
            this.Key = Key;
            this.Valid = Valid;
            this.Flag = Flag;
            this.Another = Another;
            return this;
        }

        private static method onInit() {
            thistype.ht = Table.create();
            thistype.data[0] = thistype.create("unit_name", false, , "1"),
            thistype.data[1] = thistype.create("unit_type", true, , "1"),
            thistype.data[2] = thistype.create("unit_scale", true, , "Something"),

        }
    }

}
//! endzinc
