import * as fs from "fs";
import * as path from "path";
import xlsx = require("xlsx");
import Logger from "./Common/Logger";
import WorkbookParser from "./Component/WorkbookParser";

type Langs = "ts" | "lua" | "zinc" | "wurst";

const supportedLangs: Langs[] = ["ts", "lua", "zinc", "wurst"];

function printHelp(): void {
    Logger.log("Usage:");
    Logger.log(`xlsx-exporter <${supportedLangs.join("|")}> <input> [output]`);
    Logger.log("");
    Logger.log("Examples:");
    Logger.log("xlsx-exporter ts ./example/excel");
    Logger.log("xlsx-exporter ts ./example/excel ./example/exported");
    Logger.log("xlsx-exporter ts ./example/excel/UnitConfig.xlsx");
    Logger.log("xlsx-exporter ts ./example/excel/UnitConfig.xlsx ./example/exported");
}

const args = process.argv.splice(2);

const lang = args[0] as Langs;
const input = args[1];
const output = args[2];

if (args.length < 2) {
    printHelp();
    process.exit();
}

if (supportedLangs.indexOf(lang) === -1) {
    Logger.error("Supported langs: " + supportedLangs.join(","));
    process.exit();
}

if (!fs.existsSync(input)) {
    Logger.error("Input path does not exist.");
    process.exit();
}

const fileList: string[] = [];

const inputStat = fs.statSync(input);
if (inputStat.isDirectory()) {
    fileList.push(...fs.readdirSync(input).filter((e) => e.endsWith(".xlsx") && e.indexOf("~$") === -1).map((e) => path.join(input, e)));
    if (fileList.length === 0) {
        Logger.error("Target directory has no xlsx file.");
        process.exit();
    }
} else if (inputStat.isFile()) {
    if (input.endsWith(".xlsx")) {
        fileList.push(input);
    } else {
        Logger.error("Must specify an xlsx file.");
        process.exit();
    }
} else {
    Logger.error("Must specify input directory or file.");
    process.exit();
}

let outDir: string = path.dirname(fileList[0]);

if (output !== undefined) {
    if (!fs.existsSync(output)) {
        Logger.error("Output path does not exist.");
        process.exit();
    }
    const outputStat = fs.statSync(output);
    if (outputStat.isDirectory()) {
        outDir = output;
    } else {
        Logger.error("Output must be a directory.");
        process.exit();
    }
}

for (const file of fileList) {
    const baseFN = path.basename(file, ".xlsx");
    const wp = new WorkbookParser(lang, xlsx.readFile(file), baseFN);
    const outFp = path.join(outDir, baseFN + wp.exporter.extension);
    fs.writeFileSync(outFp, wp.toCode());
    Logger.success(outFp);
}
