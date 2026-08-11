import type {
  ExampleRuntime,
  PatternRecord,
  PatternLanguageExample,
  PatternUseCase,
} from "@atlas-patterns/schemas";

type RuntimeFilter = "all" | ExampleRuntime;

export function filterPatternContentByRuntime(
  pattern: PatternRecord,
  runtime: RuntimeFilter,
): {
  realWorldExamples: PatternUseCase[];
  languageExamples: PatternLanguageExample[];
} {
  const matches = (itemRuntime?: ExampleRuntime) =>
    runtime === "all" || itemRuntime === runtime;

  const realWorldExamples = (pattern.realWorldExamples ?? []).filter((item) =>
    matches(item.runtime),
  );

  const languageExamples = Object.values(pattern.scenarioExamples ?? {})
    .flatMap((examplesByLanguage) => Object.values(examplesByLanguage ?? {}))
    .filter((example): example is NonNullable<typeof example> => example != null)
    .filter((example) => matches(example.runtime));

  return {
    realWorldExamples,
    languageExamples,
  };
}