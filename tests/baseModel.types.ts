import { BaseModel } from "../src/BaseModel";

type TestUser = {
  id?: number;
  name: string;
  email: string;
  active?: number;
};

class TypeTestUserModel extends BaseModel<TestUser> {
  constructor(db: D1Database) {
    super("users", db);
  }
}

declare const db: D1Database;
const userModel = new TypeTestUserModel(db);

async function testCreate() {
  const created = await userModel.create({ name: "Abiru", email: "a@example.com" });
  created.id satisfies number;
  created.name satisfies string;
}

async function testUpdate() {
  await userModel.update(1, { name: "Updated" });
  await userModel.update(1, { active: 1 });
  // @ts-expect-error - invalid property should fail
  await userModel.update(1, { invalid: "nope" });
}

async function testFind() {
  const maybeUser = await userModel.find(1);
  if (maybeUser) {
    maybeUser.id satisfies number;
  }
}

testCreate();
testUpdate();
testFind();
