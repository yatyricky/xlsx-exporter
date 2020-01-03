import * as fs from "fs";
import * as path from "path";
import xlsx = require("xlsx");
import Logger from "./Common/Logger";

const { readFile, utils } = xlsx;
const { encode_row, encode_cell, encode_col } = utils;

export function SafeGet(sheet: xlsx.WorkSheet, r: number, c: number): string {
    const cell = sheet[encode_cell({ c, r })];
    if (!cell) {
        return "";
    }
    const t = cell.t;
    if (t === "z" || t === "e") {
        return "";
    }
    let v = cell.v;
    if (typeof (v) === "string") {
        v = v.trim();
    }
    return v.toString();
}

const outDir = path.join("src", "Game", "Configs");

// -- start of workbook

const filePath = "./configs/Unit.xlsx";

/** @type {IConfigObject} */
const configObj = {
    enums: [],
    data: [],
    other: {},
};

const wb = readFile(filePath);
/** @type {string[]} */
const enumSheets = [];
/** @type {string[]} */
const dataSheets = [];
/** @type {string[]} */
const wbEnums = [];
/** @type {{ [key: string]: Enum }} */
const enumByName = {};

// get sheets
for (const e of dataSheets) {
    const sheet = wb.Sheets[e];
    // filter out #
    /** @type {IColumnType[]} */
    const exportCols = [];
    /** @type {number} */
    let indexCol = -1;
    let col = 0;
    while (true) {
        // key
        const key = g(sheet, 0, col);
        if (key.length === 0) {
            break;
        }
        if (key.charCodeAt(0) === 35) {
            col++;
            continue;
        }
        const ictKey = key;
        // type
        let type = g(sheet, 1, col);
        if (type.length === 0) {
            type = "string";
        }
        const primTypeIndex = primTypes.indexOf(type);
        const wbEnumIndex = wbEnums.indexOf(type);
        const isPrimTypeIndex = primTypeIndex !== -1;
        const iswbEnumIndex = wbEnumIndex !== -1;
        if (!isPrimTypeIndex && !iswbEnumIndex) {
            throw new Error(`Unknown type @${filePath}[${e}]:${encode_cell({ r: 1, c: col })}`);
        }
        if (isPrimTypeIndex && iswbEnumIndex) {
            throw new Error(`Type matches multiple types @${filePath}[${e}]:${encode_cell({ r: 1, c: col })}`);
        }
        /** @type {IColumnTypeFieldType} */
        const ictType = {
            fType: type,
            fEnum: isPrimTypeIndex ? undefined : enumByName[type],
        };
        // rules
        const rules = g(sheet, 2, col);
        let ictIndex = false;
        let ictUnique = false;
        let ictDefaultVal;
        if (rules.length !== 0) {
            const rulesTokens = rules.split(",");
            for (const rulesToken of rulesTokens) {
                const ruleParts = rulesToken.split(":");
                const rule = ruleParts[0];
                const ruleValue = ruleParts[1];
                if (rule === "Index") {
                    ictIndex = true;
                    if (indexCol !== -1) {
                        throw new Error(`Multiple Index found @${filePath}[${e}]`);
                    }
                    indexCol = col;
                    ictUnique = true;
                } else if (rule === "Unique") {
                    ictUnique = true;
                } else if (rule === "Default") {
                    ictDefaultVal = ruleValue;
                } else {
                    throw new Error(`Unknown Rule ${rule} found @${filePath}[${e}]`);
                }
            }
        }

        /** @type {IColumnType} */
        const colTypeObj = {
            c: col++,
            key: ictKey,
            type: ictType,
            unique: ictUnique,
            index: ictIndex,
            defaultValue: ictDefaultVal,
        };

        exportCols.push(colTypeObj);
    }

    if (exportCols.length === 0) {
        logger.log(`Sheet is empty @${filePath}[${e}]`);
        continue;
    }

    /** @type {Array<{ index: IField, data: IField[] }>} */
    const obj = [];

    const firstIct = exportCols[0];
    let sheetRow = 4;
    /** @type {{ [key: number]: { [key: string]: boolean } }} */
    const uniqueMaps = {};
    while (true) {
        const firstCell = g(sheet, sheetRow, firstIct.c);
        if (firstCell.length === 0) {
            break;
        }
        /** @type {IField[]} */
        const entry = [];
        /** @type {IField} */
        let indexField = null;
        for (const ict of exportCols) {
            const validated = ictValidator(ict, g(sheet, sheetRow, ict.c), filePath, e, encode_cell({ r: sheetRow, c: ict.c }));
            if (ict.unique) {
                let currentMap = uniqueMaps[ict.c];
                if (!currentMap) {
                    uniqueMaps[ict.c] = {};
                    currentMap = uniqueMaps[ict.c];
                }
                if (currentMap[validated]) {
                    logger.log(`Duplicate value ${validated} @${filePath}[${e}]:${encode_cell({ r: sheetRow, c: ict.c })}`);
                } else {
                    currentMap[validated] = true;
                }
            }
            const entryField = {
                ictft: ict.type,
                value: validated,
            };
            if (ict.index) {
                indexField = entryField;
            }
            entry.push(entryField);
        }
        obj.push({
            index: indexField,
            data: entry,
        });
        sheetRow++;
    }

    if (wb.SheetNames.indexOf(e) === 0) {
        configObj.data = obj;
    } else {
        configObj.other[e] = obj;
    }
}

const baseFN = path.basename(filePath, ".xlsx");

// main
let sb = "";

for (const e of configObj.enums) {
    sb += e.toString() + "\n";
}

/** @type {Array<{ name: string, item: IRowEntry }>} */
const allItemTypes = [{ name: null, item: configObj.data }];
for (const key in configObj.other) {
    if (configObj.other.hasOwnProperty(key)) {
        const e = configObj.other[key];
        allItemTypes.push({ name: key, item: e });
    }
}

for (let i = 0; i < allItemTypes.length; i++) {
    const e = allItemTypes[i];
    let iName;
    if (i === 0) {
        iName = `I${baseFN}ConfigItem`;
    } else {
        iName = `I${baseFN}Config${e.name}Item`;
    }
    // sb += "export interface "
}

const first = configObj.data[0].data;

for (const e of configObj.data) {
    if (e.index) {
        
    }
}

const mainFN = path.join(outDir, baseFN + "Config_.ts");
fs.writeFileSync(mainFN, sb);
