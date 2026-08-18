export type AuthoredScenarioMigration = {
  slug: string;
  name: string;
  summary: string;
  problemStatement: string;
  patternSlugs: string[];
  technologySlugs: string[];
  sources: Array<{
    patternSlug: string;
    scenarioIndex: number;
  }>;
};

export const authoredScenarioMigrations: AuthoredScenarioMigration[] = [
  {
    slug: "abstract-factory-ui-theme-kit",
    name: "UI theme kit",
    summary:
      "Create matching UI controls for a selected light or dark application theme.",
    problemStatement:
      "The application must create buttons, inputs, and dialogs that share a consistent theme without coupling client code to theme-specific control classes.",
    patternSlugs: ["abstract-factory"],
    technologySlugs: [],
    sources: [
      {
        patternSlug: "abstract-factory",
        scenarioIndex: 0,
      },
    ],
  },
  {
    slug: "abstract-factory-cloud-provider-kit",
    name: "Cloud provider kit",
    summary:
      "Create matching storage, queue, and compute clients for a selected cloud provider.",
    problemStatement:
      "The application must select a cloud provider implementation while keeping its infrastructure-facing code independent of provider-specific client APIs.",
    patternSlugs: ["abstract-factory"],
    technologySlugs: [],
    sources: [
      {
        patternSlug: "abstract-factory",
        scenarioIndex: 1,
      },
    ],
  },
  {
    slug: "abstract-factory-game-environment-kit",
    name: "Game environment kit",
    summary:
      "Create related terrain, enemy, and visual-effect assets for a chosen game environment.",
    problemStatement:
      "A game must assemble compatible asset families for different environments without scattering environment-specific creation logic throughout gameplay code.",
    patternSlugs: ["abstract-factory"],
    technologySlugs: [],
    sources: [
      {
        patternSlug: "abstract-factory",
        scenarioIndex: 2,
      },
    ],
  },
  {
    slug: "abstract-factory-document-suite",
    name: "Document suite",
    summary:
      "Create matching export handlers for PDF, HTML, and spreadsheet document outputs.",
    problemStatement:
      "The application must support several document output families while keeping export workflows independent of format-specific handler implementations.",
    patternSlugs: ["abstract-factory"],
    technologySlugs: [],
    sources: [
      {
        patternSlug: "abstract-factory",
        scenarioIndex: 3,
      },
    ],
  },
  {
    slug: "abstract-factory-device-os-kit",
    name: "Device OS kit",
    summary:
      "Create UI and system service implementations tailored to a device family or operating platform.",
    problemStatement:
      "The application must supply compatible UI and system-service families for different device platforms without exposing platform-specific construction details to clients.",
    patternSlugs: ["abstract-factory"],
    technologySlugs: [],
    sources: [
      {
        patternSlug: "abstract-factory",
        scenarioIndex: 4,
      },
    ],
  },
  {
    slug: "abstract-factory-analytics-stack-kit",
    name: "Analytics stack kit",
    summary:
      "Create a compatible family of data ingestion, transformation, and persistence components for a selected analytics pipeline.",
    problemStatement:
      "The system must configure compatible analytics pipeline components while isolating pipeline-specific construction choices from application code.",
    patternSlugs: ["abstract-factory"],
    technologySlugs: [],
    sources: [
      {
        patternSlug: "abstract-factory",
        scenarioIndex: 5,
      },
    ],
  },
  {
    slug: "third-party-task-api",
    name: "Third-party task API integration",
    summary:
      "Normalize a third-party task payload into the application’s internal task model.",
    problemStatement:
      "The application must use task data from an external API whose payload shape differs from the internal task model.",
    patternSlugs: ["adapter"],
    technologySlugs: [
      "apollo-client",
      "typeorm",
      "postgresql",
      "apache-kafka",
      "clickhouse",
      "grafana",
    ],
    sources: [
      {
        patternSlug: "adapter",
        scenarioIndex: 1,
      },
    ],
  },
  {
    slug: "adapter-legacy-payment-gateway",
    name: "Legacy payment gateway integration",
    summary:
      "Translate a legacy payment gateway API into the checkout service interface used by the application.",
    problemStatement:
      "The checkout service expects an application-owned payment interface, but the legacy payment gateway exposes an incompatible API contract.",
    patternSlugs: ["adapter"],
    technologySlugs: [],
    sources: [
      {
        patternSlug: "adapter",
        scenarioIndex: 0,
      },
    ],
  },
  {
    slug: "adapter-event-payload-mapper",
    name: "Event payload mapper",
    summary:
      "Convert incoming event payloads into the normalized analytics event shape used by the system.",
    problemStatement:
      "External event producers emit payloads with differing structures, while analytics consumers require one normalized event contract.",
    patternSlugs: ["adapter"],
    technologySlugs: [],
    sources: [
      {
        patternSlug: "adapter",
        scenarioIndex: 2,
      },
    ],
  },
  {
    slug: "bridge-data-source-abstraction",
    name: "Data source abstraction",
    summary:
      "Read reporting data from SQL, API, or file-based sources without changing reporting logic.",
    problemStatement:
      "The reporting layer must support multiple data-source implementations while keeping report-generation behavior independent of source-specific access code.",
    patternSlugs: ["bridge"],
    technologySlugs: [],
    sources: [
      {
        patternSlug: "bridge",
        scenarioIndex: 0,
      },
    ],
  },
  {
    slug: "bridge-notification-delivery",
    name: "Notification delivery",
    summary:
      "Send the same notification through email, SMS, or push channels without changing the sending flow.",
    problemStatement:
      "The notification workflow must support interchangeable delivery-channel implementations without coupling application behavior to a specific channel.",
    patternSlugs: ["bridge"],
    technologySlugs: [],
    sources: [
      {
        patternSlug: "bridge",
        scenarioIndex: 1,
      },
    ],
  },
  {
    slug: "bridge-payment-routing",
    name: "Payment routing",
    summary:
      "Route checkout payments through different payment providers while keeping the checkout API stable.",
    problemStatement:
      "The checkout flow must support provider-specific payment implementations without exposing provider contracts to the application-facing checkout API.",
    patternSlugs: ["bridge"],
    technologySlugs: [],
    sources: [
      {
        patternSlug: "bridge",
        scenarioIndex: 2,
      },
    ],
  },
  {
    slug: "bridge-printer-driver-layer",
    name: "Printer driver layer",
    summary:
      "Print documents through interchangeable local, network, or cloud printer drivers.",
    problemStatement:
      "A document application must support multiple printer implementations without coupling document-printing behavior to a specific driver.",
    patternSlugs: ["bridge"],
    technologySlugs: [],
    sources: [
      {
        patternSlug: "bridge",
        scenarioIndex: 3,
      },
    ],
  },
  {
    slug: "bridge-remote-control-bridge",
    name: "Remote control bridge",
    summary:
      "Control TVs, speakers, and streaming devices through interchangeable device implementations.",
    problemStatement:
      "A remote-control interface must operate different device implementations without embedding device-specific behavior in the control abstraction.",
    patternSlugs: ["bridge"],
    technologySlugs: [],
    sources: [
      {
        patternSlug: "bridge",
        scenarioIndex: 4,
      },
    ],
  },
  {
    slug: "bridge-shape-renderer-bridge",
    name: "Shape renderer bridge",
    summary:
      "Render shapes through screen, canvas, or SVG backends without changing shape behavior.",
    problemStatement:
      "Shape abstractions must support multiple rendering implementations without coupling shape logic to a particular drawing backend.",
    patternSlugs: ["bridge"],
    technologySlugs: [],
    sources: [
      {
        patternSlug: "bridge",
        scenarioIndex: 5,
      },
    ],
  },
  {
    slug: "builder-api-request-construction",
    name: "API request construction",
    summary: "Assemble a complex API request step by step before sending it.",
    problemStatement:
      "A client must configure a request with optional headers, parameters, authentication, and payload details without relying on a large constructor or exposing incomplete request objects.",
    patternSlugs: ["builder"],
    technologySlugs: [],
    sources: [
      {
        patternSlug: "builder",
        scenarioIndex: 0,
      },
    ],
  },
  {
    slug: "builder-report-generation",
    name: "Report generation",
    summary:
      "Assemble a report from headers, body sections, charts, and footers.",
    problemStatement:
      "A reporting tool must construct reports with optional and ordered sections while keeping report assembly separate from the final report representation.",
    patternSlugs: ["builder"],
    technologySlugs: [],
    sources: [
      {
        patternSlug: "builder",
        scenarioIndex: 1,
      },
    ],
  },
  {
    slug: "builder-ui-form-assembly",
    name: "UI form assembly",
    summary:
      "Construct a multi-step user interface with fields, validation, and actions.",
    problemStatement:
      "A form workflow must build configurable multi-step interfaces while ensuring fields, validation rules, and actions are assembled in a valid sequence.",
    patternSlugs: ["builder"],
    technologySlugs: [],
    sources: [
      {
        patternSlug: "builder",
        scenarioIndex: 2,
      },
    ],
  },
  {
    slug: "builder-configuration-assembly",
    name: "Configuration assembly",
    summary:
      "Build a runtime configuration object from many optional settings.",
    problemStatement:
      "An application must construct a valid configuration from optional settings without using a large constructor or allowing invalid partial configuration to leak into runtime behavior.",
    patternSlugs: ["builder"],
    technologySlugs: [],
    sources: [
      {
        patternSlug: "builder",
        scenarioIndex: 3,
      },
    ],
  },
  {
    slug: "builder-document-composition",
    name: "Document composition",
    summary:
      "Assemble invoices, contracts, or letters from reusable document sections.",
    problemStatement:
      "A document pipeline must compose documents from optional reusable sections while keeping document construction independent of a specific final document type.",
    patternSlugs: ["builder"],
    technologySlugs: [],
    sources: [
      {
        patternSlug: "builder",
        scenarioIndex: 4,
      },
    ],
  },
  {
    slug: "builder-character-creation",
    name: "Character creation",
    summary:
      "Build a game character with a name, class, and class-dependent statistics step by step.",
    problemStatement:
      "A game must construct valid character configurations with class-dependent properties while preventing incomplete or incompatible attribute combinations.",
    patternSlugs: ["builder"],
    technologySlugs: [],
    sources: [
      {
        patternSlug: "builder",
        scenarioIndex: 5,
      },
    ],
  },
  {
    slug: "builder-pizza-order-construction",
    name: "Pizza order construction",
    summary:
      "Assemble a pizza order with a selected size, crust, toppings, and extras.",
    problemStatement:
      "A food-ordering workflow must build customizable orders with optional choices while validating required selections and valid option combinations.",
    patternSlugs: ["builder"],
    technologySlugs: [],
    sources: [
      {
        patternSlug: "builder",
        scenarioIndex: 6,
      },
    ],
  },
  {
    slug: "chain-of-responsibility-password-validation-chain",
    name: "Password validation chain",
    summary:
      "Pass a password through several validation rules before accepting it.",
    problemStatement:
      "A system must evaluate password requirements in a defined sequence while keeping individual validation rules independent and allowing the validation pipeline to change without coupling the caller to every rule.",
    patternSlugs: ["chain-of-responsibility"],
    technologySlugs: [],
    sources: [
      {
        patternSlug: "chain-of-responsibility",
        scenarioIndex: 0,
      },
    ],
  },
  {
    slug: "chain-of-responsibility-support-ticket-chain",
    name: "Support ticket chain",
    summary:
      "Route a support ticket through handlers until the appropriate support level processes it.",
    problemStatement:
      "A support system must escalate or route tickets to the appropriate support level without requiring the ticket sender to know which team or handler can resolve each request.",
    patternSlugs: ["chain-of-responsibility"],
    technologySlugs: [],
    sources: [
      {
        patternSlug: "chain-of-responsibility",
        scenarioIndex: 1,
      },
    ],
  },
  {
    slug: "chain-of-responsibility-approval-workflow-chain",
    name: "Approval workflow chain",
    summary:
      "Pass an expense request through approvers according to amount and policy constraints.",
    problemStatement:
      "An expense workflow must route requests through the necessary approvers based on changing limits and policies while avoiding a caller that is tightly coupled to every approval level.",
    patternSlugs: ["chain-of-responsibility"],
    technologySlugs: [],
    sources: [
      {
        patternSlug: "chain-of-responsibility",
        scenarioIndex: 2,
      },
    ],
  },
  {
    slug: "chain-of-responsibility-request-middleware-chain",
    name: "Request middleware chain",
    summary:
      "Process a web request through logging, authentication, rate-limiting, and transformation handlers.",
    problemStatement:
      "A web application must apply ordered cross-cutting request processing while allowing handlers to short-circuit, delegate, or be composed without centralizing every decision in the request entry point.",
    patternSlugs: ["chain-of-responsibility"],
    technologySlugs: [],
    sources: [
      {
        patternSlug: "chain-of-responsibility",
        scenarioIndex: 3,
      },
    ],
  },
  {
    slug: "chain-of-responsibility-notification-routing-chain",
    name: "Notification routing chain",
    summary:
      "Route a message through preference checks, channel selection, and fallback handlers.",
    problemStatement:
      "A notification system must evaluate recipient preferences, select an available delivery channel, and fall back when necessary without coupling message producers to all routing and delivery rules.",
    patternSlugs: ["chain-of-responsibility"],
    technologySlugs: [],
    sources: [
      {
        patternSlug: "chain-of-responsibility",
        scenarioIndex: 4,
      },
    ],
  },
  {
    slug: "chain-of-responsibility-form-command-chain",
    name: "Form command chain",
    summary:
      "Check a form submission with sanitization, validation, and policy handlers before saving it.",
    problemStatement:
      "A form workflow must apply ordered preprocessing and policy checks before persistence, with each handler able to reject invalid input or pass a valid submission to the next stage.",
    patternSlugs: ["chain-of-responsibility"],
    technologySlugs: [],
    sources: [
      {
        patternSlug: "chain-of-responsibility",
        scenarioIndex: 5,
      },
    ],
  },
  {
    slug: "command-text-editor-undo",
    name: "Text editor undo",
    summary:
      "Wrap text insertion operations in commands that can be executed and later undone from history.",
    problemStatement:
      "A text editor must record user operations with enough information to reverse them later without coupling the history mechanism to individual editing operations.",
    patternSlugs: ["command"],
    technologySlugs: [],
    sources: [
      {
        patternSlug: "command",
        scenarioIndex: 0,
      },
    ],
  },
  {
    slug: "command-job-queue-processing",
    name: "Job queue processing",
    summary:
      "Store jobs as commands so they can be submitted now and executed later by a worker.",
    problemStatement:
      "A task runner must accept work independently of when a worker executes it, while keeping queue infrastructure decoupled from the details of each job.",
    patternSlugs: ["command"],
    technologySlugs: [],
    sources: [
      {
        patternSlug: "command",
        scenarioIndex: 1,
      },
    ],
  },
  {
    slug: "command-remote-control-actions",
    name: "Remote control actions",
    summary:
      "Bind remote-control buttons to commands that trigger device actions without device-specific invoker logic.",
    problemStatement:
      "A remote control must invoke interchangeable device actions without knowing the receiver APIs or embedding conditional logic for every supported device.",
    patternSlugs: ["command"],
    technologySlugs: [],
    sources: [
      {
        patternSlug: "command",
        scenarioIndex: 2,
      },
    ],
  },
  {
    slug: "command-admin-action-queue",
    name: "Admin action queue",
    summary:
      "Record administrative exports, notifications, and recalculations as commands for later execution.",
    problemStatement:
      "An admin console must capture potentially long-running actions for deferred processing while retaining the action details needed by asynchronous workers.",
    patternSlugs: ["command"],
    technologySlugs: [],
    sources: [
      {
        patternSlug: "command",
        scenarioIndex: 3,
      },
    ],
  },
  {
    slug: "command-workflow-step-command",
    name: "Workflow step command",
    summary:
      "Model each business-process step as a command invoked by a workflow coordinator.",
    problemStatement:
      "A process engine must coordinate varied business-flow steps without embedding the implementation details of every step in the coordinator.",
    patternSlugs: ["command"],
    technologySlugs: [],
    sources: [
      {
        patternSlug: "command",
        scenarioIndex: 4,
      },
    ],
  },
  {
    slug: "command-macro-command-sequence",
    name: "Macro command sequence",
    summary:
      "Bundle several actions into a reusable macro that runs from one trigger.",
    problemStatement:
      "A productivity tool must package an ordered set of actions as one reusable operation while allowing the invoker to execute the macro through the same command interface as individual actions.",
    patternSlugs: ["command"],
    technologySlugs: [],
    sources: [
      {
        patternSlug: "command",
        scenarioIndex: 5,
      },
    ],
  },
  {
    slug: "composite-file-system-composite",
    name: "File system composite",
    summary:
      "Treat files and folders through one interface so nested file-system structures can be processed uniformly.",
    problemStatement:
      "A file system must support operations over both individual files and nested folders without forcing clients to handle leaf and container types through separate traversal logic.",
    patternSlugs: ["composite"],
    technologySlugs: [],
    sources: [
      {
        patternSlug: "composite",
        scenarioIndex: 0,
      },
    ],
  },
  {
    slug: "composite-menu-composite",
    name: "Menu composite",
    summary:
      "Represent menu items and submenus together so the UI can render or invoke them consistently.",
    problemStatement:
      "A menu system must render and invoke both individual menu items and nested submenus through a common component interface without special-case UI logic for each hierarchy level.",
    patternSlugs: ["composite"],
    technologySlugs: [],
    sources: [
      {
        patternSlug: "composite",
        scenarioIndex: 1,
      },
    ],
  },
  {
    slug: "composite-organization-chart-composite",
    name: "Organization chart composite",
    summary:
      "Use a common component interface for employees and managers to traverse an organization hierarchy recursively.",
    problemStatement:
      "An organization chart must support recursive hierarchy operations across individual employees and managers with reports while keeping traversal clients independent of concrete node types.",
    patternSlugs: ["composite"],
    technologySlugs: [],
    sources: [
      {
        patternSlug: "composite",
        scenarioIndex: 2,
      },
    ],
  },
  {
    slug: "composite-dashboard-widget-tree",
    name: "Dashboard widget tree",
    summary:
      "Group widgets and widget containers so layout and rendering recurse over one structure.",
    problemStatement:
      "A dashboard must lay out and render individual widgets and nested widget containers without duplicating traversal and rendering behavior for each type of visual element.",
    patternSlugs: ["composite"],
    technologySlugs: [],
    sources: [
      {
        patternSlug: "composite",
        scenarioIndex: 3,
      },
    ],
  },
  {
    slug: "composite-permission-group-hierarchy",
    name: "Permission group hierarchy",
    summary:
      "Nest roles and permission groups so aggregate permissions can be evaluated recursively.",
    problemStatement:
      "An access-control system must evaluate permissions across individual roles and nested groups while allowing authorization logic to process both leaves and containers through the same interface.",
    patternSlugs: ["composite"],
    technologySlugs: [],
    sources: [
      {
        patternSlug: "composite",
        scenarioIndex: 4,
      },
    ],
  },
  {
    slug: "composite-scene-graph-composite",
    name: "Scene graph composite",
    summary:
      "Represent shapes and containers in a scene graph so rendering and transforms recurse through the hierarchy.",
    problemStatement:
      "A graphics engine must apply rendering and transformations to individual shapes and nested scene containers without requiring callers to distinguish leaf nodes from composite nodes.",
    patternSlugs: ["composite"],
    technologySlugs: [],
    sources: [
      {
        patternSlug: "composite",
        scenarioIndex: 5,
      },
    ],
  },
  {
    slug: "decorator-notification-delivery",
    name: "Notification delivery",
    summary:
      "Wrap notification delivery with logging and retry behavior while preserving the same send contract.",
    problemStatement:
      "A notification service must add optional operational behavior such as logging and retries without changing the core delivery component or creating a subclass for every feature combination.",
    patternSlugs: ["decorator"],
    technologySlugs: [],
    sources: [
      {
        patternSlug: "decorator",
        scenarioIndex: 0,
      },
    ],
  },
  {
    slug: "decorator-http-client",
    name: "HTTP client",
    summary:
      "Wrap an HTTP client with caching and metrics without changing its request interface.",
    problemStatement:
      "An application must add optional cross-cutting behavior such as caching and metrics around HTTP requests while keeping callers dependent on one stable client interface.",
    patternSlugs: ["decorator"],
    technologySlugs: [],
    sources: [
      {
        patternSlug: "decorator",
        scenarioIndex: 1,
      },
    ],
  },
  {
    slug: "decorator-file-storage",
    name: "File storage",
    summary:
      "Wrap file storage with optional compression and encryption before persistence.",
    problemStatement:
      "A storage workflow must compose optional data-transformation layers such as compression and encryption around a base persistence component without modifying the storage contract.",
    patternSlugs: ["decorator"],
    technologySlugs: [],
    sources: [
      {
        patternSlug: "decorator",
        scenarioIndex: 2,
      },
    ],
  },
  {
    slug: "decorator-text-formatting",
    name: "Text formatting",
    summary:
      "Wrap a text component with bold, italic, and underline formatting without modifying the original component.",
    problemStatement:
      "A text-rendering system must combine optional formatting behaviors dynamically while preserving a common component interface and avoiding a subclass for every possible formatting combination.",
    patternSlugs: ["decorator"],
    technologySlugs: [],
    sources: [
      {
        patternSlug: "decorator",
        scenarioIndex: 3,
      },
    ],
  },
  {
    slug: "decorator-coffee-customization",
    name: "Coffee customization",
    summary:
      "Add extras such as milk, mocha, and whip to a base drink while composing behavior and cost.",
    problemStatement:
      "An ordering system must let customers combine optional drink additions and calculate the resulting behavior and price without defining a separate concrete type for every possible order combination.",
    patternSlugs: ["decorator"],
    technologySlugs: [],
    sources: [
      {
        patternSlug: "decorator",
        scenarioIndex: 4,
      },
    ],
  },
  {
    slug: "decorator-notification-channels",
    name: "Notification channels",
    summary:
      "Wrap a base notifier with email, SMS, or Slack delivery layers to send one message through multiple channels.",
    problemStatement:
      "A notification system must compose multiple optional delivery channels around a common notifier contract without requiring message producers to coordinate each channel directly.",
    patternSlugs: ["decorator"],
    technologySlugs: [],
    sources: [
      {
        patternSlug: "decorator",
        scenarioIndex: 5,
      },
    ],
  },
  {
    slug: "decorator-logging-metrics-and-tracing",
    name: "Logging, metrics, and tracing",
    summary:
      "Layer logging, metrics, and tracing around a core operation while keeping cross-cutting concerns separate.",
    problemStatement:
      "A service must apply independently composable observability concerns around an operation without embedding logging, metrics, and tracing behavior into every core service implementation.",
    patternSlugs: ["decorator"],
    technologySlugs: [],
    sources: [
      {
        patternSlug: "decorator",
        scenarioIndex: 6,
      },
    ],
  },
  {
    slug: "decorator-ui-accessibility-enhancement",
    name: "UI accessibility enhancement",
    summary:
      "Wrap a UI component with labels, keyboard handling, and hints without changing the base component.",
    problemStatement:
      "A UI system must add optional accessibility behavior to individual components while preserving the base UI contract and avoiding modifications to each original component implementation.",
    patternSlugs: ["decorator"],
    technologySlugs: [],
    sources: [
      {
        patternSlug: "decorator",
        scenarioIndex: 7,
      },
    ],
  },
  {
    slug: "facade-checkout-workflow",
    name: "Checkout workflow",
    summary:
      "Expose one order-placement operation that coordinates authentication, payment, inventory, and notification subsystems.",
    problemStatement:
      "A checkout client must complete an order without coordinating multiple subsystem APIs or depending directly on authentication, payment, inventory, and notification implementation details.",
    patternSlugs: ["facade"],
    technologySlugs: [],
    sources: [
      {
        patternSlug: "facade",
        scenarioIndex: 0,
      },
    ],
  },
  {
    slug: "facade-video-conversion-pipeline",
    name: "Video conversion pipeline",
    summary:
      "Wrap several media-processing steps behind one video conversion operation.",
    problemStatement:
      "A client must convert video without understanding or coordinating the individual decoding, transformation, encoding, and output steps of the media-processing subsystem.",
    patternSlugs: ["facade"],
    technologySlugs: [],
    sources: [
      {
        patternSlug: "facade",
        scenarioIndex: 1,
      },
    ],
  },
  {
    slug: "facade-home-theater-startup",
    name: "Home theater startup",
    summary:
      "Simplify a multi-device home-theater startup sequence into one watch-movie operation.",
    problemStatement:
      "A user must start a movie without manually coordinating the display, audio system, media player, and other home-theater devices in the correct order.",
    patternSlugs: ["facade"],
    technologySlugs: [],
    sources: [
      {
        patternSlug: "facade",
        scenarioIndex: 2,
      },
    ],
  },
  {
    slug: "facade-account-onboarding",
    name: "Account onboarding",
    summary:
      "Coordinate account creation, profile setup, email verification, and welcome messaging through one onboarding operation.",
    problemStatement:
      "An application must onboard a user through several coordinated services while presenting callers with one stable entry point instead of exposing every onboarding subsystem.",
    patternSlugs: ["facade"],
    technologySlugs: [],
    sources: [
      {
        patternSlug: "facade",
        scenarioIndex: 3,
      },
    ],
  },
  {
    slug: "facade-report-generation",
    name: "Report generation",
    summary:
      "Hide data collection, formatting, rendering, and delivery behind one report-generation operation.",
    problemStatement:
      "A client must generate and deliver a report without coordinating the underlying data collection, formatting, rendering, and delivery components.",
    patternSlugs: ["facade"],
    technologySlugs: [],
    sources: [
      {
        patternSlug: "facade",
        scenarioIndex: 4,
      },
    ],
  },
  {
    slug: "facade-device-setup",
    name: "Device setup",
    summary:
      "Run device pairing, configuration, and health checks through one setup operation.",
    problemStatement:
      "A client must prepare a device for use without knowing the sequence or APIs for pairing, configuration, and health-check subsystems.",
    patternSlugs: ["facade"],
    technologySlugs: [],
    sources: [
      {
        patternSlug: "facade",
        scenarioIndex: 5,
      },
    ],
  },
  {
    slug: "factory-method-document-export",
    name: "Document export",
    summary:
      "Choose an exporter for PDF, CSV, or other output formats while keeping the reporting workflow consistent.",
    problemStatement:
      "A reporting workflow must produce multiple output formats without coupling its common export flow to the concrete implementation of each format-specific exporter.",
    patternSlugs: ["factory-method"],
    technologySlugs: [],
    sources: [
      {
        patternSlug: "factory-method",
        scenarioIndex: 0,
      },
    ],
  },
  {
    slug: "factory-method-notification-channel",
    name: "Notification channel",
    summary:
      "Create channel-specific email, SMS, or push senders without changing the notification workflow.",
    problemStatement:
      "A notification workflow must use interchangeable delivery-channel implementations without directly constructing or depending on every concrete sender type.",
    patternSlugs: ["factory-method"],
    technologySlugs: [],
    sources: [
      {
        patternSlug: "factory-method",
        scenarioIndex: 1,
      },
    ],
  },
  {
    slug: "factory-method-logger-transport",
    name: "Logger transport",
    summary:
      "Select console, file, or remote logger transports through specialized creators for different environments.",
    problemStatement:
      "An application must select an environment-appropriate logger implementation without scattering concrete transport construction throughout application code.",
    patternSlugs: ["factory-method"],
    technologySlugs: [],
    sources: [
      {
        patternSlug: "factory-method",
        scenarioIndex: 2,
      },
    ],
  },
  {
    slug: "flyweight-tree-rendering-flyweight",
    name: "Tree rendering flyweight",
    summary:
      "Share tree-type data across many tree instances to reduce memory use in a forest renderer.",
    problemStatement:
      "A forest renderer must represent many trees efficiently by sharing repeated type data such as appearance and species while storing only instance-specific state such as position separately.",
    patternSlugs: ["flyweight"],
    technologySlugs: [],
    sources: [
      {
        patternSlug: "flyweight",
        scenarioIndex: 0,
      },
    ],
  },
  {
    slug: "flyweight-text-formatting-flyweight",
    name: "Text formatting flyweight",
    summary:
      "Reuse character-style objects across many glyphs while keeping position and content-specific state separate.",
    problemStatement:
      "A text editor must render large volumes of styled glyphs without duplicating shared character-style data for every occurrence, while retaining each glyph's unique content and position.",
    patternSlugs: ["flyweight"],
    technologySlugs: [],
    sources: [
      {
        patternSlug: "flyweight",
        scenarioIndex: 1,
      },
    ],
  },
  {
    slug: "flyweight-game-tile-flyweight",
    name: "Game tile flyweight",
    summary:
      "Reuse terrain definitions while map tiles retain only coordinates and local effects.",
    problemStatement:
      "A tile-based game must represent large maps efficiently by sharing immutable terrain definitions across tiles while storing only location-specific and local-effect state on each tile.",
    patternSlugs: ["flyweight"],
    technologySlugs: [],
    sources: [
      {
        patternSlug: "flyweight",
        scenarioIndex: 2,
      },
    ],
  },
];
