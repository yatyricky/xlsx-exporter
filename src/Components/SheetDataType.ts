import { Indent } from "../Const";
import IType, { JSTypes } from "../Type/Type";
import IFieldDefine from "./FieldDefine";
import IRuleType from "./RuleType";

interface ISheetFieldRule<T extends JSTypes> {
    define: IFieldDefine<T>;
    rule: IRuleType;
    default: T;
}

export default class SheetDataType implements IType<object> {
    public name: string;
    public fieldDefines: Array<ISheetFieldRule<JSTypes>>;

    public constructor(name: string) {
        this.name = name;
        this.fieldDefines = [];
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
        for (const e of this.fieldDefines) {
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
