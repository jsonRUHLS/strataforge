export type AuthoredPatternVariant = {
  slug: string;
  patternSlug: string;
  coreLanguageSlug: string;
  title: string;
  summary: string;
  layer: string;
  code: string;
};

export const authoredPatternVariants: AuthoredPatternVariant[] = [
  {
    slug: "abstract-factory-typescript",
    patternSlug: "abstract-factory",
    coreLanguageSlug: "typescript",
    title: "Abstract Factory in TypeScript",
    summary:
      "Creates matching button and dialog families for a selected UI theme without exposing concrete component classes to application code.",
    layer: "Application",
    code: `interface Button {
  render(): string;
}

interface Dialog {
  render(): string;
}

interface UiFactory {
  createButton(): Button;
  createDialog(): Dialog;
}

class LightButton implements Button {
  render() {
    return "Light button";
  }
}

class LightDialog implements Dialog {
  render() {
    return "Light dialog";
  }
}

class DarkButton implements Button {
  render() {
    return "Dark button";
  }
}

class DarkDialog implements Dialog {
  render() {
    return "Dark dialog";
  }
}

class LightUiFactory implements UiFactory {
  createButton() {
    return new LightButton();
  }

  createDialog() {
    return new LightDialog();
  }
}

class DarkUiFactory implements UiFactory {
  createButton() {
    return new DarkButton();
  }

  createDialog() {
    return new DarkDialog();
  }
}

function renderSettings(factory: UiFactory) {
  return [
    factory.createButton().render(),
    factory.createDialog().render(),
  ];
}`,
  },
  {
    slug: "adapter-typescript",
    patternSlug: "adapter",
    coreLanguageSlug: "typescript",
    title: "Adapter in TypeScript",
    summary: "A TypeScript implementation of the Adapter pattern.",
    layer: "Application",
    code: `export interface TaskProvider {
  getTask(id: string): Promise<Task>;
}`,
  },
  {
    slug: "builder-typescript",
    patternSlug: "builder",
    coreLanguageSlug: "typescript",
    title: "Builder in TypeScript",
    summary:
      "Builds an immutable deployment configuration step by step while keeping construction details separate from the final configuration object.",
    layer: "Application",
    code: `type DeploymentConfig = {
  serviceName: string;
  replicas: number;
  environment: "development" | "staging" | "production";
  healthCheckPath?: string;
};

class DeploymentConfigBuilder {
  private serviceName?: string;
  private replicas = 1;
  private environment: DeploymentConfig["environment"] = "development";
  private healthCheckPath?: string;

  withServiceName(serviceName: string) {
    this.serviceName = serviceName;
    return this;
  }

  withReplicas(replicas: number) {
    this.replicas = replicas;
    return this;
  }

  forEnvironment(environment: DeploymentConfig["environment"]) {
    this.environment = environment;
    return this;
  }

  withHealthCheck(path: string) {
    this.healthCheckPath = path;
    return this;
  }

  build(): DeploymentConfig {
    if (!this.serviceName) {
      throw new Error("A service name is required.");
    }

    return {
      serviceName: this.serviceName,
      replicas: this.replicas,
      environment: this.environment,
      healthCheckPath: this.healthCheckPath,
    };
  }
}

const productionConfig = new DeploymentConfigBuilder()
  .withServiceName("billing-api")
  .withReplicas(3)
  .forEnvironment("production")
  .withHealthCheck("/health")
  .build();`,
  },
  {
    slug: "factory-method-typescript",
    patternSlug: "factory-method",
    coreLanguageSlug: "typescript",
    title: "Factory Method in TypeScript",
    summary:
      "Lets notification creators select the concrete notification channel while the shared delivery workflow depends only on a common notification interface.",
    layer: "Application",
    code: `interface Notification {
  send(recipient: string, message: string): Promise<void>;
}

class EmailNotification implements Notification {
  async send(recipient: string, message: string) {
    console.log(\`Email to \${recipient}: \${message}\`);
  }
}

class SmsNotification implements Notification {
  async send(recipient: string, message: string) {
    console.log(\`SMS to \${recipient}: \${message}\`);
  }
}

abstract class NotificationCreator {
  async notify(recipient: string, message: string) {
    const notification = this.createNotification();
    await notification.send(recipient, message);
  }

  protected abstract createNotification(): Notification;
}

class EmailNotificationCreator extends NotificationCreator {
  protected createNotification(): Notification {
    return new EmailNotification();
  }
}

class SmsNotificationCreator extends NotificationCreator {
  protected createNotification(): Notification {
    return new SmsNotification();
  }
}

const creator = new EmailNotificationCreator();
await creator.notify("team@example.com", "Deployment completed.");`,
  },
  {
    slug: "prototype-typescript",
    patternSlug: "prototype",
    coreLanguageSlug: "typescript",
    title: "Prototype in TypeScript",
    summary:
      "Creates independent deployment templates by cloning a configured prototype and changing only the environment-specific values.",
    layer: "Application",
    code: `interface Prototype<T> {
  clone(): T;
}

class DeploymentTemplate implements Prototype<DeploymentTemplate> {
  constructor(
    readonly serviceName: string,
    readonly replicas: number,
    readonly labels: Record<string, string>,
  ) {}

  clone(): DeploymentTemplate {
    return new DeploymentTemplate(
      this.serviceName,
      this.replicas,
      { ...this.labels },
    );
  }

  withEnvironment(environment: string): DeploymentTemplate {
    const copy = this.clone();

    return new DeploymentTemplate(
      copy.serviceName,
      copy.replicas,
      {
        ...copy.labels,
        environment,
      },
    );
  }
}

const baseTemplate = new DeploymentTemplate(
  "billing-api",
  2,
  { owner: "payments" },
);

const productionTemplate = baseTemplate.withEnvironment("production");`,
  },
  {
    slug: "singleton-typescript",
    patternSlug: "singleton",
    coreLanguageSlug: "typescript",
    title: "Singleton in TypeScript",
    summary:
      "Provides one lazily initialized application configuration store with a controlled shared access point.",
    layer: "Application",
    code: `class ApplicationConfig {
  private static instance: ApplicationConfig | undefined;

  private readonly values = new Map<string, string>();

  private constructor() {
    this.values.set("region", "us-east-1");
  }

  static getInstance(): ApplicationConfig {
    if (!ApplicationConfig.instance) {
      ApplicationConfig.instance = new ApplicationConfig();
    }

    return ApplicationConfig.instance;
  }

  get(key: string): string | undefined {
    return this.values.get(key);
  }

  set(key: string, value: string) {
    this.values.set(key, value);
  }
}

const configA = ApplicationConfig.getInstance();
const configB = ApplicationConfig.getInstance();

configA.set("feature.checkoutV2", "enabled");

console.log(configA === configB); // true
console.log(configB.get("feature.checkoutV2")); // enabled`,
  },
  {
    slug: "strategy-typescript-payment-methods",
    patternSlug: "strategy",
    coreLanguageSlug: "typescript",
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
  {
    slug: "template-method-typescript-order-processing",
    patternSlug: "template-method",
    coreLanguageSlug: "typescript",
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
  {
    slug: "visitor-typescript-shape-operations",
    patternSlug: "visitor",
    coreLanguageSlug: "typescript",
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
];
