import Rule, { RuleType } from "./Rule";
import RUnique from "./RUnique";

export default class RIndex extends Rule {
    public type: RuleType = RuleType.Index;

    public constructor() {
        super();
        this.subRules.push(new RUnique());
    }

}
