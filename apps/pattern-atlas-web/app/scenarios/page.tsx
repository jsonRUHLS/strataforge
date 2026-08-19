import Link from "next/link";

import {
  isScenarioSort,
  listOptionalScenarioFilterOptions,
  listOptionalScenarios,
  type ScenarioCatalogFilters,
} from "@atlas-patterns/database";
import { PageHeader, SectionCard, Tag } from "@atlas-patterns/ui";

export const dynamic = "force-dynamic";

type ScenariosPageProps = {
  searchParams?: Promise<{
    q?: string | string[];
    pattern?: string | string[];
    category?: string | string[];
    layer?: string | string[];
    sort?: string | string[];
  }>;
};

function firstValue(value?: string | string[]) {
  return Array.isArray(value) ? value[0] : value;
}

function formatLabel(value: string) {
  return value
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

type ScenarioFilterKey = Exclude<keyof ScenarioCatalogFilters, "sort">;

type ScenarioFilterUpdates = Partial<Pick<ScenarioCatalogFilters, "sort">> & {
  [Key in ScenarioFilterKey]?: ScenarioCatalogFilters[Key] | null;
};

function createScenarioHref(
  filters: ScenarioCatalogFilters,
  updates: ScenarioFilterUpdates = {},
) {
  const nextFilters = { ...filters };

  for (const [key, value] of Object.entries(updates) as [
    keyof ScenarioCatalogFilters,
    string | null | undefined,
  ][]) {
    if (value === null || value === undefined) {
      delete nextFilters[key];
    } else {
      Object.assign(nextFilters, { [key]: value });
    }
  }

  const params = new URLSearchParams();

  if (nextFilters.query) {
    params.set("q", nextFilters.query);
  }

  if (nextFilters.patternSlug) {
    params.set("pattern", nextFilters.patternSlug);
  }

  if (nextFilters.category) {
    params.set("category", nextFilters.category);
  }

  if (nextFilters.layer) {
    params.set("layer", nextFilters.layer);
  }

  if (nextFilters.sort && nextFilters.sort !== "title-asc") {
    params.set("sort", nextFilters.sort);
  }

  const query = params.toString();

  return query ? `/scenarios?${query}` : "/scenarios";
}

export default async function ScenariosPage({
  searchParams,
}: ScenariosPageProps) {
  const params = (await searchParams) ?? {};

  const requestedQuery = firstValue(params.q)?.trim();
  const requestedPattern = firstValue(params.pattern);
  const requestedCategory = firstValue(params.category);
  const requestedLayer = firstValue(params.layer);
  const requestedSort = firstValue(params.sort);

  const filterOptions = await listOptionalScenarioFilterOptions();

  if (filterOptions === null) {
    return (
      <section className="page">
        <PageHeader
          eyebrow="Catalog"
          title="Scenarios"
          description="Browse real-world architecture and integration problems, then explore the patterns that help solve them."
        />

        <SectionCard title="Catalog unavailable">
          <p>
            Scenario data is temporarily unavailable. Confirm that the catalog
            database is running and that DATABASE_URL is configured, then try
            again.
          </p>
        </SectionCard>
      </section>
    );
  }

  const availablePatternSlugs = new Set(
    filterOptions.map((pattern) => pattern.slug),
  );

  const availableCategories = Array.from(
    new Set(filterOptions.map((pattern) => pattern.category)),
  ).sort();

  const availableLayers = Array.from(
    new Set(
      filterOptions
        .map((pattern) => pattern.layer)
        .filter((layer): layer is string => layer !== null),
    ),
  ).sort();

  const filters: ScenarioCatalogFilters = {
    ...(requestedQuery ? { query: requestedQuery } : {}),
    ...(requestedPattern && availablePatternSlugs.has(requestedPattern)
      ? { patternSlug: requestedPattern }
      : {}),
    ...(requestedCategory && availableCategories.includes(requestedCategory)
      ? { category: requestedCategory }
      : {}),
    ...(requestedLayer && availableLayers.includes(requestedLayer)
      ? { layer: requestedLayer }
      : {}),
    sort:
      requestedSort && isScenarioSort(requestedSort)
        ? requestedSort
        : "title-asc",
  };

  const scenarios = await listOptionalScenarios(filters);

  const hasAppliedFilters =
    Boolean(filters.query) ||
    Boolean(filters.patternSlug) ||
    Boolean(filters.category) ||
    Boolean(filters.layer);

  const activeFilters = [
    filters.query
      ? {
          label: `Search: ${filters.query}`,
          href: createScenarioHref(filters, { query: null }),
        }
      : null,
    filters.patternSlug
      ? {
          label:
            filterOptions.find(
              (pattern) => pattern.slug === filters.patternSlug,
            )?.name ?? formatLabel(filters.patternSlug),
          href: createScenarioHref(filters, { patternSlug: null }),
        }
      : null,
    filters.category
      ? {
          label: formatLabel(filters.category),
          href: createScenarioHref(filters, { category: null }),
        }
      : null,
    filters.layer
      ? {
          label: formatLabel(filters.layer),
          href: createScenarioHref(filters, { layer: null }),
        }
      : null,
  ].filter(
    (
      filter,
    ): filter is {
      label: string;
      href: string;
    } => filter !== null,
  );

  if (scenarios !== null && scenarios.length === 0 && !hasAppliedFilters) {
    return (
      <section className="page">
        <PageHeader
          eyebrow="Catalog"
          title="Scenarios"
          description="Browse real-world architecture and integration problems, then explore the patterns that help solve them."
        />

        <SectionCard title="No catalog scenarios yet">
          <p>
            The catalog is connected, but it does not contain any scenarios yet.
          </p>
        </SectionCard>
      </section>
    );
  }

  return (
    <section className="page">
      <PageHeader
        eyebrow="Catalog"
        title="Scenarios"
        description="Browse real-world architecture and integration problems, then explore the patterns that help solve them."
      />

      <SectionCard title="Find scenarios">
        <form action="/scenarios" method="get" className="scenario-filters">
          <div className="scenario-filters__header">
            <p className="scenario-filters__copy">
              Search real-world problems or narrow the catalog by pattern.
            </p>

            {activeFilters.length > 0 ? (
              <Link
                className="button-link button-link--ghost"
                href="/scenarios"
              >
                Clear filters
              </Link>
            ) : null}
          </div>

          <label className="scenario-filter-field scenario-filter-field--search">
            <span>Search scenarios</span>

            <span className="scenario-search-control">
              <svg
                aria-hidden="true"
                className="scenario-search-control__icon"
                viewBox="0 0 24 24"
              >
                <circle cx="11" cy="11" r="6" />
                <path d="m16 16 4 4" />
              </svg>

              <input
                type="search"
                name="q"
                defaultValue={filters.query}
                placeholder="Search titles, problems, or patterns"
              />
            </span>
          </label>

          <div className="scenario-filters__grid">
            <label className="scenario-filter-field">
              <span>Pattern</span>

              <span className="scenario-select-control">
                <select name="pattern" defaultValue={filters.patternSlug ?? ""}>
                  <option value="">All patterns</option>
                  {filterOptions.map((pattern) => (
                    <option key={pattern.slug} value={pattern.slug}>
                      {pattern.name}
                    </option>
                  ))}
                </select>

                <svg
                  aria-hidden="true"
                  className="scenario-select-control__chevron"
                  viewBox="0 0 24 24"
                >
                  <path d="m7 10 5 5 5-5" />
                </svg>
              </span>
            </label>

            <label className="scenario-filter-field">
              <span>Category</span>

              <span className="scenario-select-control">
                <select name="category" defaultValue={filters.category ?? ""}>
                  <option value="">All categories</option>
                  {availableCategories.map((category) => (
                    <option key={category} value={category}>
                      {formatLabel(category)}
                    </option>
                  ))}
                </select>

                <svg
                  aria-hidden="true"
                  className="scenario-select-control__chevron"
                  viewBox="0 0 24 24"
                >
                  <path d="m7 10 5 5 5-5" />
                </svg>
              </span>
            </label>

            <label className="scenario-filter-field">
              <span>Layer</span>

              <span className="scenario-select-control">
                <select name="layer" defaultValue={filters.layer ?? ""}>
                  <option value="">All layers</option>
                  {availableLayers.map((layer) => (
                    <option key={layer} value={layer}>
                      {formatLabel(layer)}
                    </option>
                  ))}
                </select>

                <svg
                  aria-hidden="true"
                  className="scenario-select-control__chevron"
                  viewBox="0 0 24 24"
                >
                  <path d="m7 10 5 5 5-5" />
                </svg>
              </span>
            </label>

            <label className="scenario-filter-field">
              <span>Sort</span>

              <span className="scenario-select-control">
                <select name="sort" defaultValue={filters.sort}>
                  <option value="title-asc">Title: A-Z</option>
                  <option value="created-desc">Recently added</option>
                  <option value="updated-desc">Recently updated</option>
                </select>

                <svg
                  aria-hidden="true"
                  className="scenario-select-control__chevron"
                  viewBox="0 0 24 24"
                >
                  <path d="m7 10 5 5 5-5" />
                </svg>
              </span>
            </label>
          </div>

          <div className="scenario-filters__actions">
            <button
              className="button-link button-link--secondary"
              type="submit"
            >
              Apply filters
            </button>
          </div>
        </form>
      </SectionCard>

      {scenarios === null ? (
        <SectionCard title="Catalog unavailable">
          <p>
            Scenario data is temporarily unavailable. Confirm that the catalog
            database is running and that DATABASE_URL is configured, then try
            again.
          </p>
        </SectionCard>
      ) : (
        <>
          <div className="scenario-results-header">
            <p className="results-meta">
              Showing <strong>{scenarios.length}</strong> scenario
              {scenarios.length === 1 ? "" : "s"}
            </p>

            {activeFilters.length > 0 ? (
              <div className="panel-meta" aria-label="Active filters">
                {activeFilters.map((filter) => (
                  <Link key={filter.href} href={filter.href}>
                    <Tag>{filter.label} ×</Tag>
                  </Link>
                ))}
              </div>
            ) : null}
          </div>

          {scenarios.length === 0 ? (
            <SectionCard title="No matching scenarios">
              <p>Try changing your search or clearing one or more filters.</p>

              <Link
                className="button-link button-link--secondary"
                href="/scenarios"
              >
                Clear all filters
              </Link>
            </SectionCard>
          ) : (
            <div className="grid two-up">
              {scenarios.map((scenario) => (
                <SectionCard key={scenario.id} title={scenario.name}>
                  <p>{scenario.summary}</p>

                  <div className="panel-meta">
                    {scenario.patternLinks.map(({ pattern }) => (
                      <Link key={pattern.id} href={`/patterns/${pattern.slug}`}>
                        <Tag>{pattern.name}</Tag>
                      </Link>
                    ))}

                    <Tag>
                      {scenario._count.technologyLinks}{" "}
                      {scenario._count.technologyLinks === 1
                        ? "technology"
                        : "technologies"}
                    </Tag>
                  </div>

                  <Link
                    className="button-link button-link--secondary"
                    href={`/scenarios/${scenario.slug}`}
                  >
                    View scenario →
                  </Link>
                </SectionCard>
              ))}
            </div>
          )}
        </>
      )}
    </section>
  );
}
