import { IMap } from "../Common/TypeDef";
import { Indent } from "../Const";
import Int from "./Int";
import IType, { TypeCategory } from "./TypeBase";

interface IEnumItem {
    name: string;
    value: number;
}

export default class Enum implements IType<string> {

    public category: TypeCategory = TypeCategory.Single;
    public name: string;
    public nameMap: IMap<boolean>;
    public items: IEnumItem[];
    private intTest: IType<number>;

    /**
     * @param {string} name
     */
    constructor(name: string) {
        this.name = name;
        this.nameMap = {};
        this.items = [];
        this.intTest = new Int();
    }

    public default(): string {
        if (this.items.length === 0) {
            throw new Error();
        }
        return this.items[0].name;
    }

    public valueOf(strrep: string): string {
        if (this.match(strrep)) {
            return strrep;
        } else {
            throw new Error();
        }
    }

    public add(name: string, value: string): void {
        let val: number;
        if (!this.intTest.match(value)) {
            val = this.items.length;
        } else {
            val = parseInt(value, 10);
        }
        this.items.push({ name, value: val });
        this.nameMap[name] = true;
    }

    public match(strrep: string): boolean {
        return this.nameMap[strrep] === true;
    }

    public tsDef(): string {
        let sb = `export enum ${this.name} {\n`;
        for (const e of this.items) {
            sb += `${Indent}${e.name} = ${e.value},\n`;
        }
        sb += "}";
        return sb;
    }

    public tsName(): string {
        return this.name;
    }

    public tsVal(strrep: string): string {
        return this.name + "." + strrep;
    }

    public luaDef(): string {
        let sb = `config.Enum${this.name} = {}\n`;
        for (const e of this.items) {
            sb += `config.Enum${this.name}.${e.name} = ${e.value}\n`;
        }
        return sb;
    }

    public luaName(): string {
        return this.name;
    }

    public luaVal(value: string): string {
        return "config.Enum" + this.name + "." + value;
    }

    public zincDef(): string {
        let sb = `${Indent}public struct Enum${this.name} {\n`;
        for (const e of this.items) {
            sb += `${Indent}${Indent}static integer ${e.name} = ${e.value};\n`;
        }
        sb += `${Indent}}`;
        return sb;
    }

    public zincName(): string {
        return "integer";
    }

    public zincVal(value: string): string {
        return "Enum" + this.name + "." + value;
    }

    public wurstDef(): string {
        let sb = `enum ${this.name}\n`;
        for (const e of this.items) {
            sb += `${Indent}${e.name} = ${e.value}\n`;
        }
        return sb;
    }

    public wurstName(): string {
        return this.name;
    }

    public wurstVal(value: string): string {
        return "Enum" + this.name + "." + value;
    }

}
