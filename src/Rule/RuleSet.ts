import xlsx = require("xlsx");
import ErrorReporter from "../Common/ErrorReporter";
import { JSTypes } from "../Common/TypeDef";
import { ForeachRow } from "../Common/Utils";
import IType from "../Type/TypeBase";
import Rule, { RuleType } from "./Rule";

export default class RuleSet extends ErrorReporter {

    public rules: Rule[];

    constructor() {
        super();
        this.rules = [];
    }

    public add(rule: Rule): void {
        this.rules.push(rule);
    }

    public validate(sheet: xlsx.WorkSheet, col: number, fieldType: IType<JSTypes>, rowStart: number, rowEnd: number): void {
        if (this.rules.length === 0) {
            return;
        }
        // overlap check
        for (let i = 0; i < this.rules.length - 1; i++) {
            for (let j = i + 1; j < this.rules.length; j++) {
                if (this.rules[i].overlapWith(this.rules[j])) {
                    this.error.push(RuleType[this.rules[i].type]);
                }
            }
        }
        // rule self check
        for (const rule of this.rules) {
            rule.execute();
            this.error.push(...rule.getErrors());
        }
        // data check
        ForeachRow(sheet, col, (value: string, row: number, cell: string) => {
            if (value.length === 0) {
                return;
            }
            if (fieldType.match(value)) {
                return;
            }
            this.error.push(`Type mismatch @${cell}`);
        }, rowStart, rowEnd);
    }
}
