const { Command } = require("commander");
 const program = new Command();
 const packageJson = require("./package.json");
 
 program
   .name("backlash")
   .description(packageJson.description)
   .version(packageJson.version);
 
 program.parse(process.argv);