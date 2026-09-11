#!/usr/bin/env node

import { Command } from "commander";
import ora from "ora";
import chalk from "chalk";
import { TEMPLATES, findTemplate } from "./templates.js";
import {
  downloadAndExtract,
  copyTemplate,
  cleanup,
} from "./downloader.js";
import { selectTemplate, askProjectName } from "./prompts.js";
import {
  getProjectPath,
  projectExists,
  printSuccess,
} from "./utils.js";

const program = new Command();

program
  .name("fwinit")
  .description("CLI to create projects from templates")
  .version("1.0.0");

program
  .command("list")
  .description("Show available templates")
  .action(() => {
    console.log(
      chalk.bold("\nAvailable templates:\n")
    );
    TEMPLATES.forEach((t) => {
      console.log(
        `  ${chalk.cyan(t.folder.toLowerCase())} — ${t.description}`
      );
    });
    console.log();
  });

program
  .argument("[template]", "Template to use")
  .argument("[project-name]", "Project name")
  .action(
    async (templateArg?: string, projectNameArg?: string) => {
      try {
        let template = templateArg
          ? findTemplate(templateArg)
          : undefined;
        let projectName = projectNameArg;

        // Template arg provided but not found: error directly
        // (do NOT fall through to interactive mode)
        if (templateArg && !template) {
          console.error(
            chalk.red(
              `\n\u2716 Template "${templateArg}" not found.\n`
            )
          );
          console.log("Available templates:");
          TEMPLATES.forEach((t) =>
            console.log(`  - ${t.folder.toLowerCase()}`)
          );
          process.exit(1);
        }

        // Interactive mode if no template given
        if (!template) {
          template = await selectTemplate();
        }

        // Ask for name if not provided
        if (!projectName) {
          projectName = await askProjectName();
        }

        // Check if directory already exists
        if (projectExists(projectName)) {
          console.error(
            chalk.red(
              `\n\u2716 Directory "${projectName}" already exists.`
            )
          );
          process.exit(1);
        }

        // Download and create
        const spinner = ora(
          `Downloading ${template.name} template...`
        ).start();

        const { tempDir, templatePath } =
          await downloadAndExtract(template.folder);

        spinner.text = "Creating project...";

        await copyTemplate(
          templatePath,
          getProjectPath(projectName)
        );
        await cleanup(tempDir);

        spinner.succeed("Template downloaded");

        // Read postInit from template.json if exists
        let postInit:
          | { install?: string; dev?: string }
          | undefined;
        try {
          const { readFile } = await import("fs/promises");
          const { join } = await import("path");
          const tj = JSON.parse(
            await readFile(
              join(getProjectPath(projectName), "template.json"),
              "utf-8"
            )
          );
          postInit = tj.postInit;
        } catch {
          // template.json not found or invalid, use defaults
        }

        printSuccess(projectName, template.name, postInit);
      } catch (error) {
        console.error(
          chalk.red(
            `\n\u2716 Error: ${(error as Error).message}`
          )
        );
        process.exit(1);
      }
    }
  );

program.parse();
