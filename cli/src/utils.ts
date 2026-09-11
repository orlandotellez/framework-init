import { existsSync } from "fs";
import { resolve } from "path";

export function getProjectPath(name: string): string {
  return resolve(process.cwd(), name);
}

export function projectExists(name: string): boolean {
  return existsSync(getProjectPath(name));
}

export function printSuccess(
  projectName: string,
  templateName: string,
  postInit?: { install?: string; dev?: string }
): void {
  const installCmd = postInit?.install || "npm install";
  const devCmd = postInit?.dev || "npm run dev";

  console.log(`
\u001b[32m\u2714\u001b[0m Template downloaded
\u001b[32m\u2714\u001b[0m Project created in ./${projectName}

\u001b[1mNext steps:\u001b[0m

  \u001b[36mcd ${projectName}\u001b[0m
  \u001b[36m${installCmd}\u001b[0m
  \u001b[36m${devCmd}\u001b[0m
`);
}
