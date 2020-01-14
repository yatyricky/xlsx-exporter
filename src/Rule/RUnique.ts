import { IMap } from "../Common/TypeDef";
import Rule, { RuleType } from "./Rule";

export default class RUnique extends Rule {
    public type: RuleType = RuleType.Unique;

    public constructor() {
        super();
    }

    public execute(data: string[]): boolean {
        const map: IMap<boolean> = {};
        for (const e of data) {
            if (map[e] === true) {
                return false;
            }
            if (map[e] === undefined) {
                map[e] = true;
            }
        }
        return true && super.execute(data);
    }

}
