import type { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  getPatternBySlug as getContentPatternBySlug,
} from "@atlas-patterns/content";
import { getOptionalPatternBySlug as getCatalogPatternBySlug } from "@atlas-patterns/database";
import { PageHeader, SectionCard, Tag } from "@atlas-patterns/ui";

import { PatternExamplesTabs } from "./PatternExamplesTabs";
import { PatternVariantsSection } from "@components/patterns/PatternVariantsSection";

export const dynamic = "force-dynamic";

type PatternDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

type ScenarioViewModel = {
  id: string;
  slug: string;
  name: string;
  summary: string;
  source: "database" | "content";
};

export async function generateMetadata({
  params,
}: PatternDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const pattern = getContentPatternBySlug(slug);

  if (!pattern) {
    return {
      title: "Pattern not found",
    };
  }

  return {
    title: `${pattern.name} Pattern`,
    description: pattern.intent,
  };
}

export default async function PatternDetailPage({
  params,
}: PatternDetailPageProps) {
  const { slug } = await params;

  /*
   * The authored content model remains the primary page view model.
   * It supports the entire existing page UI: intent, problem, tradeoffs,
   * languages, platforms, variants, scenarios, and real-world examples.
   */
  const pattern = getContentPatternBySlug(slug);

  if (!pattern) {
    notFound();
  }

  /*
   * First catalog integration:
   * Adapter is the pattern currently seeded in PostgreSQL.
   *
   * When more patterns are migrated to the catalog, remove the slug check
   * and query the database for every pattern.
   */
  const catalogPattern =
  slug === "adapter"
    ? await getCatalogPatternBySlug(slug)
    : null;

  /*
   * Convert Prisma data into a small, UI-safe shape.
   * The source property is intentional provenance metadata, not inferred
   * from a slug or from an environment variable.
   */
  const catalogScenarios: ScenarioViewModel[] =
    catalogPattern?.scenarioLinks.map(({ scenario }) => ({
      id: scenario.id,
      slug: scenario.slug,
      name: scenario.name,
      summary: scenario.summary,
      source: "database" as const,
    })) ?? [];

  return (
    <section className="page">
      <PageHeader
        eyebrow={pattern.category}
        title={pattern.name}
        description={pattern.intent}
      />

      <div className="grid two-up">
        <SectionCard title="Problem">
          <div className="panel-meta">
            <Tag>{pattern.category}</Tag>
          </div>

          <p>{pattern.problem}</p>
        </SectionCard>

        <SectionCard title="Integration notes">
          <p>{pattern.integrationNotes}</p>
        </SectionCard>
      </div>

      <SectionCard title="Tradeoffs">
        <ul className="list">
          {(pattern.tradeoffs ?? []).map((tradeoff) => (
            <li key={tradeoff}>{tradeoff}</li>
          ))}
        </ul>
      </SectionCard>

      <div className="grid two-up">
        <SectionCard title="Languages">
          <p>{pattern.languages.join(", ")}</p>
        </SectionCard>

        <SectionCard title="Platforms">
          <p>{(pattern.platforms ?? []).join(", ")}</p>
        </SectionCard>
      </div>

      <SectionCard title="Variants">
        <PatternVariantsSection pattern={pattern} />
      </SectionCard>

      <SectionCard title="Scenarios">
        <PatternExamplesTabs
          scenarios={pattern.scenarios}
          {...(pattern.scenarioExamples
            ? { scenarioExamples: pattern.scenarioExamples }
            : {})}
        />
      </SectionCard>

      <SectionCard title="Real-world examples">
        {(pattern.realWorldExamples ?? []).length === 0 ? (
          <p>No real-world examples yet.</p>
        ) : (
          <ul className="list">
            {(pattern.realWorldExamples ?? []).map((example) => (
              <li key={example.title}>
                <strong>{example.title}:</strong> {example.description}
              </li>
            ))}
          </ul>
        )}
      </SectionCard>

      {catalogPattern ? (
        <>
          <SectionCard title="Catalog record">
            <p>{catalogPattern.summary}</p>

            <div className="panel-meta">
              <Tag>{catalogPattern.category}</Tag>

              {catalogPattern.variants.map((variant) => (
                <Tag key={variant.id}>
                  {variant.coreLanguage?.name ?? "General"}
                </Tag>
              ))}
            </div>
          </SectionCard>

          <SectionCard title="Catalog scenarios">
            {catalogScenarios.length === 0 ? (
              <p>No catalog scenarios linked yet.</p>
            ) : (
              <ul className="list">
                {catalogScenarios.map((scenario) => (
                  <li key={scenario.id}>
                    <div className="panel-meta">
                      <strong>{scenario.name}</strong>

                      {scenario.source === "database" ? (
                        <Tag>Catalog DB</Tag>
                      ) : null}
                    </div>

                    <p>{scenario.summary}</p>
                  </li>
                ))}
              </ul>
            )}
          </SectionCard>
        </>
      ) : null}
    </section>
  );
}