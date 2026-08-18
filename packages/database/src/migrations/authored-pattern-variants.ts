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
