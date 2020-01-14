import { IMap } from "../Common/TypeDef";
import ILang from "./Lang";
import Lua from "./Lua";
import Typescript from "./Typescript";
import Wurst from "./Wurst";
import Zinc from "./Zinc";

const langClassMap: IMap<new () => ILang> = {
    ts: Typescript,
    lua: Lua,
    zinc: Zinc,
    wurst: Wurst,
};

export function CreateExporter(name: string): ILang {
    const lang = langClassMap[name];
    return new lang();
}
