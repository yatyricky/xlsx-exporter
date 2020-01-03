import IType from "./Type";

export default class Int implements IType<number> {
    public default(): number {
        return 0;
    }

    public valueOf(strrep: string): number {
        return parseInt(strrep, 10);
    }

    public match(value: string): boolean {
        return !isNaN(parseInt(value, 10));
    }

    public tsDef(): string {
        return "";
    }

    public tsName(): string {
        return "number";
    }

    public tsVal(value: number): string {
        return value.toString();
    }
}
