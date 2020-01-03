import IType from "./Type";

export default class Bool implements IType<boolean> {

    public match(strrep: string): boolean {
        const lc = strrep.toLowerCase();
        return lc === "true" || lc === "false";
    }

    public default(): boolean {
        return false;
    }

    public valueOf(strrep: string): boolean {
        const lc = strrep.toLowerCase();
        if (lc === "false") {
            return false;
        } else if (lc === "true") {
            return true;
        } else {
            throw new Error();
        }
    }

    public tsDef(): string {
        return "";
    }

    public tsName(): string {
        return "boolean";
    }

    public tsVal(value: boolean): string {
        if (value) {
            return "true";
        } else {
            return "false";
        }
    }
}
