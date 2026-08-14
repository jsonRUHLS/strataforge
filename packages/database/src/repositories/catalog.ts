import { prisma } from "../client.js";

export async function getScenarioBySlug(slug: string) {
  return prisma.scenario.findUnique({
    where: { slug },
    include: {
      patternLinks: {
        include: {
          pattern: {
            include: {
              variants: {
                include: {
                  coreLanguage: true,
                },
              },
            },
          },
        },
      },
      technologyLinks: {
        include: {
          technology: {
            include: {
              coreLanguage: true,
            },
          },
        },
      },
    },
  });
}

export async function getPatternBySlug(slug: string) {
  return prisma.pattern.findUnique({
    where: { slug },
    include: {
      variants: {
        include: {
          coreLanguage: true,
        },
        orderBy: {
          title: "asc",
        },
      },
      scenarioLinks: {
        include: {
          scenario: true,
        },
      },
    },
  });
}