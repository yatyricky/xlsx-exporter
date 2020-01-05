import { Indent } from "../Const";
import IType, { TypeCategory } from "../Type/TypeBase";
import IFieldDefine from "./FieldDefine";
import { JSTypes, IMap } from "../Common/TypeDef";
import RuleSet from "../Rule/RuleSet";
import { RuleType } from "../Rule/Rule";

interface ISheetFieldRule<T extends JSTypes> {
    define: IFieldDefine<T>;
    ruleSet: RuleSet;
    column: number;
}

export default class WorksheetParser implements IType<object> {

    public category: TypeCategory = TypeCategory.Single;
    public name: string;
    public interfaceName: string;
    public fieldDefineRules: Array<ISheetFieldRule<JSTypes>>;
    public data: Array<IMap<JSTypes>>;

    public constructor(name: string) {
        this.name = name;
        this.interfaceName = name;
        this.fieldDefineRules = [];
        this.data = [];
    }

    public add(fieldRule: ISheetFieldRule<JSTypes>): void {
        this.fieldDefineRules.push(fieldRule);
    }

    public feed(entry: IMap<JSTypes>): void {
        this.data.push(entry);
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

    public getIndexFieldDefineRule(): ISheetFieldRule<JSTypes> | undefined {
        for (const fdr of this.fieldDefineRules) {
            for (const rule of fdr.ruleSet.rules) {
                if (rule.type === RuleType.Index) {
                    return fdr;
                }
            }
        }
        return undefined;
    }

    public tsDef(): string {
        let sb = `export interface ${this.interfaceName} {\n`;
        const exportedKey: IMap<boolean> = {};
        for (const e of this.fieldDefineRules) {
            if (exportedKey[e.define.name]) {
                continue;
            }
            exportedKey[e.define.name] = true;
            sb += `${Indent}${e.define.name}: ${e.define.type.tsName()};\n`;
        }
        sb += "}";
        return sb;
    }

    public tsName(): string {
        return this.name;
    }

    public tsVal(value: object | void): string {
        let indexFdr = this.getIndexFieldDefineRule();
        let sb: string;
        if (indexFdr) {
            sb = "{\n";
            for (const entry of this.data) {
                const indexVal = indexFdr.define.type.tsVal(entry[indexFdr.define.name]);
                sb += `${Indent}[${indexVal}]: ${this.tsEntry(entry)},\n`;
            }
            sb += "}";
        } else {
            sb = "[\n";
            for (const entry of this.data) {
                sb += `${Indent}${this.tsEntry(entry)},\n`;
            }
            sb += "]";
        }
        return sb;
    }

    private tsEntry(entry: IMap<JSTypes>): string {
        const exportedKey: IMap<boolean> = {};
        const fields: string[] = [];
        for (const fdr of this.fieldDefineRules) {
            const type = fdr.define.type;
            const key = fdr.define.name;
            if (exportedKey[key]) {
                continue;
            }
            exportedKey[key] = true;
            fields.push(`${key}: ${type.tsVal(entry[key])}`)
        }
        return `{ ${fields.join(", ")} }`;
    }

}
