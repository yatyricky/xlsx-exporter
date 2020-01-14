import { JSTypes } from "../Common/TypeDef";
import IType, { ICollection, TypeCategory } from "./TypeBase";

export default class List<T extends JSTypes> implements ICollection {

    public category: TypeCategory = TypeCategory.Collection;

    public itemType: IType<T>;

    public constructor(itemType: IType<T>) {
        this.itemType = itemType;
    }

    public merge(lhs: T[], rhs: T[]): void {
        lhs.push(...rhs);
    }

    public default(): T[] {
        return [];
    }

    public match(strrep: string): boolean {
        return strrep.split(",")
            .map((e) => e.trim())
            .every((e) => this.itemType.match(e));
    }

    public valueOf(strrep: string): T[] {
        return strrep.split(",")
            .map((e) => this.itemType.valueOf(e.trim()));
    }

    public tsDef(): string {
        return "";
    }

    public tsName(): string {
        return this.itemType.tsName() + "[]";
    }

    public tsVal(value: T[]): string {
        return `[${value.map((e) => this.itemType.tsVal(e)).join(", ")}]`;
    }

    public luaDef(): string {
        return "";
    }

    public luaName(): string {
        return this.itemType.luaName() + "[]";
    }

    public luaVal(value: T[]): string {
        return `{ ${value.map((e) => this.itemType.tsVal(e)).join(", ")} }`;
    }

    public zincDef(): string {
        return "";
    }

    public zincName(): string {
        return this.itemType.zincName();
    }

    public zincVal(value: T[]): string {
        return "";
    }

    public wurstDef(): string {
        return "";
    }

    public wurstName(): string {
        return this.itemType.wurstName() + " array";
    }

    public wurstVal(value: T[]): string {
        return `[ ${value.map((e) => this.itemType.tsVal(e)).join(", ")} ]`;
    }

}
