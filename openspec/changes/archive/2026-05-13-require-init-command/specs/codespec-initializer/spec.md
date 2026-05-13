## ADDED Requirements

### Requirement: Existing-Folder Init Reservation
The initializer SHALL reserve existing-folder initialization command forms without modifying the current folder until a future change defines that behavior.

#### Scenario: Current-folder init is requested
- **WHEN** the developer runs `codespec init .`
- **THEN** the initializer SHALL stop before creating or modifying project files
- **AND** it SHALL print a clear message that current-folder initialization is not supported yet.

#### Scenario: Here init is requested
- **WHEN** the developer runs `codespec init --here`
- **THEN** the initializer SHALL stop before creating or modifying project files
- **AND** it SHALL print a clear message that current-folder initialization is not supported yet.

## MODIFIED Requirements

### Requirement: CodeSpec CLI Identity
The initializer SHALL use `codespec` as the project identity, SHALL publish the npm package as `@voyager163/codespec`, SHALL expose `codespec` as the primary executable command, and SHALL use `init` as the project creation subcommand.

#### Scenario: Package metadata names CodeSpec initializer
Given a developer inspects the package metadata
When the package name and binary entries are read
Then the package name SHALL identify the initializer as `@voyager163/codespec`
And the binary entries SHALL expose `codespec` as the primary command
And they MAY expose `create-codespec` as a backwards-compatible bin alias.

#### Scenario: Help output shows CodeSpec init command
Given the developer runs the initializer help command
When usage information is printed
Then it SHALL show `codespec init <project-name> [options]` as the project creation command
And it SHALL mention `npm install -g @voyager163/codespec@latest` as the global install command.

#### Scenario: Root command shows command help
- **WHEN** the developer runs `codespec` without a subcommand
- **THEN** the initializer SHALL print command help
- **AND** it SHALL NOT prompt for a project name.

### Requirement: Project Name Handling
The initializer SHALL accept an optional project folder name only after the `init` subcommand.

#### Scenario: Project name is provided to init
Given the developer runs `codespec init my-app`
When the initializer starts
Then it SHALL use `my-app` as the target folder name
And it SHALL not prompt for the project name.

#### Scenario: Project name is omitted from init
Given the developer runs `codespec init`
When the initializer starts
Then it SHALL prompt the developer for a project name
And it SHALL use the provided value as the target folder name.

#### Scenario: Root positional project name is rejected
- **WHEN** the developer runs `codespec my-app`
- **THEN** the initializer SHALL stop before creating project files
- **AND** it SHALL print a clear message directing the developer to run `codespec init my-app`.

### Requirement: Target Folder Safety
The initializer SHALL avoid overwriting an existing target folder by default.

#### Scenario: Target folder already exists
Given a folder named `my-app` already exists
When the developer runs `codespec init my-app`
Then the initializer SHALL stop before copying files
And it SHALL explain that the target folder already exists.