import { JSTypes } from "../Type/Type";
import IFieldDefine from "./FieldDefine";

export default interface IField<T extends JSTypes> {
    fDef: IFieldDefine<T>;
    value: string;
}
