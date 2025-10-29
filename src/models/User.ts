import { BaseModel } from "../BaseModel";

export interface UserSchema {
  id?: number;
  name: string;
  email: string;
}

export class User extends BaseModel<UserSchema> {
  constructor(db: D1Database) {
    super("users", db);
  }
}
