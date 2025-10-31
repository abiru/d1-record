import { writeFileSync, mkdirSync, existsSync } from "fs";
import { resolve } from "path";
import Handlebars from "handlebars";

const MODEL_TEMPLATE = `
import { BaseModel } from "d1-record";

export class {{name}} extends BaseModel {
  static table = "{{table}}";
  static schema = {
    id: "integer",
    {{#each fields}}
    {{this.name}}: "{{this.type}}",
    {{/each}}
  } as const;
}
`;

const MIGRATION_TEMPLATE = `
CREATE TABLE IF NOT EXISTS {{table}} (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  {{#each fields}}
  {{this.name}} {{sqlType}}{{#unless @last}},{{/unless}}
  {{/each}}
);
`;

function mapSqlType(type: string) {
  switch (type) {
    case "string": return "TEXT";
    case "integer": return "INTEGER";
    case "boolean": return "INTEGER";
    case "float": return "REAL";
    default: return "TEXT";
  }
}

export async function generateModel(name: string, fieldArgs: string[]) {
  const table = name.toLowerCase() + "s";
  const fields = fieldArgs.map((f) => {
    const [n, t] = f.split(":");
    return { name: n, type: t, sqlType: mapSqlType(t) };
  });

  const modelDir = resolve(process.cwd(), "src/models");
  if (!existsSync(modelDir)) mkdirSync(modelDir, { recursive: true });

  const migrationDir = resolve(process.cwd(), "src/migrations");
  if (!existsSync(migrationDir)) mkdirSync(migrationDir, { recursive: true });

  const modelFile = resolve(modelDir, `${name}.ts`);
  const migrationFile = resolve(
    migrationDir,
    `${Date.now()}_create_${table}.sql`
  );

  const modelCode = Handlebars.compile(MODEL_TEMPLATE)({ name, table, fields });
  const migrationSQL = Handlebars.compile(MIGRATION_TEMPLATE)({ table, fields });

  writeFileSync(modelFile, modelCode);
  writeFileSync(migrationFile, migrationSQL);

  console.log(`✅ Created model: ${modelFile}`);
  console.log(`✅ Created migration: ${migrationFile}`);
}
