import IType, { TypeCategory } from "./TypeBase";

export default class Int implements IType<number> {

    public category: TypeCategory = TypeCategory.Single;
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
        return value.toString();
    }

    public wurstDef(): string {
        return "";
    }

    public wurstName(): string {
        return "int";
    }

    public wurstVal(value: number): string {
        return value.toString();
    }

}
