import { prisma } from "./client.js";
import { authoredScenarioMigrations } from "./migrations/authored-scenarios.js";

async function requirePatternId(slug: string) {
  const pattern = await prisma.pattern.findUnique({
    where: { slug },
    select: { id: true },
  });

  if (!pattern) {
    throw new Error(
      `[seed] Scenario migration references missing pattern "${slug}".`,
    );
  }

  return pattern.id;
}

async function requireTechnologyId(slug: string) {
  const technology = await prisma.technology.findUnique({
    where: { slug },
    select: { id: true },
  });

  if (!technology) {
    throw new Error(
      `[seed] Scenario migration references missing technology "${slug}".`,
    );
  }

  return technology.id;
}

async function seedScenarios() {
  for (const migration of authoredScenarioMigrations) {
    const scenario = await prisma.scenario.upsert({
      where: { slug: migration.slug },
      update: {
        name: migration.name,
        summary: migration.summary,
        problemStatement: migration.problemStatement,
        status: "ACTIVE",
      },
      create: {
        slug: migration.slug,
        name: migration.name,
        summary: migration.summary,
        problemStatement: migration.problemStatement,
        status: "ACTIVE",
      },
      select: {
        id: true,
      },
    });

    for (const patternSlug of migration.patternSlugs) {
      const patternId = await requirePatternId(patternSlug);

      await prisma.scenarioPattern.upsert({
        where: {
          scenarioId_patternId: {
            scenarioId: scenario.id,
            patternId,
          },
        },
        update: {},
        create: {
          scenarioId: scenario.id,
          patternId,
        },
      });
    }

    for (const technologySlug of migration.technologySlugs) {
      const technologyId = await requireTechnologyId(technologySlug);

      await prisma.scenarioTechnology.upsert({
        where: {
          scenarioId_technologyId: {
            scenarioId: scenario.id,
            technologyId,
          },
        },
        update: {},
        create: {
          scenarioId: scenario.id,
          technologyId,
        },
      });
    }

    console.log(
      `[seed] Scenario "${migration.slug}" linked to ${migration.patternSlugs.length} pattern(s) and ${migration.technologySlugs.length} technology record(s).`,
    );
  }
}

