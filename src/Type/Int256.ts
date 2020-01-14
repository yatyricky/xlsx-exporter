// tslint:disable: no-bitwise

import IType, { TypeCategory } from "./TypeBase";

export default class Int256 implements IType<number> {

    public category: TypeCategory = TypeCategory.Single;
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

    public luaDef(): string {
        return "";
    }

    public luaName(): string {
        return "number";
    }

    public luaVal(value: number): string {
        return value.toString();
    }

    public zincDef(): string {
        return "";
    }

    public zincName(): string {
        return "integer";
    }

    public zincVal(value: number): string {
        const v4 = value % 256;
        value = value >>> 8;
        const v3 = value % 256;
        value = value >>> 8;
        const v2 = value % 256;
        value = value >>> 8;
        const v1 = value;
        return `'${String.fromCharCode(v1, v2, v3, v4)}'`;
    }

    public wurstDef(): string {
        return "";
    }

    public wurstName(): string {
        return "int";
    }

    public wurstVal(value: number): string {
        return this.zincVal(value);
    }

}
