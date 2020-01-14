import IType, { TypeCategory } from "./TypeBase";

export default class Text implements IType<string> {

    public category: TypeCategory = TypeCategory.Single;
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

    public luaDef(): string {
        return "";
    }

    public luaName(): string {
        return "string";
    }

    public luaVal(value: string): string {
        return `"${value}"`;
    }

    public zincDef(): string {
        return "";
    }

    public zincName(): string {
        return "string";
    }

    public zincVal(value: string): string {
        return `"${value}"`;
    }

    public wurstDef(): string {
        return "";
    }

    public wurstName(): string {
        return "string";
    }

    public wurstVal(value: string): string {
        return `"${value}"`;
    }

}
