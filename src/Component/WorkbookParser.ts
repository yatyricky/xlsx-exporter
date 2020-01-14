import xlsx = require("xlsx");
import Logger from "../Common/Logger";
import { IMap, JSTypes } from "../Common/TypeDef";
import { EncodeCell, ForeachCol, ForeachRow, GetColumnRange, SafeGet } from "../Common/Utils";
import { CreateExporter } from "../Exporter/ExporterFactory";
import ILang from "../Exporter/Lang";
import RDefault from "../Rule/RDefault";
import { RuleType } from "../Rule/Rule";
import { CreateRule } from "../Rule/RuleFactory";
import RuleSet from "../Rule/RuleSet";
import RUnique from "../Rule/RUnique";
import Dictionary from "../Type/Dictionary";
import Enum from "../Type/Enum";
import List from "../Type/List";
import IType, { ICollection, TypeCategory } from "../Type/TypeBase";
import { CreateType } from "../Type/TypeFactory";
import IField from "./Field";
import WorksheetParser from "./WorkSheetParser";

const reservedSheetNames = ["@Enum", "@Global"];

export default class WorkbookParser {
    public exporter: ILang;
    private wb: xlsx.WorkBook;
    private name: string;
    private globals: Array<IField<JSTypes>>;
    private enums: IMap<Enum>;
    private sheets: WorksheetParser[];
    private dataSheetNames: string[];

    public constructor(lang: string, wb: xlsx.WorkBook, name: string) {
        this.exporter = CreateExporter(lang);
        this.wb = wb;
        this.name = name;
        // init
        this.dataSheetNames = [];
        this.sheets = [];
        this.enums = {};
        this.globals = [];

        this.cateAllNames();
        this.parseEnums();
        this.parseGlobals();
        this.parseSheets();
    }

    public toCode(): string {
        const sb: string[] = [];
        const list: string[] = [];
        if (this.exporter.head(this.name)) {
            sb.push(this.exporter.head(this.name));
        }
        // enums
        for (const key in this.enums) {
            if (this.enums.hasOwnProperty(key)) {
                list.push(this.exporter.typeDefString(this.enums[key]));
            }
        }
        if (list.length > 0) {
            sb.push(list.join("\n\n"));
        }
        // globals
        list.length = 0;
        for (const e of this.globals) {
            list.push(this.exporter.global(e));
        }
        if (list.length > 0) {
            sb.push(list.join("\n"));
        }
        // data
        list.length = 0;
        for (let i = 0; i < this.sheets.length; i++) {
            const sheet = this.sheets[i];
            let name: string;
            if (i === 0) {
                name = `${this.name}`;
            } else {
                name = `${this.name}${sheet.name}`;
            }
            const iName = "I" + name;
            this.enums[iName] = new Enum(iName);
            let configType: IType<JSTypes>;
            const ifdr = sheet.getIndexFieldDefineRule();
            if (ifdr) {
                configType = new Dictionary(ifdr.define.type as IType<string | number>, this.enums[iName]);
            } else {
                configType = new List(this.enums[iName]);
            }
            sheet.interfaceName = iName;
            let part = "";
            part += this.exporter.typeDefString(sheet) + "\n\n";
            part += this.exporter.sheet({
                fDef: {
                    type: configType,
                    name,
                },
                value: this.exporter.valueString(sheet, {}),
            }, sheet);
            list.push(part);
        }
        if (list.length > 0) {
            sb.push(list.join("\n\n"));
        }
        if (this.exporter.tail()) {
            sb.push(this.exporter.tail());
        }
        return sb.join("\n\n") + "\n";
    }

    private cateAllNames(): void {
        for (const sheetName of this.wb.SheetNames) {
            if (reservedSheetNames.indexOf(sheetName) === -1) {
                this.dataSheetNames.push(sheetName);
            }
        }
    }

    private parseEnums(): void {
        const sheet = this.wb.Sheets["@Enum"];
        if (!sheet) {
            return;
        }
        ForeachRow(sheet, 0, (value: string, row: number) => {
            if (!this.enums[value]) {
                this.enums[value] = new Enum(value);
            }
            const enumObj = this.enums[value];
            const enumItemType = CreateType(SafeGet(sheet, row, 2), {});
            const valueField = SafeGet(sheet, row, 3);
            if (valueField.length === 0) {
                enumObj.add(SafeGet(sheet, row, 1), "");
            } else {
                if (enumItemType === undefined) {
                    enumObj.add(SafeGet(sheet, row, 1), valueField);
                } else if (this.exporter.typeString(enumItemType) === "number") {
                    enumObj.add(SafeGet(sheet, row, 1), enumItemType.valueOf(valueField).toString());
                } else {
                    Logger.warn("Enum value type must be int or int256");
                    enumObj.add(SafeGet(sheet, row, 1), "");
                }
            }
        }, 1);
    }

    private parseGlobals(): void {
        const sheet = this.wb.Sheets["@Global"];
        if (!sheet) {
            return;
        }
        const names: string[] = [];
        ForeachRow(sheet, 0, (value: string, row: number) => {
            names.push(value);
        }, 1);
        const unique = new RUnique();
        if (!unique.execute(names)) {
            return Logger.duplicate(`${this.name}[@Global] Field names`);
        }
        ForeachRow(sheet, 0, (value: string, row: number, cell: string) => {
            const typeName = SafeGet(sheet, row, 1) || "string";
            const type = CreateType(typeName, this.enums);
            if (type === undefined) {
                return Logger.unknownType(`${this.name}[@Global] @ ${EncodeCell(row, 1)}`);
            }
            this.globals.push({
                fDef: {
                    type,
                    name: value,
                },
                value: SafeGet(sheet, row, 2),
            });
        }, 1);
    }

