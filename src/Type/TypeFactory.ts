import { IMap, JSKeyType, JSTypes } from "../Common/TypeDef";
import Bool from "./Bool";
import Dictionary from "./Dictionary";
import Enum from "./Enum";
import Float from "./Float";
import Int from "./Int";
import Int256 from "./Int256";
import List from "./List";
import Text from "./Text";
import IType from "./TypeBase";

const typeClassMap: IMap<new () => IType<JSTypes>> = {
    string: Text,
    int256: Int256,
    int: Int,
    float: Float,
    bool: Bool,
};

const regMap = new RegExp(/^map[ \t]*<[ \t]*(?<k>\w+)[ \t]*,[ \t]*(?<v>\w+)[ \t]*>$/gm);

export function CreateType(name: string, enumMap: IMap<Enum>): IType<JSTypes> | undefined {
    const prim = typeClassMap[name];
    if (prim) {
        return new prim();
    }
    const tenum = enumMap[name];
    if (tenum) {
        return tenum;
    }
    if (name.endsWith("[]")) {
        const listTypeName = name.slice(0, name.length - 2);
        const listType = CreateType(listTypeName, enumMap);
        if (!listType) {
            return undefined;
        }
        return new List(listType);
    }
    const mapMatch = regMap.exec(name);
    if (mapMatch) {
        const groups = mapMatch.groups;
        if (!groups) {
            return undefined;
        }
        const kTypeName = groups.k;
        const kType = CreateType(kTypeName, enumMap) as IType<JSKeyType>;
        if (!kType) {
            return undefined;
        }
        const vTypeName = groups.v;
        const vType = CreateType(vTypeName, enumMap);
        if (!vType) {
            return undefined;
        }
        return new Dictionary(kType, vType);
    }
    return undefined;
}
