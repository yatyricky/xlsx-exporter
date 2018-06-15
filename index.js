const xlsx = require("node-xlsx").default;
const assert = require("assert");

const col2Number = (col) => {
    let num = 0;
    for (let i = 0; i < col.length; i++) {
        num += (col.charCodeAt(i) - 64) * Math.pow(26, (col.length - i - 1));
    }
    return num;
};

const number2Col = (num) => {
    let sb = "";
    while (num > 0) {
        num --;
        let mod = num % 26;
        sb = String.fromCharCode(mod + 65) + sb;
        num = Math.floor(num / 26);
    }
    return sb;
};

const parseRef = (ref) => {
    const regex = /([A-Z]+)([1-9][0-9]*)/g;
    const match = regex.exec(ref);
    const row = parseInt(match[2]);
    const col = col2Number(match[1]);
    return {
        row: row - 1,
        col: col - 1
    };
};

const safeReturn = (arr, row, col, dataType) => {
    let res;
    if (arr.length <= row || row < 0) {
        console.warn(`[WARN]Row number out of bounds, rows: ${arr.length}, requested: ${row}(${row + 1})`);
        res = undefined;
    } else {
        if (arr[row].length <= col || col < 0) {
            console.warn(`[WARN]Column number out of bounds, columns: ${arr[row].length}, requested: ${col}(${number2Col(col + 1)})`);
            res = undefined;
        } else {
            res = arr[row][col];
        }
    }
    if (dataType === "number") {
        let parsed = parseFloat(res);
        if (isNaN(parsed)) {
            parsed = 0;
        }
        return parsed;
    } else {
        if (!res) {
            return "";
        } else {
            return res;
        }
    }
};

module.exports = (fpath) => {
    const raw = xlsx.parse(fpath);
    const sheets = {};
    for (let i = 0; i < raw.length; i++) {
        const sheet = raw[i];
        sheets[sheet.name] = {
            data: sheet.data,
            cell: (ref, dataType = "string") => {
                assert.strictEqual(dataType == "number" || dataType == "string", true);
                const index = parseRef(ref);
                return safeReturn(sheet.data, index.row, index.col, dataType);
            },
            cells: (ref, dataType = "string") => {
                assert.strictEqual(dataType == "number" || dataType == "string", true);
                const tokens = ref.split(":");
                const start = parseRef(tokens[0]);
                const end = parseRef(tokens[1]);
                const ret = [];
                for (let i = start.row; i <= end.row; i++) {
                    for (let j = start.col; j <= end.col; j++) {
                        ret.push(safeReturn(sheet.data, i, j, dataType));
                    }
                }
                return ret;
            },
            lookup: (col, val, valcol, dataType = "string") => {
                assert.strictEqual(dataType == "number" || dataType == "string", true);
                const index = col2Number(col) - 1;
                let f = -1;
                for (let j = 0; j < sheet.data.length && f === -1; j++) {
                    const row = sheet.data[j];
                    if (row.length > index && row[index] == val) {
                        f = j;
                    }
                }
                return safeReturn(sheet.data, f, col2Number(valcol) - 1, dataType);
            },
            matchCol: (row, header) => {
                row -= 1;
                if (row >= sheet.data.length || row < 0) {
                    console.warn(`[WARN]Row number out of bounds, rows: ${sheet.data.length}, requested: ${row}`);
                    return "";
                }
                let f = -1;
                for (let j = 0; j < sheet.data[row].length && f === -1; j++) {
                    const element = sheet.data[row][j];
                    if (element == header) {
                        f = j;
                    }
                }
                if (f === -1) {
                    console.warn(`[WARN]Unable to find ${header} in row ${row}(${row + 1})`);
                    return "";
                } else {
                    return number2Col(f + 1);
                }
            },
            matchRow: (col, header) => {
                let column = col2Number(col) - 1;
                let f = -1;
                for (let j = 0; j < sheet.data.length && f === -1; j++) {
                    if (sheet.data[j].length > column) {
                        if (sheet.data[j][column] == header) {
                            f = j;
                        }
                    }
                }
                if (f === -1) {
                    console.warn(`[WARN]Unable to find ${header} in column ${column}(${number2Col(col + 1)})`);
                    return -1;
                } else {
                    return f + 1;
                }
            }
        };
    }
    return {
        sheets: sheets
    };
};
