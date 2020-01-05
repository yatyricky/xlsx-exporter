import { JSTypes } from "../Common/TypeDef";
import IType from "../Type/TypeBase";
import Rule, { RuleType } from "./Rule";

export default class RDefault extends Rule {
    public type: RuleType = RuleType.Default;
    public defaultVal: string;
    private valueType: IType<JSTypes>;

    public constructor(val: string, fieldType: IType<JSTypes>) {
        super();
        if (!val) {
            val = "";
            this.error.push("Undefined default value");
        }
        this.defaultVal = val;
        this.valueType = fieldType;
    }

    public execute(): void {
        if (!this.valueType.match(this.defaultVal)) {
            this.error.push("Default value does not match field type");
        }
    }

}
