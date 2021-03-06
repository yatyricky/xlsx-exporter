import { JSTypes } from "../Common/TypeDef";

export default interface IType<T extends JSTypes> {
    category: TypeCategory;
    default(): T;
    match(strrep: string): boolean;
    valueOf(strrep: string): T;

    tsDef(): string;
    tsName(): string;
    tsVal(value: T): string;

    luaDef(): string;
    luaName(): string;
    luaVal(value: T): string;

    zincDef(): string;
    zincName(): string;
    zincVal(value: T): string;

    wurstDef(): string;
    wurstName(): string;
    wurstVal(value: T): string;
}

export interface ICollection extends IType<JSTypes> {
    merge(lhs: JSTypes, rhs: JSTypes): void;
}

export enum TypeCategory {
    Single = 1,
    Collection = 2,
}
