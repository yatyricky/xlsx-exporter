import { IMap, JSTypes } from "../Common/TypeDef";
import { Indent } from "../Const";
import ILang from "../Exporter/Lang";
import { RuleType } from "../Rule/Rule";
import RuleSet from "../Rule/RuleSet";
import IType, { TypeCategory } from "../Type/TypeBase";
import IFieldDefine from "./FieldDefine";

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

    public exporter: ILang;

    public constructor(exporter: ILang, name: string) {
        this.name = name;
        this.interfaceName = name;
        this.fieldDefineRules = [];
        this.data = [];
        this.exporter = exporter;
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
            sb += `${Indent}${e.define.name}: ${this.exporter.typeString(e.define.type)};\n`;
        }
        sb += "}";
        return sb;
    }

    public tsName(): string {
        return this.name;
    }

    public tsVal(value: object): string {
        const indexFdr = this.getIndexFieldDefineRule();
        let sb: string;
        if (indexFdr) {
            sb = "{\n";
            for (const entry of this.data) {
                const indexVal = this.exporter.valueString(indexFdr.define.type, entry[indexFdr.define.name]);
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

    public luaDef(): string {
        let sb = `---@class ${this.interfaceName}\n`;
        const exportedKey: IMap<boolean> = {};
        for (const e of this.fieldDefineRules) {
            if (exportedKey[e.define.name]) {
                continue;
            }
            exportedKey[e.define.name] = true;
            sb += `---@field ${e.define.name} ${this.exporter.typeString(e.define.type)}\n`;
        }
        return sb;
    }

    public luaName(): string {
        return this.name;
    }

    public luaVal(value: object): string {
        const indexFdr = this.getIndexFieldDefineRule();
        let sb: string;
        sb = "{\n";
        if (indexFdr) {
            for (const entry of this.data) {
                const indexVal = this.exporter.valueString(indexFdr.define.type, entry[indexFdr.define.name]);
                sb += `${Indent}[${indexVal}] = ${this.luaEntry(entry)},\n`;
            }
        } else {
            for (const entry of this.data) {
                sb += `${Indent}${this.luaEntry(entry)},\n`;
            }
        }
        sb += "}";
        return sb;
    }

    public zincDef(): string {
        return "";
    }

    public zincName(): string {
        return this.name;
    }

    public zincVal(value: object): string {
        const indexFdr = this.getIndexFieldDefineRule();
        let sb: string;
        sb = "";
        if (indexFdr) {
            for (const entry of this.data) {
                const indexVal = this.exporter.valueString(indexFdr.define.type, entry[indexFdr.define.name]);
                sb += `${Indent}${Indent}${Indent}thistype.ht[${indexVal}] = ${this.zincEntry(entry)},\n`;
            }
        } else {
            for (let i = 0; i < this.data.length; i++) {
                const entry = this.data[i];
                sb += `${Indent}${Indent}${Indent}thistype.data[${i}] = ${this.zincEntry(entry)},\n`;
            }
        }
        return sb;
    }

    public wurstDef(): string {
        return "";
    }

    public wurstName(): string {
        return this.name;
    }

    public wurstVal(value: object): string {
        return "";
    }

    private zincEntry(entry: IMap<JSTypes>): string {
        const exportedKey: IMap<boolean> = {};
        const fields: string[] = [];
        for (const fdr of this.fieldDefineRules) {
            const type = fdr.define.type;
            const key = fdr.define.name;
            if (exportedKey[key]) {
                continue;
            }
            exportedKey[key] = true;
            fields.push(this.exporter.valueString(type, entry[key]));
        }
        return `thistype.create(${fields.join(", ")})`;
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
            fields.push(`${key}: ${this.exporter.valueString(type, entry[key])}`);
        }
        return `{ ${fields.join(", ")} }`;
    }

    private luaEntry(entry: IMap<JSTypes>): string {
        const exportedKey: IMap<boolean> = {};
        const fields: string[] = [];
        for (const fdr of this.fieldDefineRules) {
            const type = fdr.define.type;
            const key = fdr.define.name;
            if (exportedKey[key]) {
                continue;
            }
            exportedKey[key] = true;
            fields.push(`${key} = ${this.exporter.valueString(type, entry[key])}`);
        }
        return `{ ${fields.join(", ")} }`;
    }

}
