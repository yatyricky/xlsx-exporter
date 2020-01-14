import { JSTypes } from "../Common/TypeDef";
import IField from "../Component/Field";
import IType from "../Type/TypeBase";
import ILang from "./Lang";

export default class Lua implements ILang {

    public extension = ".lua";

    public head(name: string): string {
        return "local config = {}";
    }

    public tail(): string {
        return "return config";
    }

    public typeDefString(type: IType<JSTypes>): string {
        return type.luaDef();
    }

    public typeString(type: IType<JSTypes>): string {
        return type.luaName();
    }

    public valueString(type: IType<JSTypes>, value: JSTypes): string {
        return type.luaVal(value);
    }

    public global(field: IField<JSTypes>): string {
        const { type, name } = field.fDef;
        let rhs: string;
        if (field.value) {
            rhs = this.valueString(type, type.valueOf(field.value));
        } else {
            rhs = this.valueString(type, type.default());
        }
        return `config.${name} = ${rhs} ---@type ${this.typeString(type)}`;
    }

    public sheet(field: IField<string>): string {
        return `---@type ${this.typeString(field.fDef.type)}\nconfig.${field.fDef.name} = ${field.value}`;
    }
}
