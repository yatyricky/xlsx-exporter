import { IMap, JSTypes } from "../Common/TypeDef";
import IField from "../Component/Field";
import WorksheetParser from "../Component/WorkSheetParser";
import { Indent } from "../Const";
import List from "../Type/List";
import IType, { TypeCategory } from "../Type/TypeBase";
import ILang from "./Lang";

export default class Zinc implements ILang {

    public extension = ".j";

    public head(name: string): string {
        return `//! zinc\nlibrary ${name} {`;
    }

    public tail(): string {
        return "}\n//! endzinc";
    }

    public typeDefString(type: IType<JSTypes>): string {
        return type.zincDef();
    }

    public typeString(type: IType<JSTypes>): string {
        return type.zincName();
    }

    public valueString(type: IType<JSTypes>, value: JSTypes): string {
        return type.zincVal(value);
    }

    public global(field: IField<JSTypes>): string {
        const { type, name } = field.fDef;
        let rhs: string;
        if (field.value) {
            rhs = this.valueString(type, type.valueOf(field.value));
        } else {
            rhs = this.valueString(type, type.default());
        }
        if (type.category === TypeCategory.Single) {
            return `${Indent}public constant ${this.typeString(type)} ${name} = ${rhs};`;
        } else {
            let sb = `${Indent}public constant ${this.typeString(type)} ${name}[];\n`;
            const items = type.valueOf(field.value) as JSTypes[];
            for (let i = 0; i < items.length; i++) {
                const e = items[i];
                sb += `${Indent}${name}[${i}] = ${this.valueString((type as List<JSTypes>).itemType, e)};\n`;
            }
            return sb;
        }
    }

    public sheet(field: IField<string>, sheet: WorksheetParser): string {
        const args: string[] = [];
        const assignment: string[] = [];
        const define: string[] = [];
        const exportedKey: IMap<boolean> = {};
        for (const e of sheet.fieldDefineRules) {
            if (exportedKey[e.define.name]) {
                continue;
            }
            exportedKey[e.define.name] = true;
            const typeStr = sheet.exporter.typeString(e.define.type);
            define.push(`${Indent}${Indent}${typeStr} ${e.define.name};`);
            args.push(`${typeStr} ${e.define.name}`);
            assignment.push(`${Indent}${Indent}${Indent}this.${e.define.name} = ${e.define.name};`);
        }

        let sb = "";
        sb += `${Indent}public struct ${field.fDef.name} {\n`;
        sb += `${Indent}${Indent}private static Table ht;\n`;
        sb += `${Indent}${Indent}private static ${field.fDef.name} data[];\n`;
        sb += "\n";
        sb += define.join("\n");
        sb += "\n";
        sb += `${Indent}${Indent}static method get(integer id) -> thistype {\n`;
        sb += `${Indent}${Indent}${Indent}return thistype.ht[id]\n`;
        sb += `${Indent}${Indent}}\n`;
        sb += "\n";
        sb += `${Indent}${Indent}private static method create(${args.join(", ")}) -> thistype {\n`;
        sb += `${Indent}${Indent}${Indent}thistype this = thistype.allocate();\n`;
        sb += assignment.join("\n") + "\n";
        sb += `${Indent}${Indent}${Indent}return this;\n`;
        sb += `${Indent}${Indent}}\n`;
        sb += "\n";
        sb += `${Indent}${Indent}private static method onInit() {\n`;
        sb += `${Indent}${Indent}${Indent}thistype.ht = Table.create();\n`;
        sb += `${field.value}\n`;
        sb += `${Indent}${Indent}}\n`;
        sb += `${Indent}}`;
        return sb;
    }
}

// let sb = `export interface ${this.interfaceName} {\n`;
// const exportedKey: IMap<boolean> = {};
// for (const e of this.fieldDefineRules) {
//     if (exportedKey[e.define.name]) {
//         continue;
//     }
//     exportedKey[e.define.name] = true;
//     sb += `${Indent}${e.define.name}: ${this.exporter.typeString(e.define.type)};\n`;
// }
// sb += "}";
// return sb;
