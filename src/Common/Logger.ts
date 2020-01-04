// tslint:disable: no-console
export default class Logger {

    public static log = console.log;

    public static success(...params: any[]): void {
        console.log("✔", ...params);
    }

    public static warn(...params: any[]): void {
        console.log("⚠", ...params);
    }

    public static error(...params: any[]): void {
        console.log("❌", ...params);
    }

    public static duplicate(msg: string): void {
        Logger.error("[DUPLICATE]" + msg);
    }

    public static unknownType(msg: string): void {
        Logger.error("[UNKNOWN_TYPE]" + msg);
    }

    public static unknownRule(msg: string): void {
        Logger.error("[UNKNOWN_RULE]" + msg);
    }

}
