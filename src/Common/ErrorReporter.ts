export default abstract class ErrorReporter {
    public error: string[];

    constructor() {
        this.error = [];
    }

    public getErrors(): string {
        const ret = this.error.join(";");
        this.error.length = 0;
        return ret;
    }
}
