#!/usr/bin/env node

import childProcess from "node:child_process"
import fs from "node:fs"
import path from "node:path"
import process from "node:process"

const defaultSummaryPath = path.join("coverage", "coverage-summary.json")
const sourceExtensions = new Set([".js", ".jsx", ".ts", ".tsx"])

const options = parseArgs(process.argv.slice(2))
const summaryPath = options.summary || defaultSummaryPath
const threshold = Number.parseFloat(
  options.threshold || process.env.CHANGED_FILE_COVERAGE_THRESHOLD || "80"
)

if (!Number.isFinite(threshold)) {
  throw new Error("Coverage threshold must be a number.")
}

if (!fs.existsSync(summaryPath)) {
  throw new Error(`Coverage summary not found: ${summaryPath}`)
}

const changedFiles = getChangedFiles(options)
const changedSourceFiles = changedFiles.filter(isSourceFile)

if (changedSourceFiles.length === 0) {
  console.log("No changed source files found for coverage check.")
  process.exit(0)
}

const coverageSummary = JSON.parse(fs.readFileSync(summaryPath, "utf8"))
const coverageByPath = indexCoverageByPath(coverageSummary)
const uncoveredFiles = []
const failingFiles = []

for (const changedFile of changedSourceFiles) {
  const coverage = coverageByPath.get(normalizePath(changedFile))

  if (!coverage) {
    uncoveredFiles.push(changedFile)
    continue
  }

  const lineCoverage = Number(coverage.lines?.pct)

  if (!Number.isFinite(lineCoverage) || lineCoverage < threshold) {
    failingFiles.push({ filePath: changedFile, lineCoverage })
  }
}

if (uncoveredFiles.length > 0) {
  console.log("Changed source files without coverage summary entries:")
  for (const filePath of uncoveredFiles) {
    console.log(`- ${filePath}`)
  }
}

if (failingFiles.length > 0) {
  console.error(`Changed file coverage must be at least ${threshold}%.`)
  for (const failure of failingFiles) {
    console.error(`- ${failure.filePath}: ${failure.lineCoverage}%`)
  }
  process.exit(1)
}

console.log(`Changed file coverage is at least ${threshold}%.`)

function parseArgs(args) {
  const parsed = {}

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index]

    if (!arg.startsWith("--")) {
      throw new Error(`Unexpected argument: ${arg}`)
    }

    const key = arg.slice(2)
    const value = args[index + 1]

    if (!value || value.startsWith("--")) {
      throw new Error(`Missing value for --${key}`)
    }

    parsed[toCamelCase(key)] = value
    index += 1
  }

  return parsed
}

function getChangedFiles(options) {
  const baseRef = options.base || process.env.COVERAGE_BASE_REF
  const headRef = options.head || process.env.COVERAGE_HEAD_REF || "HEAD"

  if (baseRef && !isEmptyGitSha(baseRef)) {
    return gitDiff(baseRef, headRef)
  }

  try {
    return gitDiff("HEAD~1", headRef)
  } catch (error) {
    console.log("Unable to determine changed files; skipping changed-file coverage check.")
    return []
  }
}

function gitDiff(baseRef, headRef) {
  const result = childProcess.spawnSync(
    "git",
    ["diff", "--name-only", "--diff-filter=ACMRT", baseRef, headRef],
    { encoding: "utf8" }
  )

  if (result.error) {
    throw result.error
  }

  if (result.status !== 0) {
    throw new Error(result.stderr.trim() || `git diff failed for ${baseRef}..${headRef}`)
  }

  return result.stdout
    .split("\n")
    .map((entry) => entry.trim())
    .filter(Boolean)
}

function isSourceFile(filePath) {
  const normalized = normalizePath(filePath)
  const extension = path.extname(normalized)

  return (
    normalized.startsWith("src/") &&
    sourceExtensions.has(extension) &&
    !normalized.endsWith(".d.ts") &&
    !/\.(test|spec)\.[jt]sx?$/.test(normalized)
  )
}

function indexCoverageByPath(coverageSummary) {
  const coverageByPath = new Map()

  for (const [coveragePath, coverage] of Object.entries(coverageSummary)) {
    if (coveragePath === "total") {
      continue
    }

    const normalized = normalizePath(coveragePath)
    coverageByPath.set(normalized, coverage)
    coverageByPath.set(normalizePath(path.relative(process.cwd(), normalized)), coverage)
  }

  return coverageByPath
}

function normalizePath(filePath) {
  return filePath.split(path.sep).join("/")
}

function isEmptyGitSha(value) {
  return /^0+$/.test(value)
}

function toCamelCase(value) {
  return value.replace(/-([a-z])/g, (_, character) => character.toUpperCase())
}