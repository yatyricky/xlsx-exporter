import { JSTypes } from "../Common/TypeDef";
import IField from "../Component/Field";
import IType from "../Type/TypeBase";
import ILang from "./Lang";

export default class Typescript implements ILang {

    public extension = ".ts";

    public head(name: string): string {
        return "";
    }

    public tail(): string {
        return "";
    }

    public typeDefString(type: IType<JSTypes>): string {
        return type.tsDef();
    }

    public typeString(type: IType<JSTypes>): string {
        return type.tsName();
    }

    public valueString(type: IType<JSTypes>, value: JSTypes): string {
        return type.tsVal(value);
    }

    public global(field: IField<JSTypes>): string {
        const { type, name } = field.fDef;
        let rhs: string;
        if (field.value) {
            rhs = this.valueString(type, type.valueOf(field.value));
        } else {
            rhs = this.valueString(type, type.default());
        }
        return `export const ${name}: ${this.typeString(type)} = ${rhs};`;
    }

    public sheet(field: IField<string>): string {
        return `export const ${field.fDef.name}: ${this.typeString(field.fDef.type)} = ${field.value};`;
    }
}
