import { generateModel } from "./model.js";

export async function generate(type: string, name: string, fields: string[]) {
  switch (type) {
    case "model":
      await generateModel(name, fields);
      break;
    default:
      console.error(`Unknown generator: ${type}`);
  }
}
