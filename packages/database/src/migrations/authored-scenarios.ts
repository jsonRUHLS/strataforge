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
];
