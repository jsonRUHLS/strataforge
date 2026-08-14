import { Prisma } from "@prisma/client";
import { prisma } from "../client.js";

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

export async function getOptionalPatternBySlug(slug: string) {
  if (!process.env.DATABASE_URL) {
    return null;
  }

  try {
    return await getPatternBySlug(slug);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientInitializationError) {
      console.warn(
        `[catalog] PostgreSQL is unavailable; using content fallback for "${slug}".`,
      );

      return null;
    }

    throw error;
  }
}

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

export async function getOptionalScenarioBySlug(slug: string) {
  if (!process.env.DATABASE_URL) {
    return null;
  }

  try {
    return await getScenarioBySlug(slug);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientInitializationError) {
      console.warn(
        `[catalog] PostgreSQL is unavailable; scenario "${slug}" cannot be loaded.`,
      );

      return null;
    }

    throw error;
  }
}