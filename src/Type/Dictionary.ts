import { IMap, JSKeyType, JSTypes } from "../Common/TypeDef";
import IType, { ICollection, TypeCategory } from "./TypeBase";

export default class Dictionary<K extends JSKeyType, V extends JSTypes> implements ICollection {

    public category: TypeCategory = TypeCategory.Collection;

    private kType: IType<K>;
    private vType: IType<V>;

    public constructor(kType: IType<K>, vType: IType<V>) {
        this.kType = kType;
        this.vType = vType;
    }

    public merge(lhs: IMap<V>, rhs: IMap<V>): void {
        for (const key in rhs) {
            if (rhs.hasOwnProperty(key)) {
                lhs[key] = rhs[key];
            }
        }
    }

    public default(): { [key: string]: V } {
        return {};
    }

    public match(strrep: string): boolean {
        const kvs = strrep.split(",");
        for (const kv of kvs) {
            const kvt = kv.split(":");
            if (kvt.length !== 2) {
                return false;
            }
            if (!this.kType.match(kvt[0].trim())) {
                return false;
            }
            if (!this.vType.match(kvt[1].trim())) {
                return false;
            }
        }
        return true;
    }

    public valueOf(strrep: string): { [key: string]: V } {
        const ret: { [key: string]: V } = {};
        const kvs = strrep.split(",");
        for (const kv of kvs) {
            const kvt = kv.split(":");
            const k = this.kType.valueOf(kvt[0].trim());
            const v = this.vType.valueOf(kvt[1].trim());
            ret[k] = v;
        }
        return ret;
    }

    public tsDef(): string {
        return "";
    }

    public tsName(): string {
        return `{ [key: ${this.kType.tsName()}]: ${this.vType.tsName()} }`;
    }

    public tsVal(value: { [key: string]: V }): string {
        return `{ ${Object.keys(value).map((key) => `[${this.kType.tsVal(key as K)}]: ${this.vType.tsVal(value[key])}`).join(", ")} }`;
    }

    public luaDef(): string {
        return "";
    }

    public luaName(): string {
        return `table<${this.kType.luaName()}, ${this.vType.luaName()}>`;
    }

    public luaVal(value: { [key: string]: V }): string {
        return `{ ${Object.keys(value).map((key) => `[${this.kType.tsVal(key as K)}] = ${this.vType.tsVal(value[key])}`).join(", ")} }`;
    }

    public zincDef(): string {
        return "";
    }

    public zincName(): string {
        return "";
    }

    public zincVal(value: { [key: string]: V }): string {
        return "";
    }

    public wurstDef(): string {
        return "";
    }

    public wurstName(): string {
        return `HashMap<${this.kType.wurstName()}, ${this.vType.wurstName()}>`;
    }

    public wurstVal(value: { [key: string]: V }): string {
        return "";
    }

}
