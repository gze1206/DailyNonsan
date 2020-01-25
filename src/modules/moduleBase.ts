import { Connection } from "typeorm";

export default abstract class ModuleBase {
    public async abstract DoWork(conn: Connection): Promise<ModuleBase>;
    public abstract GetText(): string;
    public abstract GetLength(): number;
};