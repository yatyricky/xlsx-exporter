import xlsx = require("xlsx");

const { utils } = xlsx;
const { encode_cell } = utils;

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

export function EncodeCell(r: number, c: number): string {
    return encode_cell({ r, c });
}

export function ForeachRow(sheet: xlsx.WorkSheet, column: number, callback: (value: string, row: number, cell: string) => void, start: number = 0, end: number = NaN): void {
    while (true) {
        const cellValue = SafeGet(sheet, start, column);
        if (isNaN(end) && cellValue.length === 0) {
            break;
        }
        if (!isNaN(end) && start > end) {
            break;
        }
        callback(cellValue, start, EncodeCell(start, column));
        start++;
    }
}

export function ForeachCol(sheet: xlsx.WorkSheet, row: number, callback: (value: string, col: number, cell: string) => void, start: number = 0): void {
    while (true) {
        const cellValue = SafeGet(sheet, row, start);
        if (cellValue.length === 0) {
            break;
        }
        callback(cellValue, start, EncodeCell(row, start));
        start++;
    }
}

export function GetColumnRange(sheet: xlsx.WorkSheet, col: number, rowStart: number, rowEnd: number): string[] {
    const ret: string[] = [];
    ForeachRow(sheet, col, (value: string, row: number, cell: string) => {
        ret.push(value);
    }, rowStart, rowEnd);
    return ret;
}
