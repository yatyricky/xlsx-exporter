import { JSTypes } from "../Common/TypeDef";
import IType from "../Type/TypeBase";

export default interface IFieldDefine<T extends JSTypes> {
    type: IType<T>;
    name: string;
}
