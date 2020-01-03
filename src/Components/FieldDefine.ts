import IType, { JSTypes } from "../Type/Type";

export default interface IFieldDefine<T extends JSTypes> {
    type: IType<T>;
    name: string;
}
