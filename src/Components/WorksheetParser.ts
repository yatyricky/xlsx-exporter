import { Indent } from "../Const";
import IRule from "../Rule/Rule";
import IType, { JSTypes } from "../Type/Type";
import IFieldDefine from "./FieldDefine";

interface ISheetFieldRule<T extends JSTypes> {
    define: IFieldDefine<T>;
    rules: IRule[];
}

export default class WorksheetParser implements IType<object> {
    public name: string;
    public fieldDefineRules: Array<ISheetFieldRule<JSTypes>>;

    public constructor(name: string) {
        this.name = name;
        this.fieldDefineRules = [];
    }

    public add(fieldRule: ISheetFieldRule<JSTypes>): void {
        this.fieldDefineRules.push(fieldRule);
    }

    public default(): object {
        return {};
    }

    public match(strrep: string): boolean {
        return false;
    }

    public valueOf(strrep: string): object {
        return {};
    }

    public tsDef(): string {
        let sb = `export interface ${this.name} {\n`;
        for (const e of this.fieldDefineRules) {
            sb += `${Indent}${e.define.name}: ${e.define.type.tsName()}\n`;
        }
        sb += "}";
        return sb;
    }

    public tsName(): string {
        return this.name;
    }

    public tsVal(value: object): string {
        return "";
    }
}
