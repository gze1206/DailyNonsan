import ModuleBase from "./moduleBase";
import { Connection } from "typeorm";

export default class NewLineModule extends ModuleBase {
    private static NEW_LINE = '';

    public async DoWork(conn: Connection): Promise<ModuleBase> {
        return this;
    }

    public GetText(): string {
        return NewLineModule.NEW_LINE;
    }

    public GetLength(): number {
        return this.GetText().length;
    }
}