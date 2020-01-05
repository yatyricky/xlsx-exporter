import ErrorReporter from "../Common/ErrorReporter";

export enum RuleType {
    Index,
    Unique,
    Default,
}

export default abstract class Rule extends ErrorReporter {
    public abstract type: RuleType;
    protected subRules: Rule[];
    constructor() {
        super();
        this.subRules = [];
    }
    public execute(): void {
        // nothing to do
    }

    public overlapWith(other: Rule): boolean {
        if (this.type === other.type) {
            return true;
        }
        return other.subRules.some((e) => this.overlapWith(e));
    }
}
