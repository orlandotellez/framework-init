#!/usr/bin/env node

import { Command } from "commander";
import ora from "ora";
import chalk from "chalk";
import { TEMPLATES, findTemplate } from "./templates.js";
import {
  downloadAndExtract,
  copyTemplate,
  cleanup,
  substituteTemplate,
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
  .description("CLI para crear proyectos desde templates")
  .version("1.0.0");

program
  .command("list")
  .description("Mostrar templates disponibles")
  .action(() => {
    console.log(
      chalk.bold("\nTemplates disponibles:\n")
    );
    TEMPLATES.forEach((t) => {
      console.log(
        `  ${chalk.cyan(t.folder.toLowerCase())} — ${t.description}`
      );
    });
    console.log();
  });

program
  .argument("[template]", "Template a usar")
  .argument("[project-name]", "Nombre del proyecto")
  .action(
    async (templateArg?: string, projectNameArg?: string) => {
      try {
        let template = templateArg
          ? findTemplate(templateArg)
          : undefined;
        let projectName = projectNameArg;

        // El argumento del template no se encontró: error directo
        // (no caer en el modo interactivo)
        if (templateArg && !template) {
          console.error(
            chalk.red(
              `\n\u2716 Template "${templateArg}" no encontrado.\n`
            )
          );
          console.log("Templates disponibles:");
          TEMPLATES.forEach((t) =>
            console.log(`  - ${t.folder.toLowerCase()}`)
          );
          process.exit(1);
        }

        // Modo interactivo si no se pasó ningún template
        if (!template) {
          template = await selectTemplate();
        }

        // Preguntar el nombre si no se proporcionó
        if (!projectName) {
          projectName = await askProjectName();
        }

        // Verificar si el directorio ya existe
        if (projectExists(projectName)) {
          console.error(
            chalk.red(
              `\n\u2716 El directorio "${projectName}" ya existe.`
            )
          );
          process.exit(1);
        }

        // Descargar y crear el proyecto
        const spinner = ora(
          `Descargando template ${template.name}...`
        ).start();

        const { tempDir, templatePath } =
          await downloadAndExtract(template.folder);

        spinner.text = "Creando proyecto...";

        await copyTemplate(
          templatePath,
          getProjectPath(projectName)
        );
        await substituteTemplate(
          getProjectPath(projectName),
          projectName,
          template.folder
        );
        await cleanup(tempDir);

        spinner.succeed("Template descargado");

        // Leer postInit de template.json si existe
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
          // template.json no encontrado o inválido, usar valores por defecto
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
