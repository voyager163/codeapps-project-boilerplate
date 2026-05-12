## MODIFIED Requirements

### Requirement: CodeSpec Documentation Identity

Repository documentation, verification scripts, OpenSpec artifacts, and community files SHALL use CodeSpec project naming for this initializer while preserving Power Apps Code Apps platform references and the project's open-source spec-driven development positioning.

#### Scenario: Repository project identity is searched

Given the repository has been renamed to CodeSpec
When maintainers search documentation, code, OpenSpec artifacts, and community files for old initializer identity terms
Then legacy initializer, repository, and package fallback terms SHALL NOT remain as project identity references.

#### Scenario: Platform references remain accurate

Given documentation describes the generated app platform or upstream starter source
When maintainers review those references
Then Power Apps Code Apps, `pac code init`, and `microsoft/PowerAppsCodeApps` references SHALL remain accurate and SHALL NOT be renamed to CodeSpec.

#### Scenario: Open-source positioning remains accurate

Given documentation describes CodeSpec's public purpose
When maintainers review README and community documentation
Then the documentation SHALL describe CodeSpec as an open source setup for Power Apps Code Apps development with spec-driven workflows
And it SHALL identify OpenSpec as the current framework choice rather than an irreversible project constraint.