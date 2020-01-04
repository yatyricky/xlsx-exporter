import ErrorReporter from "../Common/ErrorReporter";

export default abstract class Rule extends ErrorReporter {
    constructor() {
        super();
    }
    public abstract execute(): void;
}
