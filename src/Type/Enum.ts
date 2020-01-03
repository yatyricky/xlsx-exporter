import { IMap } from "../Common/TypeDef";
import { Indent } from "../Const";
import IType from "./Type";

interface IEnumItem {
    name: string;
    value: number;
}

export default class Enum implements IType<string> {
    public name: string;
    public nameMap: IMap<boolean>;
    public items: IEnumItem[];

    /**
     * @param {string} name
     */
    constructor(name: string) {
        this.name = name;
        this.nameMap = {};
        this.items = [];
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
        if (value === "") {
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
}
