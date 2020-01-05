import * as fs from "fs";
import * as path from "path";
import xlsx = require("xlsx");
import WorkbookParser from "./Component/WorkbookParser";

const { readFile } = xlsx;

const filePath = "./excel/Unit.xlsx";

const baseFN = path.basename(filePath, ".xlsx");

const wp = new WorkbookParser(readFile(filePath), baseFN);

const outDir = "./excel";

fs.writeFileSync(path.join(outDir, baseFN + ".ts"), wp.toTs());
