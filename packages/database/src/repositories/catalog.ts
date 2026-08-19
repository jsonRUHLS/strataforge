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
                orderBy: {
                  title: "asc",
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

export const scenarioSortOptions = [
  "title-asc",
  "created-desc",
  "updated-desc",
] as const;

export type ScenarioSort = (typeof scenarioSortOptions)[number];

export type ScenarioCatalogFilters = {
  query?: string;
  patternSlug?: string;
  category?: string;
  layer?: string;
  sort?: ScenarioSort;
};

export type ScenarioFilterOption = {
  slug: string;
  name: string;
  category: string;
  layer: string | null;
};

export function isScenarioSort(value: string): value is ScenarioSort {
  return scenarioSortOptions.includes(value as ScenarioSort);
}

export async function listScenarioFilterOptions(): Promise<ScenarioFilterOption[]> {
  return prisma.pattern.findMany({
    where: {
      status: "ACTIVE",
    },
    select: {
      slug: true,
      name: true,
      category: true,
      layer: true,
    },
    orderBy: {
      name: "asc",
    },
  });
}

export async function listOptionalScenarioFilterOptions() {
  if (!process.env.DATABASE_URL) {
    return null;
  }

  try {
    return await listScenarioFilterOptions();
  } catch (error) {
    if (error instanceof Prisma.PrismaClientInitializationError) {
      console.warn(
        "[catalog] PostgreSQL is unavailable; scenario filter options cannot be loaded.",
      );

      return null;
    }

    throw error;
  }
}

export async function listScenarios(filters: ScenarioCatalogFilters = {}) {
  const query = filters.query?.trim();

  const where: Prisma.ScenarioWhereInput = {
    status: "ACTIVE",
    ...(filters.patternSlug
      ? {
          patternLinks: {
            some: {
              pattern: {
                slug: filters.patternSlug,
              },
            },
          },
        }
      : {}),
    ...(filters.category
      ? {
          patternLinks: {
            some: {
              pattern: {
                category: {
                  equals: filters.category,
                  mode: "insensitive",
                },
              },
            },
          },
        }
      : {}),
    ...(filters.layer
      ? {
          patternLinks: {
            some: {
              pattern: {
                layer: {
                  equals: filters.layer,
                  mode: "insensitive",
                },
              },
            },
          },
        }
      : {}),
    ...(query
      ? {
          OR: [
            {
              name: {
                contains: query,
                mode: "insensitive",
              },
            },
            {
              summary: {
                contains: query,
                mode: "insensitive",
              },
            },
            {
              problemStatement: {
                contains: query,
                mode: "insensitive",
              },
            },
            {
              patternLinks: {
                some: {
                  pattern: {
                    OR: [
                      {
                        name: {
                          contains: query,
                          mode: "insensitive",
                        },
                      },
                      {
                        slug: {
                          contains: query,
                          mode: "insensitive",
                        },
                      },
                    ],
                  },
                },
              },
            },
          ],
        }
      : {}),
  };

  const orderBy: Prisma.ScenarioOrderByWithRelationInput[] =
    filters.sort === "created-desc"
      ? [{ createdAt: "desc" }, { name: "asc" }]
      : filters.sort === "updated-desc"
        ? [{ updatedAt: "desc" }, { name: "asc" }]
        : [{ name: "asc" }];

  return prisma.scenario.findMany({
    where,
    orderBy,
    select: {
      id: true,
      slug: true,
      name: true,
      summary: true,
      patternLinks: {
        select: {
          pattern: {
            select: {
              id: true,
              slug: true,
              name: true,
              category: true,
              layer: true,
            },
          },
        },
        orderBy: {
          pattern: {
            name: "asc",
          },
        },
      },
      _count: {
        select: {
          technologyLinks: true,
        },
      },
    },
  });
}

export async function listOptionalScenarios(
  filters: ScenarioCatalogFilters = {},
) {
  if (!process.env.DATABASE_URL) {
    return null;
  }

  try {
    return await listScenarios(filters);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientInitializationError) {
      console.warn(
        "[catalog] PostgreSQL is unavailable; scenario list cannot be loaded.",
      );

      return null;
    }

    throw error;
  }
}
