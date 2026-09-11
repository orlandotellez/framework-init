import inquirer from "inquirer";
import { TEMPLATES, type Template } from "./templates.js";

export async function selectTemplate(): Promise<Template> {
  const { template } = await inquirer.prompt([
    {
      type: "list",
      name: "template",
      message: "What project do you want to create?",
      choices: TEMPLATES.map((t) => ({
        name: `${t.name} — ${t.description}`,
        value: t,
      })),
    },
  ]);
  return template;
}

export async function askProjectName(): Promise<string> {
  const { name } = await inquirer.prompt([
    {
      type: "input",
      name: "name",
      message: "Project name:",
      validate: (input) => {
        if (!input.trim()) return "Name cannot be empty";
        if (!/^[a-zA-Z0-9_-]+$/.test(input)) {
          return "Only letters, numbers, hyphens and underscores";
        }
        return true;
      },
    },
  ]);
  return name.trim();
}
