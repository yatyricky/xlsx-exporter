// tslint:disable: no-bitwise

import IType from "./Type";

export default class Int256 implements IType<number> {
    public default(): number {
        return 0;
    }

    public valueOf(strrep: string): number {
        const v1 = strrep.charCodeAt(0) << 24;
        const v2 = strrep.charCodeAt(1) << 16;
        const v3 = strrep.charCodeAt(2) << 8;
        const v4 = strrep.charCodeAt(3);
        return v1 | v2 | v3 | v4;
    }

    public match(value: string): boolean {
        return value.length === 4;
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
