import IType from "./Type";

export default class Text implements IType<string> {
    public default(): string {
        return "";
    }

    public valueOf(strrep: string): string {
        return strrep;
    }

    public match(value: string): boolean {
        return true;
    }

    public tsDef(): string {
        return "";
    }

    public tsName(): string {
        return "string";
    }

    public tsVal(value: string): string {
        return `"${value}"`;
    }

}
