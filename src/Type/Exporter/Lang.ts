import IType, { JSTypes } from "../Type";

export default interface ILang {
    defaultString(type: IType<JSTypes>): string;
    typeDefString(type: IType<JSTypes>): string;
    typeString(type: IType<JSTypes>): string;
    valueString(type: IType<JSTypes>, strrep: string): string;
}
