import IType, { JSTypes } from "../Type";
import ILang from "./Lang";

export default class Typescript implements ILang {

    public defaultString(type: IType<JSTypes>): string {
        return type.tsVal(type.default());
    }

    public typeDefString(type: IType<JSTypes>): string {
        return type.tsDef();
    }

    public typeString(type: IType<JSTypes>): string {
        return type.tsName();
    }

    public valueString(type: IType<JSTypes>, strrep: string): string {
        return type.tsVal(type.valueOf(strrep));
    }

}
