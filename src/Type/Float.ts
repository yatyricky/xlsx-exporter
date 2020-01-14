import IType, { TypeCategory } from "./TypeBase";

export default class Float implements IType<number> {

    public category: TypeCategory = TypeCategory.Single;
    public default(): number {
        return 0;
    }

    public valueOf(strrep: string): number {
        return parseFloat(strrep);
    }

    public match(value: string): boolean {
        return !isNaN(parseFloat(value));
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
        return "real";
    }

    public zincVal(value: number): string {
        return value.toString();
    }

    public wurstDef(): string {
        return "";
    }

    public wurstName(): string {
        return "real";
    }

    public wurstVal(value: number): string {
        return value.toString();
    }

}
