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

  const facade = await prisma.pattern.upsert({
    where: { slug: "facade" },
    update: {
      name: "Facade",
      summary:
        "Provides a simplified, unified interface to a complex subsystem while hiding the coordination of its underlying components.",
      category: "Structural",
      layer: "Application",
      status: "ACTIVE",
    },
    create: {
      slug: "facade",
      name: "Facade",
      summary:
        "Provides a simplified, unified interface to a complex subsystem while hiding the coordination of its underlying components.",
      category: "Structural",
      layer: "Application",
      status: "ACTIVE",
    },
  });

  const factoryMethod = await prisma.pattern.upsert({
    where: { slug: "factory-method" },
    update: {
      name: "Factory Method",
      summary:
        "Defines an interface for creating an object while allowing subclasses or specialized creators to determine the concrete product that is returned.",
      category: "Creational",
      layer: "Application",
      status: "ACTIVE",
    },
    create: {
      slug: "factory-method",
      name: "Factory Method",
      summary:
        "Defines an interface for creating an object while allowing subclasses or specialized creators to determine the concrete product that is returned.",
      category: "Creational",
      layer: "Application",
      status: "ACTIVE",
    },
  });

  const flyweight = await prisma.pattern.upsert({
    where: { slug: "flyweight" },
    update: {
      name: "Flyweight",
      summary:
        "Shares common intrinsic state across many objects while externalizing context-specific state to reduce memory use.",
      category: "Structural",
      layer: "Application",
      status: "ACTIVE",
    },
    create: {
      slug: "flyweight",
      name: "Flyweight",
      summary:
        "Shares common intrinsic state across many objects while externalizing context-specific state to reduce memory use.",
      category: "Structural",
      layer: "Application",
      status: "ACTIVE",
    },
  });

  const interpreter = await prisma.pattern.upsert({
    where: { slug: "interpreter" },
    update: {
      name: "Interpreter",
      summary:
        "Defines a grammar for a simple language and represents its rules as expressions that can interpret sentences in a context.",
      category: "Behavioral",
      layer: "Application",
      status: "ACTIVE",
    },
    create: {
      slug: "interpreter",
      name: "Interpreter",
      summary:
        "Defines a grammar for a simple language and represents its rules as expressions that can interpret sentences in a context.",
      category: "Behavioral",
      layer: "Application",
      status: "ACTIVE",
    },
  });

  const iterator = await prisma.pattern.upsert({
    where: { slug: "iterator" },
    update: {
      name: "Iterator",
      summary:
        "Provides a way to traverse elements of a collection sequentially without exposing its underlying representation.",
      category: "Behavioral",
      layer: "Application",
      status: "ACTIVE",
    },
    create: {
      slug: "iterator",
      name: "Iterator",
      summary:
        "Provides a way to traverse elements of a collection sequentially without exposing its underlying representation.",
      category: "Behavioral",
      layer: "Application",
      status: "ACTIVE",
    },
  });

  const mediator = await prisma.pattern.upsert({
    where: { slug: "mediator" },
    update: {
      name: "Mediator",
      summary:
        "Centralizes communication and coordination between related objects so they collaborate through a mediator instead of depending on one another directly.",
      category: "Behavioral",
      layer: "Application",
      status: "ACTIVE",
    },
    create: {
      slug: "mediator",
      name: "Mediator",
      summary:
        "Centralizes communication and coordination between related objects so they collaborate through a mediator instead of depending on one another directly.",
      category: "Behavioral",
      layer: "Application",
      status: "ACTIVE",
    },
  });

  const memento = await prisma.pattern.upsert({
    where: { slug: "memento" },
    update: {
      name: "Memento",
      summary:
        "Captures and externalizes an object's internal state so it can be restored later without exposing implementation details.",
      category: "Behavioral",
      layer: "Application",
      status: "ACTIVE",
    },
    create: {
      slug: "memento",
      name: "Memento",
      summary:
        "Captures and externalizes an object's internal state so it can be restored later without exposing implementation details.",
      category: "Behavioral",
      layer: "Application",
      status: "ACTIVE",
    },
  });

  const observer = await prisma.pattern.upsert({
    where: { slug: "observer" },
    update: {
      name: "Observer",
      summary:
        "Defines a subscription mechanism so a subject can notify multiple observers when its state changes or relevant events occur.",
      category: "Behavioral",
      layer: "Application",
      status: "ACTIVE",
    },
    create: {
      slug: "observer",
      name: "Observer",
      summary:
        "Defines a subscription mechanism so a subject can notify multiple observers when its state changes or relevant events occur.",
      category: "Behavioral",
      layer: "Application",
      status: "ACTIVE",
    },
  });

  const prototype = await prisma.pattern.upsert({
    where: { slug: "prototype" },
    update: {
      name: "Prototype",
      summary:
        "Creates new objects by cloning existing prototype instances instead of constructing them from scratch or depending on concrete classes.",
      category: "Creational",
      layer: "Application",
      status: "ACTIVE",
    },
    create: {
      slug: "prototype",
      name: "Prototype",
      summary:
        "Creates new objects by cloning existing prototype instances instead of constructing them from scratch or depending on concrete classes.",
      category: "Creational",
      layer: "Application",
      status: "ACTIVE",
    },
  });

  const proxy = await prisma.pattern.upsert({
    where: { slug: "proxy" },
    update: {
      name: "Proxy",
      summary:
        "Provides a substitute for another object that implements the same interface and controls access to the underlying service.",
      category: "Structural",
      layer: "Application",
      status: "ACTIVE",
    },
    create: {
      slug: "proxy",
      name: "Proxy",
      summary:
        "Provides a substitute for another object that implements the same interface and controls access to the underlying service.",
      category: "Structural",
      layer: "Application",
      status: "ACTIVE",
    },
  });

  const singleton = await prisma.pattern.upsert({
    where: { slug: "singleton" },
    update: {
      name: "Singleton",
      summary:
        "Ensures a class has only one instance and provides a controlled global access point to that shared instance.",
      category: "Creational",
      layer: "Application",
      status: "ACTIVE",
    },
    create: {
      slug: "singleton",
      name: "Singleton",
      summary:
        "Ensures a class has only one instance and provides a controlled global access point to that shared instance.",
      category: "Creational",
      layer: "Application",
      status: "ACTIVE",
    },
  });

  const state = await prisma.pattern.upsert({
    where: { slug: "state" },
    update: {
      name: "State",
      summary:
        "Allows an object to alter its behavior when its internal state changes by delegating state-specific work to separate state objects.",
      category: "Behavioral",
      layer: "Application",
      status: "ACTIVE",
    },
    create: {
      slug: "state",
      name: "State",
      summary:
        "Allows an object to alter its behavior when its internal state changes by delegating state-specific work to separate state objects.",
      category: "Behavioral",
      layer: "Application",
      status: "ACTIVE",
    },
  });

  const strategy = await prisma.pattern.upsert({
    where: { slug: "strategy" },
    update: {
      name: "Strategy",
      summary:
        "Defines a family of interchangeable algorithms and delegates behavior to the selected strategy without changing the context that uses it.",
      category: "Behavioral",
      layer: "Application",
      status: "ACTIVE",
    },
    create: {
      slug: "strategy",
      name: "Strategy",
      summary:
        "Defines a family of interchangeable algorithms and delegates behavior to the selected strategy without changing the context that uses it.",
      category: "Behavioral",
      layer: "Application",
      status: "ACTIVE",
    },
  });

  const templateMethod = await prisma.pattern.upsert({
    where: { slug: "template-method" },
    update: {
      name: "Template Method",
      summary:
        "Defines the fixed skeleton of an algorithm in a base type while allowing subclasses to customize selected steps without changing the overall sequence.",
      category: "Behavioral",
      layer: "Application",
      status: "ACTIVE",
    },
    create: {
      slug: "template-method",
      name: "Template Method",
      summary:
        "Defines the fixed skeleton of an algorithm in a base type while allowing subclasses to customize selected steps without changing the overall sequence.",
      category: "Behavioral",
      layer: "Application",
      status: "ACTIVE",
    },
  });

  const visitor = await prisma.pattern.upsert({
    where: { slug: "visitor" },
    update: {
      name: "Visitor",
      summary:
        "Separates operations from an object structure so new behavior can be added through visitors without changing the element classes.",
      category: "Behavioral",
      layer: "Application",
      status: "ACTIVE",
    },
    create: {
      slug: "visitor",
      name: "Visitor",
      summary:
        "Separates operations from an object structure so new behavior can be added through visitors without changing the element classes.",
      category: "Behavioral",
      layer: "Application",
      status: "ACTIVE",
    },
  });

  await prisma.patternVariant.upsert({
    where: { slug: "strategy-typescript-payment-methods" },
    update: {
      patternId: strategy.id,
      coreLanguageId: typescript.id,
      technologyId: null,
      title: "TypeScript payment method strategies",
      summary:
        "Encapsulates card and PayPal payment behavior behind a shared interface so checkout selects a payment algorithm without branching through each method.",
      layer: "Application",
      code: `interface PaymentStrategy {
  pay(amountInCents: number): Promise<void>;
}

class CardPayment implements PaymentStrategy {
  async pay(amountInCents: number) {
    console.log(\`Charging card for \${amountInCents} cents\`);
  }
}

class PayPalPayment implements PaymentStrategy {
  async pay(amountInCents: number) {
    console.log(\`Charging PayPal for \${amountInCents} cents\`);
  }
}

class CheckoutService {
  constructor(private readonly paymentStrategy: PaymentStrategy) {}

  checkout(amountInCents: number) {
    return this.paymentStrategy.pay(amountInCents);
  }
}`,
    },
    create: {
      slug: "strategy-typescript-payment-methods",
      patternId: strategy.id,
      coreLanguageId: typescript.id,
      technologyId: null,
      title: "TypeScript payment method strategies",
      summary:
        "Encapsulates card and PayPal payment behavior behind a shared interface so checkout selects a payment algorithm without branching through each method.",
      layer: "Application",
      code: `interface PaymentStrategy {
  pay(amountInCents: number): Promise<void>;
}

class CardPayment implements PaymentStrategy {
  async pay(amountInCents: number) {
    console.log(\`Charging card for \${amountInCents} cents\`);
  }
}

class PayPalPayment implements PaymentStrategy {
  async pay(amountInCents: number) {
    console.log(\`Charging PayPal for \${amountInCents} cents\`);
  }
}

class CheckoutService {
  constructor(private readonly paymentStrategy: PaymentStrategy) {}

  checkout(amountInCents: number) {
    return this.paymentStrategy.pay(amountInCents);
  }
}`,
    },
  });

  await prisma.patternVariant.upsert({
    where: { slug: "template-method-typescript-order-processing" },
    update: {
      patternId: templateMethod.id,
      coreLanguageId: typescript.id,
      technologyId: null,
      title: "TypeScript order processing template",
      summary:
        "Keeps the order-processing sequence fixed while subclasses customize validation and fulfillment for different order types.",
      layer: "Application",
      code: `abstract class OrderProcessor {
  async process(orderId: string) {
    await this.validate(orderId);
    await this.reserveInventory(orderId);
    await this.fulfill(orderId);
  }

  protected abstract validate(orderId: string): Promise<void>;

  protected async reserveInventory(orderId: string) {
    console.log(\`Reserving inventory for \${orderId}\`);
  }

  protected abstract fulfill(orderId: string): Promise<void>;
}

class DigitalOrderProcessor extends OrderProcessor {
  protected async validate(orderId: string) {
    console.log(\`Validating digital order \${orderId}\`);
  }

  protected async fulfill(orderId: string) {
    console.log(\`Emailing download link for \${orderId}\`);
  }
}`,
    },
    create: {
      slug: "template-method-typescript-order-processing",
      patternId: templateMethod.id,
      coreLanguageId: typescript.id,
      technologyId: null,
      title: "TypeScript order processing template",
      summary:
        "Keeps the order-processing sequence fixed while subclasses customize validation and fulfillment for different order types.",
      layer: "Application",
      code: `abstract class OrderProcessor {
  async process(orderId: string) {
    await this.validate(orderId);
    await this.reserveInventory(orderId);
    await this.fulfill(orderId);
  }

  protected abstract validate(orderId: string): Promise<void>;

  protected async reserveInventory(orderId: string) {
    console.log(\`Reserving inventory for \${orderId}\`);
  }

  protected abstract fulfill(orderId: string): Promise<void>;
}

class DigitalOrderProcessor extends OrderProcessor {
  protected async validate(orderId: string) {
    console.log(\`Validating digital order \${orderId}\`);
  }

  protected async fulfill(orderId: string) {
    console.log(\`Emailing download link for \${orderId}\`);
  }
}`,
    },
  });

  await prisma.patternVariant.upsert({
    where: { slug: "visitor-typescript-shape-operations" },
    update: {
      patternId: visitor.id,
      coreLanguageId: typescript.id,
      technologyId: null,
      title: "TypeScript shape operation visitors",
      summary:
        "Moves rendering and measurement operations into visitors so shape classes remain stable when new operations are introduced.",
      layer: "Application",
      code: `interface ShapeVisitor<Result> {
  visitCircle(circle: Circle): Result;
  visitRectangle(rectangle: Rectangle): Result;
}

interface Shape {
  accept<Result>(visitor: ShapeVisitor<Result>): Result;
}

class Circle implements Shape {
  constructor(readonly radius: number) {}

  accept<Result>(visitor: ShapeVisitor<Result>) {
    return visitor.visitCircle(this);
  }
}

class Rectangle implements Shape {
  constructor(
    readonly width: number,
    readonly height: number,
  ) {}

  accept<Result>(visitor: ShapeVisitor<Result>) {
    return visitor.visitRectangle(this);
  }
}

class AreaVisitor implements ShapeVisitor<number> {
  visitCircle(circle: Circle) {
    return Math.PI * circle.radius ** 2;
  }

  visitRectangle(rectangle: Rectangle) {
    return rectangle.width * rectangle.height;
  }
}`,
    },
    create: {
      slug: "visitor-typescript-shape-operations",
      patternId: visitor.id,
      coreLanguageId: typescript.id,
      technologyId: null,
      title: "TypeScript shape operation visitors",
      summary:
        "Moves rendering and measurement operations into visitors so shape classes remain stable when new operations are introduced.",
      layer: "Application",
      code: `interface ShapeVisitor<Result> {
  visitCircle(circle: Circle): Result;
  visitRectangle(rectangle: Rectangle): Result;
}

interface Shape {
  accept<Result>(visitor: ShapeVisitor<Result>): Result;
}

class Circle implements Shape {
  constructor(readonly radius: number) {}

  accept<Result>(visitor: ShapeVisitor<Result>) {
    return visitor.visitCircle(this);
  }
}

class Rectangle implements Shape {
  constructor(
    readonly width: number,
    readonly height: number,
  ) {}

  accept<Result>(visitor: ShapeVisitor<Result>) {
    return visitor.visitRectangle(this);
  }
}

class AreaVisitor implements ShapeVisitor<number> {
  visitCircle(circle: Circle) {
    return Math.PI * circle.radius ** 2;
  }

  visitRectangle(rectangle: Rectangle) {
    return rectangle.width * rectangle.height;
  }
}`,
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
