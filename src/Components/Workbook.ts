import xlsx = require("xlsx");
import { IMap } from "../Common/TypeDef";
import { SafeGet } from "../Main";
import Enum from "../Type/Enum";
import { WorkSheetParser } from "./WorkSheet";

export default interface IWorkbook {
    enums: Enum[];
    sheets: WorkSheetParser[];
}

export class WorkbookParser {
    private wb: xlsx.WorkBook;
    private book: IWorkbook;
    private enumSheetNames: string[];
    private dataSheetNames: string[];
    private enumByName: IMap<Enum>;

    public constructor(wb: xlsx.WorkBook) {
        this.wb = wb;
        // init
        this.enumSheetNames = [];
        this.dataSheetNames = [];
        this.book = {
            enums: [],
            sheets: [],
        };
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
            this.book.enums.push(enumObj);
            this.enumByName[enumName] = enumObj;
        }
    }

    private parseSheets(): void {
        for (const e of this.dataSheetNames) {
            this.book.sheets.push(new WorkSheetParser(this.wb.Sheets[e]));
        }
    }
}
