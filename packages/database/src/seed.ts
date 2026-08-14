import { prisma } from "./client.js";

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

  const scenario = await prisma.scenario.upsert({
    where: { slug: "third-party-task-api" },
    update: {
      name: "Third-party task API integration",
      summary:
        "Integrate an external task provider behind an application-owned interface.",
      problemStatement:
        "The application depends on a third-party task API whose contract differs from the internal domain model.",
      status: "ACTIVE",
    },
    create: {
      slug: "third-party-task-api",
      name: "Third-party task API integration",
      summary:
        "Integrate an external task provider behind an application-owned interface.",
      problemStatement:
        "The application depends on a third-party task API whose contract differs from the internal domain model.",
      status: "ACTIVE",
    },
  });

  const technologies = await Promise.all([
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

  await prisma.scenarioPattern.upsert({
    where: {
      scenarioId_patternId: {
        scenarioId: scenario.id,
        patternId: adapter.id,
      },
    },
    update: {},
    create: {
      scenarioId: scenario.id,
      patternId: adapter.id,
    },
  });

  for (const technology of technologies) {
    await prisma.scenarioTechnology.upsert({
      where: {
        scenarioId_technologyId: {
          scenarioId: scenario.id,
          technologyId: technology.id,
        },
      },
      update: {},
      create: {
        scenarioId: scenario.id,
        technologyId: technology.id,
      },
    });
  }

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