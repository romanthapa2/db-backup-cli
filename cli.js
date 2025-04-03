#!/usr/bin/env node


import { Command } from "commander";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { createRequire } from "module";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const require = createRequire(import.meta.url);

const program = new Command();
const packageJson = require("./package.json");

import configure from "./commands/configure.js";
import backup from "./commands/backup.js";
import restore from "./commands/restore.js";

configure(program);
backup(program);
restore(program);

program
  .name("backlash")
  .description(packageJson.description)
  .version(packageJson.version);

program.parse(process.argv);
