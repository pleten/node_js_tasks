import {Orm} from "../orm";
import {Pool} from "pg";
import {IUser} from "./interfaces/user";

export class UsersRepo {
    private readonly pool: Pool;
    private table = 'naive_orm.users';
    private orm: Orm<IUser, 'id'>;
    constructor() {
        this.pool = new Pool({
            connectionString: 'postgresql://postgres:postgres@localhost:5432/nodejs_db',
        });
        this.orm = new Orm<IUser, 'id'>(this.table, this.pool);
    }

    create(user: Omit<IUser, 'id'>): Promise<IUser> {
        return this.orm.save(user);
    }

    getAll(): Promise<IUser[]> {
        return this.orm.find();
    }

    getOne(id: IUser['id']): Promise<IUser | null> {
        return this.orm.findOne(id);
    }

    update(id: IUser['id'], data: Partial<IUser>) {
        return this.orm.update(id, data);
    }

    delete(id: IUser['id']) {
        return this.orm.delete(id);
    }
}