    private parseSheets(): void {
        for (const e of this.dataSheetNames) {
            const sheetParser = new WorksheetParser(this.exporter, e);
            const sheet = this.wb.Sheets[e];
            const dupCheckKey: IMap<TypeCategory> = {};
            const allRuleSets: RuleSet[] = [];

            // find first non-comment column
            let firstActiveColumn = -1;
            ForeachCol(sheet, 0, (value: string, col: number) => {
                if (value.charAt(0) === "#") {
                    return;
                }
                if (firstActiveColumn === -1) {
                    firstActiveColumn = col;
                }
            });
            // find largest active row number
            let rowEnd = 3;
            ForeachRow(sheet, firstActiveColumn, (value: string, row: number) => {
                rowEnd = row;
            }, 4);

            ForeachCol(sheet, 0, (value: string, col: number, cell: string) => {
                if (value.charAt(0) === "#") {
                    return;
                }
                // type
                const typeStr = SafeGet(sheet, 1, col);
                if (typeStr.length === 0) {
                    return Logger.empty(`${this.name}[${e}]@${EncodeCell(1, col)}`);
                }
                const fdType = CreateType(typeStr, this.enums);
                if (fdType === undefined) {
                    return Logger.unknownType(`${this.name}[${e}] @${EncodeCell(1, col)}`);
                }
                if (dupCheckKey[value]) {
                    if (dupCheckKey[value] === TypeCategory.Single || fdType.category !== dupCheckKey[value]) {
                        return Logger.duplicate(`${this.name}[${e}] field name @${EncodeCell(0, col)}`);
                    }
                } else {
                    dupCheckKey[value] = fdType.category;
                }
                const fdName = value;
                // rules
                const rawRules: RuleSet = new RuleSet();
                const rulesStr = SafeGet(sheet, 2, col);
                if (rulesStr.length !== 0) {
                    const rulesToken = rulesStr.split(",");
                    for (const token of rulesToken) {
                        const parts = token.split(":").map((rs) => rs.trim());
                        const ruleName = parts[0];
                        const ruleValue = parts[1];
                        const rule = CreateRule(ruleName, ruleValue, fdType);
                        const cellPos = EncodeCell(2, col);
                        if (rule === undefined) {
                            return Logger.unknownRule(`${this.name}[${e}] @${cellPos}`);
                        }
                        if (rule.error.length > 0) {
                            return Logger.error(`${this.name}[${e}] ${rule.getErrors().join(" ; ")} @${cellPos}`);
                        }
                        rawRules.add(rule);
                    }
                }
                rawRules.validate(sheet, col, fdType, 4, rowEnd);
                if (rawRules.error.length > 0) {
                    return Logger.error(`${this.name}[${e}] ${rawRules.getErrors().join(" ; ")} @${cell}`);
                }

                // all test passed
                sheetParser.add({
                    define: {
                        type: fdType,
                        name: fdName,
                    },
                    ruleSet: rawRules,
                    column: col,
                });
                allRuleSets.push(rawRules);
            });

            const cache1: boolean[] = [];
            // rule sets cross check
            for (let i = 0; i < sheetParser.fieldDefineRules.length - 1; i++) {
                for (let j = i + 1; j < sheetParser.fieldDefineRules.length; j++) {
                    const lhs = sheetParser.fieldDefineRules[i];
                    const rhs = sheetParser.fieldDefineRules[j];
                    // 1. single index
                    if (cache1[i] === undefined) {
                        cache1[i] = lhs.ruleSet.rules.some((er) => er.type === RuleType.Index);
                    }
                    if (cache1[j] === undefined) {
                        cache1[j] = rhs.ruleSet.rules.some((er) => er.type === RuleType.Index);
                    }
                    if (cache1[i] && cache1[j]) {
                        return Logger.duplicate(`${this.name}[${e}] Rule:Index @${EncodeCell(2, i)} and ${EncodeCell(2, j)}`);
                    }
                }
            }

            const cache2: Array<RDefault | null> = [];
            for (let row = 4; row <= rowEnd; row++) {
                const newObj: IMap<JSTypes> = {};
                for (const fdr of sheetParser.fieldDefineRules) {
                    const colType = fdr.define.type;
                    const value = SafeGet(sheet, row, fdr.column);
                    let nativeValue: JSTypes;
                    if (value.length !== 0) {
                        nativeValue = colType.valueOf(value);
                    } else {
                        if (cache2[fdr.column] === undefined) {
                            const findDefaultRule = fdr.ruleSet.rules.filter((er) => er.type === RuleType.Default)[0];
                            cache2[fdr.column] = findDefaultRule as RDefault || null;
                        }
                        const ruleDefault = cache2[fdr.column];
                        if (ruleDefault) {
                            nativeValue = colType.valueOf(ruleDefault.defaultVal);
                        } else {
                            nativeValue = colType.default();
                        }
                    }
                    if (newObj[fdr.define.name] !== undefined) {
                        // arrays and objects
                        const current = colType as ICollection;
                        current.merge(newObj[fdr.define.name], nativeValue);
                    } else {
                        newObj[fdr.define.name] = nativeValue;
                    }
                }
                sheetParser.feed(newObj);
            }

            for (const fdr of sheetParser.fieldDefineRules) {
                fdr.ruleSet.execute(GetColumnRange(sheet, fdr.column, 4, rowEnd));
                if (fdr.ruleSet.error.length > 0) {
                    return Logger.error(`${this.name}[${e}] RuleSet failed column ${fdr.column}. Rules: ${fdr.ruleSet.getErrors().join(",")}`);
                }
            }

            this.sheets.push(sheetParser);
        }
    }
}