async function main() {
  const typescript = await prisma.coreLanguage.upsert({
    where: { slug: "typescript" },
    update: {
      name: "TypeScript",
      ecosystem: "Node.js / Web",
      status: "ACTIVE",
    },
    create: {
      slug: "typescript",
      name: "TypeScript",
      ecosystem: "Node.js / Web",
      status: "ACTIVE",
    },
  });

  const adapter = await prisma.pattern.upsert({
    where: { slug: "adapter" },
    update: {
      name: "Adapter",
      summary:
        "Converts one interface into another interface that a client expects.",
      category: "Structural",
      layer: "Application",
      status: "ACTIVE",
    },
    create: {
      slug: "adapter",
      name: "Adapter",
      summary:
        "Converts one interface into another interface that a client expects.",
      category: "Structural",
      layer: "Application",
      status: "ACTIVE",
    },
  });

  await prisma.patternVariant.upsert({
    where: { slug: "adapter-typescript" },
    update: {
      patternId: adapter.id,
      coreLanguageId: typescript.id,
      title: "Adapter in TypeScript",
      summary: "A TypeScript implementation of the Adapter pattern.",
      layer: "Application",
      code: `export interface TaskProvider {
  getTask(id: string): Promise<Task>;
}`,
    },
    create: {
      slug: "adapter-typescript",
      patternId: adapter.id,
      coreLanguageId: typescript.id,
      title: "Adapter in TypeScript",
      summary: "A TypeScript implementation of the Adapter pattern.",
      layer: "Application",
      code: `export interface TaskProvider {
  getTask(id: string): Promise<Task>;
}`,
    },
  });

  const abstractFactory = await prisma.pattern.upsert({
    where: { slug: "abstract-factory" },
    update: {
      name: "Abstract Factory",
      summary:
        "Provides an interface for creating families of related objects without specifying their concrete classes.",
      category: "Creational",
      layer: "Application",
      status: "ACTIVE",
    },
    create: {
      slug: "abstract-factory",
      name: "Abstract Factory",
      summary:
        "Provides an interface for creating families of related objects without specifying their concrete classes.",
      category: "Creational",
      layer: "Application",
      status: "ACTIVE",
    },
  });

  const bridge = await prisma.pattern.upsert({
    where: { slug: "bridge" },
    update: {
      name: "Bridge",
      summary:
        "Decouples an abstraction from its implementation so both can vary independently.",
      category: "Structural",
      layer: "Application",
      status: "ACTIVE",
    },
    create: {
      slug: "bridge",
      name: "Bridge",
      summary:
        "Decouples an abstraction from its implementation so both can vary independently.",
      category: "Structural",
      layer: "Application",
      status: "ACTIVE",
    },
  });

  const builder = await prisma.pattern.upsert({
    where: { slug: "builder" },
    update: {
      name: "Builder",
      summary:
        "Separates the construction of a complex object from its representation so the same construction process can create different representations.",
      category: "Creational",
      layer: "Application",
      status: "ACTIVE",
    },
    create: {
      slug: "builder",
      name: "Builder",
      summary:
        "Separates the construction of a complex object from its representation so the same construction process can create different representations.",
      category: "Creational",
      layer: "Application",
      status: "ACTIVE",
    },
  });

  const chainOfResponsibility = await prisma.pattern.upsert({
    where: { slug: "chain-of-responsibility" },
    update: {
      name: "Chain of Responsibility",
      summary:
        "Passes a request along a chain of handlers until one handles it, allowing senders and receivers to remain decoupled.",
      category: "Behavioral",
      layer: "Application",
      status: "ACTIVE",
    },
    create: {
      slug: "chain-of-responsibility",
      name: "Chain of Responsibility",
      summary:
        "Passes a request along a chain of handlers until one handles it, allowing senders and receivers to remain decoupled.",
      category: "Behavioral",
      layer: "Application",
      status: "ACTIVE",
    },
  });

  const command = await prisma.pattern.upsert({
    where: { slug: "command" },
    update: {
      name: "Command",
      summary:
        "Encapsulates a request as an object so it can be parameterized, queued, logged, executed later, or undone.",
      category: "Behavioral",
      layer: "Application",
      status: "ACTIVE",
    },
    create: {
      slug: "command",
      name: "Command",
      summary:
        "Encapsulates a request as an object so it can be parameterized, queued, logged, executed later, or undone.",
      category: "Behavioral",
      layer: "Application",
      status: "ACTIVE",
    },
  });

  const composite = await prisma.pattern.upsert({
    where: { slug: "composite" },
    update: {
      name: "Composite",
      summary:
        "Composes objects into tree structures so individual objects and groups of objects can be treated uniformly through a common interface.",
      category: "Structural",
      layer: "Application",
      status: "ACTIVE",
    },
    create: {
      slug: "composite",
      name: "Composite",
      summary:
        "Composes objects into tree structures so individual objects and groups of objects can be treated uniformly through a common interface.",
      category: "Structural",
      layer: "Application",
      status: "ACTIVE",
    },
  });

  const decorator = await prisma.pattern.upsert({
    where: { slug: "decorator" },
    update: {
      name: "Decorator",
      summary:
        "Attaches additional behavior to an object dynamically by wrapping it with objects that implement the same interface.",
      category: "Structural",
      layer: "Application",
      status: "ACTIVE",
    },
    create: {
      slug: "decorator",
      name: "Decorator",
      summary:
        "Attaches additional behavior to an object dynamically by wrapping it with objects that implement the same interface.",
      category: "Structural",
      layer: "Application",
      status: "ACTIVE",
    },
  });

  await Promise.all([
    prisma.technology.upsert({
      where: { slug: "apollo-client" },
      update: {
        name: "Apollo Client",
        kind: "LIBRARY",
        summary: "GraphQL client for application data fetching and caching.",
        status: "ACTIVE",
      },
      create: {
        slug: "apollo-client",
        name: "Apollo Client",
        kind: "LIBRARY",
        summary: "GraphQL client for application data fetching and caching.",
        status: "ACTIVE",
      },
    }),
    prisma.technology.upsert({
      where: { slug: "typeorm" },
      update: {
        name: "TypeORM",
        kind: "LIBRARY",
        summary: "TypeScript ORM for relational databases.",
        status: "ACTIVE",
        coreLanguageId: typescript.id,
      },
      create: {
        slug: "typeorm",
        name: "TypeORM",
        kind: "LIBRARY",
        summary: "TypeScript ORM for relational databases.",
        status: "ACTIVE",
        coreLanguageId: typescript.id,
      },
    }),
    prisma.technology.upsert({
      where: { slug: "postgresql" },
      update: {
        name: "PostgreSQL",
        kind: "DATABASE",
        summary: "Open-source relational database.",
        status: "ACTIVE",
      },
      create: {
        slug: "postgresql",
        name: "PostgreSQL",
        kind: "DATABASE",
        summary: "Open-source relational database.",
        status: "ACTIVE",
      },
    }),
    prisma.technology.upsert({
      where: { slug: "apache-kafka" },
      update: {
        name: "Apache Kafka",
        kind: "MESSAGE_BROKER",
        summary: "Distributed event-streaming platform.",
        status: "ACTIVE",
      },
      create: {
        slug: "apache-kafka",
        name: "Apache Kafka",
        kind: "MESSAGE_BROKER",
        summary: "Distributed event-streaming platform.",
        status: "ACTIVE",
      },
    }),
    prisma.technology.upsert({
      where: { slug: "clickhouse" },
      update: {
        name: "ClickHouse",
        kind: "DATABASE",
        summary: "Column-oriented database for analytical workloads.",
        status: "ACTIVE",
      },
      create: {
        slug: "clickhouse",
        name: "ClickHouse",
        kind: "DATABASE",
        summary: "Column-oriented database for analytical workloads.",
        status: "ACTIVE",
      },
    }),
    prisma.technology.upsert({
      where: { slug: "grafana" },
      update: {
        name: "Grafana",
        kind: "OBSERVABILITY_TOOL",
        summary: "Observability visualization and dashboard platform.",
        status: "ACTIVE",
      },
      create: {
        slug: "grafana",
        name: "Grafana",
        kind: "OBSERVABILITY_TOOL",
        summary: "Observability visualization and dashboard platform.",
        status: "ACTIVE",
      },
    }),
  ]);

  await seedScenarios();

  console.log("Catalog seed completed.");
}

main()
  .catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
