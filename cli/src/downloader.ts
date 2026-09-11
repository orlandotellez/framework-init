import AdmZip from "adm-zip";
import { mkdir, rm, cp, readdir } from "fs/promises";
import { join } from "path";
import { tmpdir } from "os";
import { randomBytes } from "crypto";

const GITHUB_REPO = "orlandotellez/framework-init";
const GITHUB_BRANCH = "main";

export interface DownloadResult {
  tempDir: string;
  templatePath: string;
}

export async function downloadAndExtract(
  templateFolder: string
): Promise<DownloadResult> {
  const url = `https://github.com/${GITHUB_REPO}/archive/refs/heads/${GITHUB_BRANCH}.zip`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(
      `Failed to download template: ${response.statusText}`
    );
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  const zip = new AdmZip(buffer);

  const tempId = randomBytes(8).toString("hex");
  const tempDir = join(tmpdir(), `framework-init-${tempId}`);
  await mkdir(tempDir, { recursive: true });

  zip.extractAllTo(tempDir, true);

  // GitHub ZIP extracts as: framework-init-main/FOLDER/
  const repoRoot = join(tempDir, `framework-init-${GITHUB_BRANCH}`);
  const templatePath = join(repoRoot, templateFolder);

  // Verify template exists
  try {
    await readdir(templatePath);
  } catch {
    await rm(tempDir, { recursive: true, force: true });
    throw new Error(
      `Template "${templateFolder}" not found in repository`
    );
  }

  return { tempDir, templatePath };
}

export async function copyTemplate(
  source: string,
  destination: string
): Promise<void> {
  await cp(source, destination, { recursive: true });
  await cleanTemplate(destination);
}

async function cleanTemplate(dir: string): Promise<void> {
  const lockFiles = [
    "bun.lock",
    "pnpm-lock.yaml",
    "package-lock.json",
    "yarn.lock",
  ];

  for (const file of lockFiles) {
    const path = join(dir, file);
    try {
      await rm(path, { force: true });
    } catch {
      // File doesn't exist, skip
    }
  }
}

export async function cleanup(tempDir: string): Promise<void> {
  await rm(tempDir, { recursive: true, force: true });
}
