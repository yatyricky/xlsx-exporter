import { IMap } from "../Common/TypeDef";

export type JSTypes = number | string | boolean | object;

export default interface IType<T extends JSTypes> {
    default(): T;
    match(strrep: string): boolean;
    valueOf(strrep: string): T;

    tsDef(): string;
    tsName(): string;
    tsVal(value: T): string;
}
