import Rule from "./Rule";

export default class RDefault extends Rule {
    public defaultVal: string;

    public constructor(val: string) {
        super();
        if (!val) {
            val = "";
            this.error.push("Undefined default value");
        }
        this.defaultVal = val;
    }

    public execute(): void {
        throw new Error("Method not implemented.");
    }

}
