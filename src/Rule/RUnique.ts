import Rule, { RuleType } from "./Rule";

export default class RUnique extends Rule {
    public type: RuleType = RuleType.Unique;

    public constructor() {
        super();
    }

}
