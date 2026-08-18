import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

import { patterns } from "@atlas-patterns/content";

type ScenarioInventoryEntry = {
  patternSlug: string;
  patternName: string;
  scenarioIndex: number;
  scenarioTitle: string;
  scenarioText: string;
  normalizedSlugCandidate: string;
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getScenarioTitle(scenario: unknown, index: number) {
  if (typeof scenario === "string") {
    return scenario.split(/[.:—–-]/, 1)[0]?.trim() || `Scenario ${index + 1}`;
  }

  if (scenario && typeof scenario === "object") {
    const record = scenario as Record<string, unknown>;

    for (const key of ["title", "name", "scenario", "heading"]) {
      const value = record[key];

      if (typeof value === "string" && value.trim()) {
        return value.trim();
      }
    }
  }

  return `Scenario ${index + 1}`;
}

function getScenarioText(scenario: unknown) {
  if (typeof scenario === "string") {
    return scenario.trim();
  }

  if (scenario && typeof scenario === "object") {
    const record = scenario as Record<string, unknown>;

    for (const key of ["description", "summary", "problem", "text", "content"]) {
      const value = record[key];

      if (typeof value === "string" && value.trim()) {
        return value.trim();
      }
    }

    return JSON.stringify(scenario);
  }

  return String(scenario);
}

function main() {
  const inventory: ScenarioInventoryEntry[] = patterns.flatMap((pattern) =>
    (pattern.scenarios ?? []).map((scenario, scenarioIndex) => {
      const scenarioTitle = getScenarioTitle(scenario, scenarioIndex);
      const scenarioText = getScenarioText(scenario);

      return {
        patternSlug: pattern.slug,
        patternName: pattern.name,
        scenarioIndex,
        scenarioTitle,
        scenarioText,
        normalizedSlugCandidate: slugify(
          `${pattern.slug}-${scenarioTitle}`,
        ),
      };
    }),
  );

  const outputPath = resolve(
    process.cwd(),
    "docs/migrations/scenario-inventory.json",
  );

  return mkdir(resolve(process.cwd(), "docs/migrations"), {
    recursive: true,
  })
    .then(() =>
      writeFile(
        outputPath,
        `${JSON.stringify(inventory, null, 2)}\n`,
        "utf8",
      ),
    )
    .then(() => {
      console.log(
        `[inventory] Wrote ${inventory.length} authored scenario entries to ${outputPath}.`,
      );
    });
}

main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});