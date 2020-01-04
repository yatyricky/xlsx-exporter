import RDefault from "../Rule/RDefault";
import RIndex from "../Rule/RIndex";
import IRule from "../Rule/Rule";
import RUnique from "../Rule/RUnique";
import { IMap } from "./TypeDef";

const ruleClassMap: IMap<new (val: string) => IRule> = {
    Default: RDefault,
    Index: RIndex,
    Unique: RUnique,
};

export function CreateRule(name: string, val: string): IRule | undefined {
    const cls = ruleClassMap[name];
    if (cls) {
        return new cls(val);
    }
    return undefined;
}
