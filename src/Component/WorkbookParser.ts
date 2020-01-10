import xlsx = require("xlsx");
import Logger from "../Common/Logger";
import { IMap, JSTypes } from "../Common/TypeDef";
import { EncodeCell, ForeachCol, ForeachRow, SafeGet } from "../Common/Utils";
import RDefault from "../Rule/RDefault";
import { RuleType } from "../Rule/Rule";
import { CreateRule } from "../Rule/RuleFactory";
import RuleSet from "../Rule/RuleSet";
import Enum from "../Type/Enum";
import { ICollection, TypeCategory } from "../Type/TypeBase";
import { CreateType } from "../Type/TypeFactory";
import WorksheetParser from "./WorkSheetParser";

export default class WorkbookParser {
    private wb: xlsx.WorkBook;
    private name: string;
    private enums: IMap<Enum>;
    private sheets: WorksheetParser[];
    private dataSheetNames: string[];

    public constructor(wb: xlsx.WorkBook, name: string) {
        this.wb = wb;
        this.name = name;
        // init
        this.dataSheetNames = [];
        this.sheets = [];
        this.enums = {};

        this.cateAllNames();
        this.parseEnums();
        this.parseSheets();
    }

    public toTs(): string {
        let sb = "";
        const list: string[] = [];
        for (const key in this.enums) {
            if (this.enums.hasOwnProperty(key)) {
                list.push(this.enums[key].tsDef());
            }
        }
        sb += list.join("\n\n") + "\n";
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
            let configType: string;
            const ifdr = sheet.getIndexFieldDefineRule();
            if (ifdr) {
                configType = `{ [key: ${ifdr.define.type.tsName()}]: ${iName} }`;
            } else {
                configType = `${iName}[]`;
            }
            sheet.interfaceName = iName;
            let part = "";
            part += sheet.tsDef() + "\n\n";
            part += `export const ${name}: ${configType} = ${sheet.tsVal()};`;
            list.push(part);
        }
        sb += "\n" + list.join("\n\n") + "\n";
        return sb;
    }

    private cateAllNames(): void {
        for (const sheetName of this.wb.SheetNames) {
            if (sheetName !== "@Enum") {
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
            enumObj.add(SafeGet(sheet, row, 1), SafeGet(sheet, row, 2));
        }, 1);
    }

    private parseSheets(): void {
        for (const e of this.dataSheetNames) {
            const sheetParser = new WorksheetParser(e);
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
            this.sheets.push(sheetParser);
        }
    }
}
