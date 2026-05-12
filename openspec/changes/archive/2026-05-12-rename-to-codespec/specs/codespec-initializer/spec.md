## ADDED Requirements

### Requirement: CodeSpec CLI Identity

The initializer SHALL use `codespec` as the project identity and SHALL expose the npm package and executable command as `create-codespec`.

#### Scenario: Package metadata names CodeSpec initializer

Given a developer inspects the package metadata
When the package name and binary entries are read
Then they SHALL identify the initializer as `create-codespec`
And they SHALL NOT expose a legacy package name or bin alias.

#### Scenario: Help output shows CodeSpec command

Given the developer runs the initializer help command
When usage information is printed
Then it SHALL show `npx create-codespec [project-name] [options]`.

### Requirement: CodeSpec Documentation Identity

Repository documentation, verification scripts, and OpenSpec artifacts SHALL use CodeSpec project naming for this initializer while preserving Power Apps Code Apps platform references.

#### Scenario: Repository project identity is searched

Given the repository has been renamed to CodeSpec
When maintainers search documentation, code, and OpenSpec artifacts for old initializer identity terms
Then legacy initializer, repository, and package fallback terms SHALL NOT remain as project identity references.

#### Scenario: Platform references remain accurate

Given documentation describes the generated app platform or upstream starter source
When maintainers review those references
Then Power Apps Code Apps, `pac code init`, and `microsoft/PowerAppsCodeApps` references SHALL remain accurate and SHALL NOT be renamed to CodeSpec.

## MODIFIED Requirements

### Requirement: Project Name Handling

The initializer SHALL accept an optional project folder name as a positional argument.

#### Scenario: Project name is provided

Given the developer runs `npx create-codespec my-app`
When the initializer starts
Then it SHALL use `my-app` as the target folder name
And it SHALL not prompt for the project name.

#### Scenario: Project name is omitted

Given the developer runs `npx create-codespec`
When the initializer starts
Then it SHALL prompt the developer for a project name
And it SHALL use the provided value as the target folder name.

### Requirement: Target Folder Safety

The initializer SHALL avoid overwriting an existing target folder by default.

#### Scenario: Target folder already exists

Given a folder named `my-app` already exists
When the developer runs `npx create-codespec my-app`
Then the initializer SHALL stop before copying files
And it SHALL explain that the target folder already exists.
