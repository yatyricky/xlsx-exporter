import Bool from "../Type/Bool";
import Enum from "../Type/Enum";
import Float from "../Type/Float";
import Int from "../Type/Int";
import Int256 from "../Type/Int256";
import Text from "../Type/Text";
import IType, { JSTypes } from "../Type/Type";
import { IMap } from "./TypeDef";

const typeClassMap: IMap<new () => IType<JSTypes>> = {
    string: Text,
    int256: Int256,
    int: Int,
    float: Float,
    bool: Bool,
};

export function CreateType(name: string, enumMap: IMap<Enum>): IType<JSTypes> | undefined {
    const prim = typeClassMap[name];
    if (prim) {
        return new prim();
    }
    const tenum = enumMap[name];
    if (tenum) {
        return tenum;
    }
    return undefined;
}
