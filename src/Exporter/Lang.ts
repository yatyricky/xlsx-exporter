import { JSTypes } from "../Common/TypeDef";
import IType from "../Type/TypeBase";

export default interface ILang {
    defaultString(type: IType<JSTypes>): string;
    typeDefString(type: IType<JSTypes>): string;
    typeString(type: IType<JSTypes>): string;
    valueString(type: IType<JSTypes>, strrep: string): string;
}
