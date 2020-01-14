import { IMap, JSTypes } from "../Common/TypeDef";
import IType from "../Type/TypeBase";
import RDefault from "./RDefault";
import RIndex from "./RIndex";
import Rule from "./Rule";
import RUnique from "./RUnique";

const ruleClassMap: IMap<new (val: string, fieldType: IType<JSTypes>) => Rule> = {
    Default: RDefault,
    Index: RIndex,
    Unique: RUnique,
};

export function CreateRule(name: string, val: string, fieldType: IType<JSTypes>): Rule | undefined {
    const cls = ruleClassMap[name];
    if (cls) {
        return new cls(val, fieldType);
    }
    return undefined;
}
