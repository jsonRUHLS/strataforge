import Link from "next/link";

import { ButtonLink, PageHeader, SectionCard } from "@atlas-patterns/ui";

const forgePaths = [
  {
    title: "Pattern Atlas",
    description:
      "Explore design-pattern intent, tradeoffs, linked scenarios, and curated implementation variants.",
    href: "/patterns",
    action: "Explore Pattern Atlas",
    variant: "primary" as const,
  },
  {
    title: "Scenario Field Guide",
    description:
      "Browse real-world architecture and integration problems, then narrow results by related pattern, category, or layer.",
    href: "/scenarios",
    action: "Browse the Field Guide",
    variant: "secondary" as const,
  },
  {
    title: "Pattern Workbench",
    description:
      "Evaluate patterns side by side before deciding which responsibilities and structure fit the problem.",
    href: "/compare",
    action: "Open the Workbench",
    variant: "secondary" as const,
  },
];

const patternFamilies = [
  {
    label: "Creational",
    href: "/patterns?category=creational",
  },
  {
    label: "Structural",
    href: "/patterns?category=structural",
  },
  {
    label: "Behavioral",
    href: "/patterns?category=behavioral",
  },
];

const forgeWorkflow = [
  {
    title: "Map the Pattern Landscape",
    description:
      "Use Pattern Atlas to understand pattern families, intent, responsibilities, and tradeoffs.",
  },
  {
    title: "Apply Patterns in Context",
    description:
      "Use the Scenario Field Guide to connect patterns to practical architecture and integration problems.",
  },
  {
    title: "Test Your Direction",
    description:
      "Use the Pattern Workbench to compare alternatives before committing to an approach.",
  },
];

export default function ForgePage() {
  return (
    <section className="page">
      <PageHeader
        eyebrow="StrataForge"
        title="Forge Your Architecture"
        description="Explore patterns, practical scenarios, and alternatives before committing to an approach."
      />

      <div className="hero-actions">
        <ButtonLink href="/patterns" variant="primary">
          Explore Pattern Atlas
        </ButtonLink>

        <ButtonLink href="/scenarios" variant="secondary">
          Browse the Field Guide
        </ButtonLink>
      </div>

      <SectionCard title="Search the Scenario Field Guide">
        <form action="/scenarios" method="get" className="forge-search">
          <label className="forge-search__field">
            <span>Search by Problem or Pattern</span>

            <span className="forge-search__control">
              <svg
                aria-hidden="true"
                className="forge-search__icon"
                viewBox="0 0 24 24"
              >
                <circle cx="11" cy="11" r="6" />
                <path d="m16 16 4 4" />
              </svg>

              <input
                name="q"
                type="search"
                placeholder="Search Problems, Scenarios, or Patterns"
              />
            </span>
          </label>

          <button
            className="button-link button-link--secondary"
            type="submit"
          >
            Search Field Guide
          </button>
        </form>
      </SectionCard>

      <section className="forge-section" aria-labelledby="forge-paths-heading">
        <div className="forge-section__header">
          <div>
            <p className="forge-section__eyebrow">Forge</p>
            <h2 id="forge-paths-heading">Choose a Starting Point</h2>
          </div>

          <p>
            Map the pattern landscape, investigate a practical scenario, or
            evaluate alternatives before forging a direction.
          </p>
        </div>

        <div className="grid card-grid">
          {forgePaths.map((path) => (
            <SectionCard key={path.title} title={path.title}>
              <p>{path.description}</p>

              <ButtonLink href={path.href} variant={path.variant}>
                {path.action} →
              </ButtonLink>
            </SectionCard>
          ))}
        </div>
      </section>

      <SectionCard title="Pattern Atlas Families">
        <p>
          Browse patterns by the kind of construction, composition, or
          collaboration problem they address.
        </p>

        <div className="filter-row">
          {patternFamilies.map((family) => (
            <Link
              key={family.label}
              className="filter-chip"
              href={family.href}
            >
              {family.label}
            </Link>
          ))}
        </div>
      </SectionCard>

      <section className="forge-section" aria-labelledby="workflow-heading">
        <div className="forge-section__header">
          <div>
            <p className="forge-section__eyebrow">Workflow</p>
            <h2 id="workflow-heading">How to Use StrataForge</h2>
          </div>
        </div>

        <div className="forge-workflow">
          {forgeWorkflow.map((step, index) => (
            <article key={step.title} className="forge-workflow__step">
              <span className="forge-workflow__number">
                {String(index + 1).padStart(2, "0")}
              </span>

              <div>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </section>
  );
}