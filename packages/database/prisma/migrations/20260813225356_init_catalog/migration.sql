-- CreateEnum
CREATE TYPE "TechnologyKind" AS ENUM ('LANGUAGE', 'FRAMEWORK', 'LIBRARY', 'DATABASE', 'MESSAGE_BROKER', 'STREAM_PROCESSOR', 'CLOUD_SERVICE', 'OBSERVABILITY_TOOL', 'RUNTIME', 'TOOL');

-- CreateEnum
CREATE TYPE "CatalogStatus" AS ENUM ('ACTIVE', 'LEGACY', 'EMERGING', 'DRAFT', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "CompatibilityStatus" AS ENUM ('RECOMMENDED', 'SUPPORTED', 'SUPPORTED_WITH_ADAPTER', 'CAVEAT', 'NOT_RECOMMENDED', 'INCOMPATIBLE');

-- CreateTable
CREATE TABLE "core_languages" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "ecosystem" TEXT,
    "status" "CatalogStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "core_languages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "technologies" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "kind" "TechnologyKind" NOT NULL,
    "summary" TEXT NOT NULL,
    "status" "CatalogStatus" NOT NULL DEFAULT 'ACTIVE',
    "coreLanguageId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "technologies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "patterns" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "layer" TEXT,
    "status" "CatalogStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "patterns_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pattern_variants" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "patternId" TEXT NOT NULL,
    "coreLanguageId" TEXT,
    "technologyId" TEXT,
    "title" TEXT NOT NULL,
    "summary" TEXT,
    "layer" TEXT,
    "code" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pattern_variants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "scenarios" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "problemStatement" TEXT NOT NULL,
    "status" "CatalogStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "scenarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "scenario_patterns" (
    "scenarioId" TEXT NOT NULL,
    "patternId" TEXT NOT NULL,

    CONSTRAINT "scenario_patterns_pkey" PRIMARY KEY ("scenarioId","patternId")
);

-- CreateTable
CREATE TABLE "scenario_technologies" (
    "scenarioId" TEXT NOT NULL,
    "technologyId" TEXT NOT NULL,

    CONSTRAINT "scenario_technologies_pkey" PRIMARY KEY ("scenarioId","technologyId")
);

-- CreateTable
CREATE TABLE "technology_compatibilities" (
    "id" TEXT NOT NULL,
    "sourceTechnologyId" TEXT NOT NULL,
    "targetTechnologyId" TEXT NOT NULL,
    "status" "CompatibilityStatus" NOT NULL,
    "rationale" TEXT NOT NULL,
    "requiredAdapter" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "technology_compatibilities_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "core_languages_slug_key" ON "core_languages"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "technologies_slug_key" ON "technologies"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "patterns_slug_key" ON "patterns"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "pattern_variants_slug_key" ON "pattern_variants"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "scenarios_slug_key" ON "scenarios"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "technology_compatibilities_sourceTechnologyId_targetTechnol_key" ON "technology_compatibilities"("sourceTechnologyId", "targetTechnologyId");

-- AddForeignKey
ALTER TABLE "technologies" ADD CONSTRAINT "technologies_coreLanguageId_fkey" FOREIGN KEY ("coreLanguageId") REFERENCES "core_languages"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pattern_variants" ADD CONSTRAINT "pattern_variants_patternId_fkey" FOREIGN KEY ("patternId") REFERENCES "patterns"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pattern_variants" ADD CONSTRAINT "pattern_variants_coreLanguageId_fkey" FOREIGN KEY ("coreLanguageId") REFERENCES "core_languages"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scenario_patterns" ADD CONSTRAINT "scenario_patterns_scenarioId_fkey" FOREIGN KEY ("scenarioId") REFERENCES "scenarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scenario_patterns" ADD CONSTRAINT "scenario_patterns_patternId_fkey" FOREIGN KEY ("patternId") REFERENCES "patterns"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scenario_technologies" ADD CONSTRAINT "scenario_technologies_scenarioId_fkey" FOREIGN KEY ("scenarioId") REFERENCES "scenarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scenario_technologies" ADD CONSTRAINT "scenario_technologies_technologyId_fkey" FOREIGN KEY ("technologyId") REFERENCES "technologies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "technology_compatibilities" ADD CONSTRAINT "technology_compatibilities_sourceTechnologyId_fkey" FOREIGN KEY ("sourceTechnologyId") REFERENCES "technologies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "technology_compatibilities" ADD CONSTRAINT "technology_compatibilities_targetTechnologyId_fkey" FOREIGN KEY ("targetTechnologyId") REFERENCES "technologies"("id") ON DELETE CASCADE ON UPDATE CASCADE;
