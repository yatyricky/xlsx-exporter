import { JSTypes } from "../Common/TypeDef";
import IField from "../Component/Field";
import WorksheetParser from "../Component/WorkSheetParser";
import IType from "../Type/TypeBase";

export default interface ILang {
    extension: string;

    head(name: string): string;
    tail(): string;

    typeDefString(type: IType<JSTypes>): string;
    typeString(type: IType<JSTypes>): string;
    valueString(type: IType<JSTypes>, value: JSTypes): string;

    global(field: IField<JSTypes>): string;
    sheet(field: IField<JSTypes>, sheet?: WorksheetParser): string;
}
