import Link from "next/link";

import { listOptionalScenarios } from "@atlas-patterns/database";
import { PageHeader, SectionCard, Tag } from "@atlas-patterns/ui";

export const dynamic = "force-dynamic";

export default async function ScenariosPage() {
  const scenarios = await listOptionalScenarios();

  return (
    <section className="page">
      <PageHeader
        eyebrow="Catalog"
        title="Scenarios"
        description="Browse applied architecture and integration scenarios from the StrataForge catalog."
      />

      {scenarios === null ? (
        <SectionCard title="Catalog unavailable">
          <p>
            Scenario data is temporarily unavailable. Confirm that the catalog
            database is running and that DATABASE_URL is configured, then try
            again.
          </p>
        </SectionCard>
      ) : scenarios.length === 0 ? (
        <SectionCard title="No catalog scenarios yet">
          <p>
            The catalog is connected, but it does not contain any scenarios yet.
          </p>
        </SectionCard>
      ) : (
        <div className="grid two-up">
          {scenarios.map((scenario) => (
            <SectionCard key={scenario.id} title={scenario.name}>
              <p>{scenario.summary}</p>

              <div className="panel-meta">
                {scenario.patternLinks.map(({ pattern }) => (
                  <Tag key={pattern.id}>{pattern.name}</Tag>
                ))}

                <Tag>
                  {scenario._count.technologyLinks}{" "}
                  {scenario._count.technologyLinks === 1
                    ? "technology"
                    : "technologies"}
                </Tag>
              </div>

              <Link
                className="mt-4 inline-flex text-sm font-medium text-cyan-300 transition hover:text-cyan-200 hover:underline"
                href={`/scenarios/${scenario.slug}`}
              >
                View scenario →
              </Link>
            </SectionCard>
          ))}
        </div>
      )}
    </section>
  );
}
