import * as fs from "fs";
import * as path from "path";
import xlsx = require("xlsx");
import Logger from "./Common/Logger";
import WorkbookParser from "./Component/WorkbookParser";

function printHelp(): void {
    Logger.log("Usage:");
    Logger.log("xlsx-exporter <input> [output]");
    Logger.log("");
    Logger.log("Examples:");
    Logger.log("xlsx-exporter ./example/excel");
    Logger.log("xlsx-exporter ./example/excel ./example/exported");
    Logger.log("xlsx-exporter ./example/excel/UnitConfig.xlsx");
    Logger.log("xlsx-exporter ./example/excel/UnitConfig.xlsx ./example/exported");
}

const args = process.argv.splice(2);

if (args.length === 0) {
    printHelp();
    process.exit();
}

if (!fs.existsSync(args[0])) {
    Logger.error("Input path does not exist.");
    process.exit();
}

const fileList: string[] = [];

const inputStat = fs.statSync(args[0]);
if (inputStat.isDirectory()) {
    fileList.push(...fs.readdirSync(args[0]).filter((e) => e.endsWith(".xlsx") && e.indexOf("~$") === -1).map((e) => path.join(args[0], e)));
    if (fileList.length === 0) {
        Logger.error("Target directory has no xlsx file.");
        process.exit();
    }
} else if (inputStat.isFile()) {
    if (args[0].endsWith(".xlsx")) {
        fileList.push(args[0]);
    } else {
        Logger.error("Must specify an xlsx file.");
        process.exit();
    }
} else {
    Logger.error("Must specify input directory or file.");
    process.exit();
}

let outDir: string = path.dirname(fileList[0]);

if (args.length > 1) {
    if (!fs.existsSync(args[1])) {
        Logger.error("Output path does not exist.");
        process.exit();
    }
    const outputStat = fs.statSync(args[1]);
    if (outputStat.isDirectory()) {
        outDir = args[1];
    } else {
        Logger.error("Output must be a directory.");
        process.exit();
    }
}

for (const file of fileList) {
    const baseFN = path.basename(file, ".xlsx");
    const wp = new WorkbookParser(xlsx.readFile(file), baseFN);
    const outFp = path.join(outDir, baseFN + ".ts");
    fs.writeFileSync(outFp, wp.toTs());
    Logger.success(outFp);
}
