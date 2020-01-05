import { JSTypes } from "../Common/TypeDef";
import IFieldDefine from "./FieldDefine";

export default interface IField<T extends JSTypes> {
    fDef: IFieldDefine<T>;
    value: string;
}
