import Link from "next/link";
import { notFound } from "next/navigation";

import { getOptionalScenarioBySlug } from "@atlas-patterns/database";

type ScenarioPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function ScenarioPage({ params }: ScenarioPageProps) {
  const { slug } = await params;
  const scenario = await getOptionalScenarioBySlug(slug);

  if (!scenario) {
    notFound();
  }

  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-12">
      <header className="border-b border-white/10 pb-8">
        <div className="mb-4 flex items-center gap-3">
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm font-medium text-slate-200">
            Scenario
          </span>
          <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-sm font-medium text-cyan-200">
            Catalog DB
          </span>
        </div>

        <h1 className="text-4xl font-bold tracking-tight text-white">
          {scenario.name}
        </h1>

        <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-300">
          {scenario.summary}
        </p>
      </header>

      <section className="py-8">
        <h2 className="text-2xl font-semibold text-white">Problem</h2>

        <p className="mt-3 max-w-3xl leading-7 text-slate-300">
          {scenario.problemStatement}
        </p>
      </section>

      <section className="border-t border-white/10 py-8">
        <h2 className="text-2xl font-semibold text-white">
          Related patterns
        </h2>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {scenario.patternLinks.map(({ pattern }) => (
            <Link
              className="rounded-xl border border-white/10 bg-white/5 p-5 transition hover:border-cyan-400/50 hover:bg-cyan-400/10"
              href={`/patterns/${pattern.slug}`}
              key={pattern.id}
            >
              <h3 className="font-semibold text-white">{pattern.name}</h3>

              <span className="mt-4 inline-block text-sm font-medium text-cyan-300">
                View pattern →
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-t border-white/10 py-8">
        <h2 className="text-2xl font-semibold text-white">
          Implementations
        </h2>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {scenario.patternLinks.flatMap(({ pattern }) =>
            pattern.variants.map((variant) => (
              <article
                className="rounded-xl border border-white/10 bg-white/5 p-5"
                key={variant.id}
              >
                <p className="text-sm font-medium text-slate-400">
                  {pattern.name}
                </p>

                <h3 className="mt-1 font-semibold text-white">
                  {variant.title}
                </h3>

                {variant.coreLanguage ? (
                  <p className="mt-2 text-sm text-slate-300">
                    {variant.coreLanguage.name}
                  </p>
                ) : null}
              </article>
            )),
          )}
        </div>
      </section>

      <section className="border-t border-white/10 py-8">
        <h2 className="text-2xl font-semibold text-white">
          Associated technologies
        </h2>

        <div className="mt-4 flex flex-wrap gap-3">
          {scenario.technologyLinks.map(({ technology }) => (
            <span
              className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-200"
              key={technology.id}
            >
              {technology.name}
            </span>
          ))}
        </div>
      </section>
    </main>
  );
}
