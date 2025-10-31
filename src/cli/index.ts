#!/usr/bin/env node
import { Command } from "commander";
import { generate } from "./commands/generate.js";

const program = new Command();

program
  .name("d1")
  .description("D1 Record CLI - lightweight ORM generator for Cloudflare D1")
  .version("0.1.0");

program
  .command("generate")
  .alias("g")
  .description("Generate resources (model, migration, etc.)")
  .argument("<type>", "resource type (model, migration, etc.)")
  .argument("<name>", "resource name")
  .argument("[fields...]", "fields like name:string age:integer")
  .action(generate);

program.parse();

export default program;
