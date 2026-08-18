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
    slug: "bridge-typescript",
    patternSlug: "bridge",
    coreLanguageSlug: "typescript",
    title: "Bridge in TypeScript",
    summary:
      "Separates remote-control behavior from device implementations so remotes and devices can evolve independently.",
    layer: "Application",
    code: `interface Device {
  enable(): void;
  disable(): void;
  isEnabled(): boolean;
  setVolume(percent: number): void;
}

class Television implements Device {
  private enabled = false;

  enable() {
    this.enabled = true;
  }

  disable() {
    this.enabled = false;
  }

  isEnabled() {
    return this.enabled;
  }

  setVolume(percent: number) {
    console.log(\`TV volume set to \${percent}%\`);
  }
}

class Speaker implements Device {
  private enabled = false;

  enable() {
    this.enabled = true;
  }

  disable() {
    this.enabled = false;
  }

  isEnabled() {
    return this.enabled;
  }

  setVolume(percent: number) {
    console.log(\`Speaker volume set to \${percent}%\`);
  }
}

class RemoteControl {
  constructor(protected readonly device: Device) {}

  togglePower() {
    if (this.device.isEnabled()) {
      this.device.disable();
    } else {
      this.device.enable();
    }
  }
}

class VolumeRemoteControl extends RemoteControl {
  volumeUp() {
    this.device.setVolume(70);
  }
}

const remote = new VolumeRemoteControl(new Speaker());

remote.togglePower();
remote.volumeUp();`,
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
    slug: "chain-of-responsibility-typescript",
    patternSlug: "chain-of-responsibility",
    coreLanguageSlug: "typescript",
    title: "Chain of Responsibility in TypeScript",
    summary:
      "Routes a support request through specialized handlers until one can resolve it, without coupling the requester to a specific handler.",
    layer: "Application",
    code: `type SupportRequest = {
  kind: "billing" | "technical" | "account";
  message: string;
};

abstract class SupportHandler {
  private next?: SupportHandler;

  setNext(handler: SupportHandler): SupportHandler {
    this.next = handler;
    return handler;
  }

  handle(request: SupportRequest): void {
    if (this.canHandle(request)) {
      this.resolve(request);
      return;
    }

    if (this.next) {
      this.next.handle(request);
      return;
    }

    console.log(\`No handler found for: \${request.message}\`);
  }

  protected abstract canHandle(request: SupportRequest): boolean;
  protected abstract resolve(request: SupportRequest): void;
}

class BillingHandler extends SupportHandler {
  protected canHandle(request: SupportRequest) {
    return request.kind === "billing";
  }

  protected resolve(request: SupportRequest) {
    console.log(\`Billing resolved: \${request.message}\`);
  }
}

class TechnicalHandler extends SupportHandler {
  protected canHandle(request: SupportRequest) {
    return request.kind === "technical";
  }

  protected resolve(request: SupportRequest) {
    console.log(\`Technical support resolved: \${request.message}\`);
  }
}

class AccountHandler extends SupportHandler {
  protected canHandle(request: SupportRequest) {
    return request.kind === "account";
  }

  protected resolve(request: SupportRequest) {
    console.log(\`Account support resolved: \${request.message}\`);
  }
}

const billing = new BillingHandler();
const technical = new TechnicalHandler();
const account = new AccountHandler();

billing.setNext(technical).setNext(account);

billing.handle({
  kind: "technical",
  message: "I cannot sign in to the dashboard.",
});`,
  },
  {
    slug: "command-typescript",
    patternSlug: "command",
    coreLanguageSlug: "typescript",
    title: "Command in TypeScript",
    summary:
      "Encapsulates document actions as objects so an editor can execute, queue, and undo operations without knowing their implementation details.",
    layer: "Application",
    code: `interface Command {
  execute(): void;
  undo(): void;
}

class Document {
  private content = "";

  append(text: string) {
    this.content += text;
  }

  removeLast(count: number) {
    this.content = this.content.slice(0, -count);
  }

  print() {
    console.log(this.content);
  }
}

class AppendTextCommand implements Command {
  constructor(
    private readonly document: Document,
    private readonly text: string,
  ) {}

  execute() {
    this.document.append(this.text);
  }

  undo() {
    this.document.removeLast(this.text.length);
  }
}

class Editor {
  private readonly history: Command[] = [];

  run(command: Command) {
    command.execute();
    this.history.push(command);
  }

  undo() {
    this.history.pop()?.undo();
  }
}

const document = new Document();
const editor = new Editor();

editor.run(new AppendTextCommand(document, "Hello, "));
editor.run(new AppendTextCommand(document, "world!"));

document.print();

editor.undo();
document.print();`,
  },
  {
    slug: "composite-typescript",
    patternSlug: "composite",
    coreLanguageSlug: "typescript",
    title: "Composite in TypeScript",
    summary:
      "Represents files and folders through one interface so callers can calculate the size of an individual file or an entire directory tree uniformly.",
    layer: "Application",
    code: `interface FileSystemNode {
  getName(): string;
  getSizeInBytes(): number;
}

class FileNode implements FileSystemNode {
  constructor(
    private readonly name: string,
    private readonly sizeInBytes: number,
  ) {}

  getName() {
    return this.name;
  }

  getSizeInBytes() {
    return this.sizeInBytes;
  }
}

class FolderNode implements FileSystemNode {
  private readonly children: FileSystemNode[] = [];

  constructor(private readonly name: string) {}

  getName() {
    return this.name;
  }

  add(child: FileSystemNode) {
    this.children.push(child);
  }

  getSizeInBytes() {
    return this.children.reduce(
      (total, child) => total + child.getSizeInBytes(),
      0,
    );
  }
}

const invoices = new FolderNode("invoices");
invoices.add(new FileNode("january.pdf", 120_000));
invoices.add(new FileNode("february.pdf", 140_000));

const archive = new FolderNode("archive");
archive.add(invoices);
archive.add(new FileNode("readme.txt", 2_000));

console.log(archive.getSizeInBytes());`,
  },
  {
    slug: "decorator-typescript",
    patternSlug: "decorator",
    coreLanguageSlug: "typescript",
    title: "Decorator in TypeScript",
    summary:
      "Adds logging and retry behavior to a notification sender by composing wrappers that preserve the same sending interface.",
    layer: "Application",
    code: `interface NotificationSender {
  send(recipient: string, message: string): Promise<void>;
}

class EmailSender implements NotificationSender {
  async send(recipient: string, message: string) {
    console.log(\`Sending email to \${recipient}: \${message}\`);
  }
}

abstract class NotificationSenderDecorator
  implements NotificationSender
{
  constructor(
    protected readonly sender: NotificationSender,
  ) {}

  send(recipient: string, message: string) {
    return this.sender.send(recipient, message);
  }
}

class LoggingSender extends NotificationSenderDecorator {
  async send(recipient: string, message: string) {
    console.log(\`Starting notification for \${recipient}\`);

    await super.send(recipient, message);

    console.log(\`Completed notification for \${recipient}\`);
  }
}

class RetryingSender extends NotificationSenderDecorator {
  async send(recipient: string, message: string) {
    try {
      await super.send(recipient, message);
    } catch (error) {
      console.warn("First attempt failed; retrying once.");
      await super.send(recipient, message);
    }
  }
}

const sender = new LoggingSender(
  new RetryingSender(new EmailSender()),
);

void sender.send("team@example.com", "Deployment completed.");`,
  },
  {
    slug: "facade-typescript",
    patternSlug: "facade",
    coreLanguageSlug: "typescript",
    title: "Facade in TypeScript",
    summary:
      "Provides one checkout operation that coordinates inventory, payment, and shipment subsystems without exposing their individual workflows to callers.",
    layer: "Application",
    code: `type OrderRequest = {
  orderId: string;
  sku: string;
  quantity: number;
  paymentToken: string;
};

class InventoryService {
  reserve(sku: string, quantity: number) {
    console.log(\`Reserved \${quantity} of \${sku}\`);
  }
}

class PaymentService {
  charge(paymentToken: string) {
    console.log(\`Charged payment token \${paymentToken}\`);
  }
}

class ShipmentService {
  createShipment(orderId: string) {
    console.log(\`Created shipment for \${orderId}\`);
  }
}

class CheckoutFacade {
  constructor(
    private readonly inventory: InventoryService,
    private readonly payments: PaymentService,
    private readonly shipments: ShipmentService,
  ) {}

  placeOrder(request: OrderRequest) {
    this.inventory.reserve(request.sku, request.quantity);
    this.payments.charge(request.paymentToken);
    this.shipments.createShipment(request.orderId);
  }
}

const checkout = new CheckoutFacade(
  new InventoryService(),
  new PaymentService(),
  new ShipmentService(),
);

checkout.placeOrder({
  orderId: "order-123",
  sku: "keyboard",
  quantity: 1,
  paymentToken: "token_abc",
});`,
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

void creator.notify(
  "team@example.com",
  "Deployment completed.",
);`,
  },
  {
    slug: "flyweight-typescript",
    patternSlug: "flyweight",
    coreLanguageSlug: "typescript",
    title: "Flyweight in TypeScript",
    summary:
      "Reuses shared text-style objects across many document characters while each character retains only its unique position and content.",
    layer: "Application",
    code: `type TextStyleKey = {
  fontFamily: string;
  fontSize: number;
  color: string;
};

class TextStyle {
  constructor(
    readonly fontFamily: string,
    readonly fontSize: number,
    readonly color: string,
  ) {}

  render(character: string, position: number) {
    console.log(
      \`Rendering "\${character}" at \${position} with \${this.fontFamily} \${this.fontSize}px \${this.color}\`,
    );
  }
}

class TextStyleFactory {
  private readonly styles = new Map<string, TextStyle>();

  getStyle(key: TextStyleKey): TextStyle {
    const cacheKey = \`\${key.fontFamily}:\${key.fontSize}:\${key.color}\`;
    const existing = this.styles.get(cacheKey);

    if (existing) {
      return existing;
    }

    const style = new TextStyle(
      key.fontFamily,
      key.fontSize,
      key.color,
    );

    this.styles.set(cacheKey, style);
    return style;
  }
}

class DocumentCharacter {
  constructor(
    private readonly value: string,
    private readonly position: number,
    private readonly style: TextStyle,
  ) {}

  render() {
    this.style.render(this.value, this.position);
  }
}

const styles = new TextStyleFactory();
const headingStyle = styles.getStyle({
  fontFamily: "Inter",
  fontSize: 24,
  color: "#ffffff",
});

const firstCharacter = new DocumentCharacter("H", 0, headingStyle);
const secondCharacter = new DocumentCharacter("i", 1, headingStyle);

firstCharacter.render();
secondCharacter.render();`,
  },
  {
    slug: "interpreter-typescript",
    patternSlug: "interpreter",
    coreLanguageSlug: "typescript",
    title: "Interpreter in TypeScript",
    summary:
      "Models a small rule language as expression objects that evaluate a user context to determine access.",
    layer: "Application",
    code: `type AccessContext = {
  role: string;
  region: string;
};

interface Expression {
  interpret(context: AccessContext): boolean;
}

class RoleExpression implements Expression {
  constructor(private readonly expectedRole: string) {}

  interpret(context: AccessContext) {
    return context.role === this.expectedRole;
  }
}

class RegionExpression implements Expression {
  constructor(private readonly expectedRegion: string) {}

  interpret(context: AccessContext) {
    return context.region === this.expectedRegion;
  }
}

class AndExpression implements Expression {
  constructor(
    private readonly left: Expression,
    private readonly right: Expression,
  ) {}

  interpret(context: AccessContext) {
    return this.left.interpret(context) && this.right.interpret(context);
  }
}

class OrExpression implements Expression {
  constructor(
    private readonly left: Expression,
    private readonly right: Expression,
  ) {}

  interpret(context: AccessContext) {
    return this.left.interpret(context) || this.right.interpret(context);
  }
}

const canManageBilling = new AndExpression(
  new RoleExpression("admin"),
  new RegionExpression("us"),
);

const canViewDashboard = new OrExpression(
  canManageBilling,
  new RoleExpression("analyst"),
);

console.log(
  canViewDashboard.interpret({
    role: "analyst",
    region: "eu",
  }),
);`,
  },
  {
    slug: "iterator-typescript",
    patternSlug: "iterator",
    coreLanguageSlug: "typescript",
    title: "Iterator in TypeScript",
    summary:
      "Exposes sequential traversal of a paginated result collection while keeping the collection’s storage details private.",
    layer: "Application",
    code: `type SearchResult = {
  id: string;
  title: string;
};

class SearchResults implements Iterable<SearchResult> {
  constructor(private readonly results: SearchResult[]) {}

  *[Symbol.iterator](): Iterator<SearchResult> {
    for (const result of this.results) {
      yield result;
    }
  }
}

const results = new SearchResults([
  { id: "result-1", title: "Architecture overview" },
  { id: "result-2", title: "Deployment guide" },
  { id: "result-3", title: "Incident playbook" },
]);

for (const result of results) {
  console.log(\`\${result.id}: \${result.title}\`);
}`,
  },
  {
    slug: "mediator-typescript",
    patternSlug: "mediator",
    coreLanguageSlug: "typescript",
    title: "Mediator in TypeScript",
    summary:
      "Coordinates form fields through a mediator so individual controls do not need direct knowledge of one another.",
    layer: "Application",
    code: `interface FormMediator {
  notify(sender: FormField, event: "changed"): void;
}

abstract class FormField {
  constructor(protected readonly mediator: FormMediator) {}

  abstract changed(): void;
}

class CountryField extends FormField {
  private value = "";

  setValue(value: string) {
    this.value = value;
    this.changed();
  }

  changed() {
    this.mediator.notify(this, "changed");
  }

  getValue() {
    return this.value;
  }
}

class StateField extends FormField {
  private enabled = false;

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
    console.log(\`State field enabled: \${enabled}\`);
  }

  changed() {
    this.mediator.notify(this, "changed");
  }
}

class CheckoutFormMediator implements FormMediator {
  country!: CountryField;
  state!: StateField;

  notify(sender: FormField, event: "changed") {
    if (sender === this.country && event === "changed") {
      this.state.setEnabled(this.country.getValue() === "US");
    }
  }
}

const mediator = new CheckoutFormMediator();
mediator.country = new CountryField(mediator);
mediator.state = new StateField(mediator);

mediator.country.setValue("US");
mediator.country.setValue("DE");`,
  },
  {
    slug: "memento-typescript",
    patternSlug: "memento",
    coreLanguageSlug: "typescript",
    title: "Memento in TypeScript",
    summary:
      "Captures editor content snapshots so a history manager can restore earlier document states without exposing editor internals.",
    layer: "Application",
    code: `class EditorMemento {
  constructor(readonly content: string) {}
}

class TextEditor {
  private content = "";

  write(text: string) {
    this.content = text;
  }

  createMemento() {
    return new EditorMemento(this.content);
  }

  restore(memento: EditorMemento) {
    this.content = memento.content;
  }

  print() {
    console.log(this.content);
  }
}

class History {
  private readonly snapshots: EditorMemento[] = [];

  save(memento: EditorMemento) {
    this.snapshots.push(memento);
  }

  undo(): EditorMemento | undefined {
    return this.snapshots.pop();
  }
}

const editor = new TextEditor();
const history = new History();

editor.write("Draft version");
history.save(editor.createMemento());

editor.write("Published version");
editor.print();

const previousVersion = history.undo();

if (previousVersion) {
  editor.restore(previousVersion);
}

editor.print();`,
  },
  {
    slug: "observer-typescript",
    patternSlug: "observer",
    coreLanguageSlug: "typescript",
    title: "Observer in TypeScript",
    summary:
      "Publishes deployment-status changes to independently subscribed notification channels.",
    layer: "Application",
    code: `interface DeploymentObserver {
  update(status: string): void;
}

class Deployment {
  private readonly observers = new Set<DeploymentObserver>();
  private status = "pending";

  subscribe(observer: DeploymentObserver) {
    this.observers.add(observer);
  }

  unsubscribe(observer: DeploymentObserver) {
    this.observers.delete(observer);
  }

  setStatus(status: string) {
    this.status = status;
    this.notify();
  }

  private notify() {
    for (const observer of this.observers) {
      observer.update(this.status);
    }
  }
}

class SlackNotifier implements DeploymentObserver {
  update(status: string) {
    console.log(\`Slack: deployment is \${status}\`);
  }
}

class DashboardNotifier implements DeploymentObserver {
  update(status: string) {
    console.log(\`Dashboard updated: \${status}\`);
  }
}

const deployment = new Deployment();

deployment.subscribe(new SlackNotifier());
deployment.subscribe(new DashboardNotifier());

deployment.setStatus("running");
deployment.setStatus("completed");`,
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
    slug: "proxy-typescript",
    patternSlug: "proxy",
    coreLanguageSlug: "typescript",
    title: "Proxy in TypeScript",
    summary:
      "Wraps a remote product catalog with a caching proxy that preserves the catalog interface while controlling and optimizing access to product data.",
    layer: "Application",
    code: `type Product = {
  id: string;
  name: string;
  priceInCents: number;
};

interface ProductCatalog {
  getProduct(productId: string): Promise<Product>;
}

class RemoteProductCatalog implements ProductCatalog {
  async getProduct(productId: string): Promise<Product> {
    console.log(\`Loading \${productId} from the remote catalog\`);

    return {
      id: productId,
      name: "Mechanical Keyboard",
      priceInCents: 12_999,
    };
  }
}

class CachedProductCatalogProxy implements ProductCatalog {
  private readonly cache = new Map<string, Product>();

  constructor(private readonly catalog: ProductCatalog) {}

  async getProduct(productId: string): Promise<Product> {
    const cached = this.cache.get(productId);

    if (cached) {
      return cached;
    }

    const product = await this.catalog.getProduct(productId);
    this.cache.set(productId, product);

    return product;
  }
}

const catalog: ProductCatalog = new CachedProductCatalogProxy(
  new RemoteProductCatalog(),
);

void catalog.getProduct("keyboard-1");
void catalog.getProduct("keyboard-1");`,
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
    slug: "state-typescript",
    patternSlug: "state",
    coreLanguageSlug: "typescript",
    title: "State in TypeScript",
    summary:
      "Changes an order’s behavior by delegating cancellation rules to its current lifecycle state.",
    layer: "Application",
    code: `interface OrderState {
  cancel(order: Order): void;
  name(): string;
}

class Order {
  constructor(private state: OrderState) {}

  setState(state: OrderState) {
    this.state = state;
  }

  cancel() {
    this.state.cancel(this);
  }

  printStatus() {
    console.log(\`Order is \${this.state.name()}\`);
  }
}

class PendingState implements OrderState {
  cancel(order: Order) {
    console.log("Cancelling pending order.");
    order.setState(new CancelledState());
  }

  name() {
    return "pending";
  }
}

class ShippedState implements OrderState {
  cancel() {
    console.log("Shipped orders cannot be cancelled.");
  }

  name() {
    return "shipped";
  }
}

class CancelledState implements OrderState {
  cancel() {
    console.log("Order is already cancelled.");
  }

  name() {
    return "cancelled";
  }
}

const order = new Order(new PendingState());

order.printStatus();
order.cancel();
order.printStatus();

order.setState(new ShippedState());
order.cancel();`,
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
