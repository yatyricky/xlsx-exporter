import xlsx = require("xlsx");
import Logger from "../Common/Logger";
import { CreateRule } from "../Common/RuleFactory";
import { IMap } from "../Common/TypeDef";
import { CreateType } from "../Common/TypeFactory";
import { EncodeCell, SafeGet } from "../Main";
import IRule from "../Rule/Rule";
import Enum from "../Type/Enum";
import { JSTypes } from "../Type/Type";
import IFieldDefine from "./FieldDefine";
import WorksheetParser from "./WorkSheetParser";

export default class WorkbookParser {
    private wb: xlsx.WorkBook;
    private name: string;
    private enums: Enum[];
    private sheets: WorksheetParser[];
    private enumSheetNames: string[];
    private dataSheetNames: string[];
    private enumByName: IMap<Enum>;

    public constructor(wb: xlsx.WorkBook, name: string) {
        this.wb = wb;
        this.name = name;
        // init
        this.enumSheetNames = [];
        this.dataSheetNames = [];
        this.enums = [];
        this.sheets = [];
        this.enumByName = {};

        this.cateAllNames();
        this.parseEnums();
        this.parseSheets();
    }

    private cateAllNames(): void {
        for (const sheetName of this.wb.SheetNames) {
            if (sheetName.charAt(0) === "@") {
                this.enumSheetNames.push(sheetName);
            } else {
                this.dataSheetNames.push(sheetName);
            }
        }
    }

    private parseEnums(): void {
        for (const e of this.enumSheetNames) {
            const sheet = this.wb.Sheets[e];
            const enumName = e.slice(1);
            const enumObj = new Enum(enumName);
            let r = 0;
            while (true) {
                const cell = SafeGet(sheet, r, 0);
                if (cell.length === 0) {
                    break;
                }
                enumObj.add(cell, SafeGet(sheet, r, 1));
                r++;
            }
            this.enums.push(enumObj);
            this.enumByName[enumName] = enumObj;
        }
    }

    private parseSheets(): void {
        for (const e of this.dataSheetNames) {
            const sheetParser = new WorksheetParser(e);
            const sheet = this.wb.Sheets[e];
            const columnsToUse: number[] = [];
            const dupCheckKey: IMap<boolean> = {};
            let c = 0;
            while (true) {
                // key
                const key = SafeGet(sheet, 0, c);
                if (key.length === 0) {
                    break;
                }
                if (key.charAt(0) === "#") {
                    c++;
                    continue;
                }
                if (dupCheckKey[key] === true) {
                    Logger.duplicate(`${this.name}[${e}] keys @${EncodeCell(0, c)}`);
                    c++;
                    continue;
                }
                const fdName = key;
                // type
                let typeStr = SafeGet(sheet, 1, c);
                if (typeStr.length === 0) {
                    typeStr = "string";
                }
                const fdType = CreateType(typeStr, this.enumByName);
                if (fdType === undefined) {
                    Logger.unknownType(`${this.name}[${e}] @${EncodeCell(1, c)}`);
                    c++;
                    continue;
                }
                // rules
                const preRules: IRule[] = [];
                const rulesStr = SafeGet(sheet, 2, c);
                if (rulesStr.length !== 0) {
                    const rulesToken = rulesStr.split(",").map((es) => es.trim());
                    for (const token of rulesToken) {
                        const parts = token.split(":").map((rs) => rs.trim());
                        const ruleName = parts[0];
                        const ruleValue = parts[1];
                        const rule = CreateRule(ruleName, ruleValue);
                        const cellPos = EncodeCell(2, c);
                        if (rule === undefined) {
                            Logger.unknownRule(`${this.name}[${e}] @${cellPos}`);
                            continue;
                        }
                        if (rule.error.length > 0) {
                            Logger.error(`${this.name}[${e}] ${rule.getErrors()} @${cellPos}`);
                            continue;
                        }
                        preRules.push(rule);
                    }
                }

                // all test passed
                columnsToUse.push(c);
                dupCheckKey[key] = true;

                const fd: IFieldDefine<JSTypes> = {
                    type: fdType,
                    name: fdName,
                };

                sheetParser.add({
                    define: fd,
                    rules: preRules,
                });

                c++;
            }

            let r = 4;
            while (true) {
                
            }

            for (const col of columnsToUse) {
                
            }


            // rule check
            for (const fdr of sheetParser.fieldDefineRules) {
                fdr.rules
            }

            this.sheets.push(sheetParser);
        }
    }
}
