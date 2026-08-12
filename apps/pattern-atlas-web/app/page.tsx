import { ButtonLink, PageHeader, SectionCard } from "@atlas-patterns/ui";

const focusAreas = [
  "Pattern comparison across languages",
  "Integration notes between codebases",
  "Starter implementations for common patterns",
];

const starterPatterns = [
  "Strategy",
  "Adapter",
  "Observer",
  "Factory Method",
  "Facade",
];

export default function HomePage() {
  return (
    <section className="page">
      <PageHeader
        eyebrow="Software Design Patterns"
        title="Build the same solution across any stack."
        description="StrataForge is the working surface for exploring how software design patterns translate across languages, frameworks, and platforms without losing their architectural intent."
      />

      <div className="hero-actions">
        <ButtonLink href="/patterns" variant="primary">
          Browse patterns
        </ButtonLink>
        <ButtonLink href="/compare" variant="secondary">
          Start comparing
        </ButtonLink>
      </div>

      <div className="grid two-up">
        <SectionCard title="Current focus">
          <ul className="list">
            {focusAreas.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </SectionCard>

        <SectionCard title="First pattern set">
          <ul className="list">
            {starterPatterns.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </SectionCard>
      </div>
    </section>
  );
}
