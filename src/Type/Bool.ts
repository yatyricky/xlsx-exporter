import IType, { TypeCategory } from "./TypeBase";

export default class Bool implements IType<boolean> {

    public category: TypeCategory = TypeCategory.Single;

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

    public luaDef(): string {
        return "";
    }

    public luaName(): string {
        return "boolean";
    }

    public luaVal(value: boolean): string {
        if (value) {
            return "true";
        } else {
            return "false";
        }
    }

    public zincDef(): string {
        return "";
    }

    public zincName(): string {
        return "boolean";
    }

    public zincVal(value: boolean): string {
        if (value) {
            return "true";
        } else {
            return "false";
        }
    }

    public wurstDef(): string {
        return "";
    }

    public wurstName(): string {
        return "boolean";
    }

    public wurstVal(value: boolean): string {
        if (value) {
            return "true";
        } else {
            return "false";
        }
    }

}
