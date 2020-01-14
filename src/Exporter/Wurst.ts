import { JSTypes } from "../Common/TypeDef";
import IField from "../Component/Field";
import IType from "../Type/TypeBase";
import ILang from "./Lang";

export default class Wurst implements ILang {

    public extension = ".wurst";

    public head(name: string): string {
        return "package " + name;
    }

    public tail(): string {
        return "";
    }

    public typeDefString(type: IType<JSTypes>): string {
        return type.wurstDef();
    }

    public typeString(type: IType<JSTypes>): string {
        return type.wurstName();
    }

    public valueString(type: IType<JSTypes>, value: JSTypes): string {
        return type.wurstVal(value);
    }

    public global(field: IField<JSTypes>): string {
        const { type, name } = field.fDef;
        let rhs: string;
        if (field.value) {
            rhs = this.valueString(type, type.valueOf(field.value));
        } else {
            rhs = this.valueString(type, type.default());
        }
        return `constant ${this.typeString(type)} ${name} = ${rhs}`;
    }

    public sheet(field: IField<string>): string {
        return `constant ${this.typeString(field.fDef.type)} ${field.fDef.name} = new ${this.typeString(field.fDef.type)}`;
    }
}
