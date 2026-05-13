#!/usr/bin/env node

const childProcess = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const repoRoot = path.resolve(__dirname, '..');
const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'codespec-'));
const tempBin = path.join(tempRoot, 'bin');
const fakeOpenSpecLogPath = path.join(tempRoot, 'openspec-invocations.jsonl');
const projectName = 'verify-app';
const projectPath = path.join(tempRoot, projectName);
const cliPath = path.join(repoRoot, 'bin', 'create-codespec.js');
const openspecTelemetryGuardrail = 'OPENSPEC_TELEMETRY=0';

try {
  createFakeOpenSpecCli(tempBin, fakeOpenSpecLogPath);

  const rootHelp = runAndCapture('node', [cliPath], tempRoot);
  assertOutputContains(rootHelp.stdout, 'Project creation: codespec init <project-name> [options]');
  assertOutputExcludes(rootHelp.stdout, 'Project name:');

  assertCommandFails(
    'node',
    [cliPath, 'shorthand-app', '--skip-install', '--skip-git'],
    tempRoot,
    {},
    /Project creation now requires the init command\. Use: codespec init shorthand-app/
  );
  assertPathMissing(path.join(tempRoot, 'shorthand-app'));

  assertCommandFails(
    'node',
    [cliPath, 'init', '.'],
    tempRoot,
    {},
    /Current-folder initialization is not supported yet\. Use: codespec init <project-name>/
  );
  assertCommandFails(
    'node',
    [cliPath, 'init', '--here'],
    tempRoot,
    {},
    /Current-folder initialization is not supported yet\. Use: codespec init <project-name>/
  );
  assertPathMissing(path.join(tempRoot, 'package.json'));
  assertPathMissing(path.join(tempRoot, 'openspec'));

  run(
    'node',
    [cliPath, 'init', projectName, '--skip-install', '--skip-git'],
    tempRoot,
    {
      CODESPEC_FAKE_OPENSPEC_LOG: fakeOpenSpecLogPath,
      PATH: `${tempBin}${path.delimiter}${process.env.PATH}`,
    }
  );

  assertFakeOpenSpecInvocations(fakeOpenSpecLogPath);

  assertFile(path.join(projectPath, 'package.json'));
  assertFile(path.join(projectPath, 'openspec', 'config.yaml'));
  assertDirectory(path.join(projectPath, '.github', 'prompts'));
  assertDirectory(path.join(projectPath, '.github', 'skills'));
  assertFile(path.join(projectPath, '.github', 'workflows', 'ghas.yml'));
  assertFile(path.join(projectPath, '.github', 'workflows', 'quality.yml'));
  assertFile(path.join(projectPath, 'playwright.config.ts'));
  assertFile(path.join(projectPath, 'prettier.config.js'));
  assertFile(path.join(projectPath, '.prettierignore'));
  assertFile(path.join(projectPath, 'scripts', 'check-changed-file-coverage.js'));
  assertFile(path.join(projectPath, 'src', 'test', 'setup.ts'));
  assertFile(path.join(projectPath, 'src', 'App.test.tsx'));
  assertFile(path.join(projectPath, 'src', 'telemetry', 'app-telemetry.ts'));
  assertFile(path.join(projectPath, 'src', 'telemetry', 'app-telemetry.test.ts'));
  assertFile(path.join(projectPath, 'e2e', 'home.spec.ts'));

  const promptCount = countFiles(path.join(projectPath, '.github', 'prompts'));
  const skillCount = countDirectories(path.join(projectPath, '.github', 'skills'));

  if (promptCount !== 11) {
    throw new Error(`Expected 11 OPSX prompt files, found ${promptCount}.`);
  }

  if (skillCount !== 11) {
    throw new Error(`Expected 11 OpenSpec skill folders, found ${skillCount}.`);
  }

  assertFilesContain(path.join(projectPath, '.github', 'prompts'), '.prompt.md', openspecTelemetryGuardrail);
  assertFilesContain(path.join(projectPath, '.github', 'skills'), 'SKILL.md', openspecTelemetryGuardrail);

  const expectedConfig = fs.readFileSync(path.join(repoRoot, 'templates', 'openspec', 'config.yaml'), 'utf8');
  const actualConfig = fs.readFileSync(path.join(projectPath, 'openspec', 'config.yaml'), 'utf8');

  if (actualConfig !== expectedConfig) {
    throw new Error('Generated openspec/config.yaml does not match the fixed template config.');
  }

  if (!actualConfig.includes('Vite + React 19 (TypeScript)')) {
    throw new Error('Generated openspec/config.yaml does not describe React 19.');
  }

  const generatedPackage = readJson(path.join(projectPath, 'package.json'));

  assertPackageScript(generatedPackage, 'lint');
  assertPackageScript(generatedPackage, 'test');
  assertPackageScript(generatedPackage, 'test:run');
  assertPackageScript(generatedPackage, 'test:coverage');
  assertPackageScript(generatedPackage, 'coverage:changed');
  assertPackageScript(generatedPackage, 'e2e');
  assertPackageScript(generatedPackage, 'format');
  assertPackageScript(generatedPackage, 'format:check');

  assertPackageScriptValue(generatedPackage, 'lint', /--max-warnings 0/);
  assertPackageScriptValue(generatedPackage, 'test:coverage', /vitest run --coverage/);
  assertPackageScriptValue(generatedPackage, 'coverage:changed', /check-changed-file-coverage\.js/);

  assertPackageDependency(generatedPackage, 'dependencies', 'react', /^\^19\./);
  assertPackageDependency(generatedPackage, 'dependencies', 'react-dom', /^\^19\./);
  assertPackageDependency(generatedPackage, 'devDependencies', 'vitest');
  assertPackageDependency(generatedPackage, 'devDependencies', 'jsdom');
  assertPackageDependency(generatedPackage, 'devDependencies', '@testing-library/react');
  assertPackageDependency(generatedPackage, 'devDependencies', '@testing-library/jest-dom');
  assertPackageDependency(generatedPackage, 'devDependencies', '@testing-library/user-event');
  assertPackageDependency(generatedPackage, 'devDependencies', '@playwright/test');
  assertPackageDependency(generatedPackage, 'devDependencies', '@vitest/coverage-v8', /^\^4\./);
  assertPackageDependency(generatedPackage, 'devDependencies', 'prettier');

  console.log('Generated project verification passed.');
} finally {
  fs.rmSync(tempRoot, { recursive: true, force: true });
}

function run(command, args, cwd, env = {}) {
  const result = childProcess.spawnSync(command, args, {
    cwd,
    env: { ...process.env, ...env },
    stdio: 'inherit',
    shell: process.platform === 'win32',
  });

  if (result.error) {
    throw result.error;
  }

  if (result.status !== 0) {
    throw new Error(`Command failed: ${command} ${args.join(' ')}`);
  }
}

function runAndCapture(command, args, cwd, env = {}) {
  const result = childProcess.spawnSync(command, args, {
    cwd,
    env: { ...process.env, ...env },
    encoding: 'utf8',
    input: '',
    shell: process.platform === 'win32',
    timeout: 5000,
  });

  if (result.error) {
    throw result.error;
  }

  if (result.status !== 0) {
    throw new Error(`Expected command to pass: ${command} ${args.join(' ')}\n${result.stderr || result.stdout}`);
  }

  return result;
}

function assertCommandFails(command, args, cwd, env = {}, messagePattern) {
  const result = childProcess.spawnSync(command, args, {
    cwd,
    env: { ...process.env, ...env },
    encoding: 'utf8',
    input: '',
    shell: process.platform === 'win32',
    timeout: 5000,
  });

  if (result.error) {
    throw result.error;
  }

  if (result.status === 0) {
    throw new Error(`Expected command to fail: ${command} ${args.join(' ')}`);
  }

  const output = `${result.stdout || ''}${result.stderr || ''}`;
  if (!messagePattern.test(output)) {
    throw new Error(`Expected failure output to match ${messagePattern}, found:\n${output}`);
  }
}

function createFakeOpenSpecCli(binPath, logPath) {
  fs.mkdirSync(binPath, { recursive: true });

  const executablePath = path.join(binPath, process.platform === 'win32' ? 'openspec.cmd' : 'openspec');
  const script = process.platform === 'win32'
    ? `@echo off\nnode "%~dp0\\openspec.js" %*\n`
    : `#!/usr/bin/env node\nrequire('./openspec.js');\n`;

  fs.writeFileSync(executablePath, script);

  if (process.platform !== 'win32') {
    fs.chmodSync(executablePath, 0o755);
  }

  fs.writeFileSync(path.join(binPath, 'openspec.js'), `
const fs = require('node:fs');
const path = require('node:path');

const logPath = process.env.CODESPEC_FAKE_OPENSPEC_LOG || ${JSON.stringify(logPath)};

if (process.env.OPENSPEC_TELEMETRY !== '0') {
  console.error('Expected OPENSPEC_TELEMETRY=0 for OpenSpec command.');
  process.exit(42);
}

const args = process.argv.slice(2);
fs.appendFileSync(logPath, JSON.stringify({ args, cwd: process.cwd(), telemetry: process.env.OPENSPEC_TELEMETRY }) + '\\n');

if (args[0] === '--version') {
  console.log('openspec 0.0.0-test');
  process.exit(0);
}

if (args[0] === 'init' || args[0] === 'update') {
  fs.mkdirSync(path.join(process.cwd(), 'openspec'), { recursive: true });
  process.exit(0);
}

console.error('Unexpected fake openspec command: ' + args.join(' '));
process.exit(1);
`);
}

function assertFakeOpenSpecInvocations(logPath) {
  const invocations = fs.readFileSync(logPath, 'utf8')
    .trim()
    .split('\n')
    .filter(Boolean)
    .map((line) => JSON.parse(line));

  if (!invocations.some((entry) => entry.args[0] === '--version')) {
    throw new Error('Expected generated project verification to check OpenSpec availability.');
  }

  if (!invocations.some((entry) => entry.args[0] === 'init')) {
    throw new Error('Expected generated project verification to initialize OpenSpec.');
  }

  for (const entry of invocations) {
    if (entry.telemetry !== '0') {
      throw new Error(`Expected OPENSPEC_TELEMETRY=0 for openspec ${entry.args.join(' ')}`);
    }
  }
}

function assertFile(filePath) {
  if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
    throw new Error(`Expected file missing: ${filePath}`);
  }
}

function assertDirectory(directoryPath) {
  if (!fs.existsSync(directoryPath) || !fs.statSync(directoryPath).isDirectory()) {
    throw new Error(`Expected directory missing: ${directoryPath}`);
  }
}

function assertPathMissing(entryPath) {
  if (fs.existsSync(entryPath)) {
    throw new Error(`Expected path to be absent: ${entryPath}`);
  }
}

function assertOutputContains(output, expectedText) {
  if (!output.includes(expectedText)) {
    throw new Error(`Expected output to include ${expectedText}.`);
  }
}

function assertOutputExcludes(output, unexpectedText) {
  if (output.includes(unexpectedText)) {
    throw new Error(`Expected output not to include ${unexpectedText}.`);
  }
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function assertPackageScript(packageJson, scriptName) {
  if (!packageJson.scripts || !packageJson.scripts[scriptName]) {
    throw new Error(`Expected package script missing: ${scriptName}`);
  }
}

function assertPackageScriptValue(packageJson, scriptName, valuePattern) {
  const value = packageJson.scripts?.[scriptName];

  if (!valuePattern.test(value)) {
    throw new Error(`Expected package script ${scriptName} to match ${valuePattern}, found ${value}`);
  }
}

function assertPackageDependency(packageJson, section, dependencyName, versionPattern) {
  const version = packageJson[section]?.[dependencyName];

  if (!version) {
    throw new Error(`Expected package ${section} missing: ${dependencyName}`);
  }

  if (versionPattern && !versionPattern.test(version)) {
    throw new Error(`Expected package ${dependencyName} version to match ${versionPattern}, found ${version}`);
  }
}

function countFiles(directoryPath) {
  return fs.readdirSync(directoryPath)
    .filter((entry) => fs.statSync(path.join(directoryPath, entry)).isFile())
    .length;
}

function countDirectories(directoryPath) {
  return fs.readdirSync(directoryPath)
    .filter((entry) => fs.statSync(path.join(directoryPath, entry)).isDirectory())
    .length;
}

function assertFilesContain(directoryPath, fileNamePattern, expectedText) {
  for (const entry of fs.readdirSync(directoryPath)) {
    const entryPath = path.join(directoryPath, entry);
    const stat = fs.statSync(entryPath);

    if (stat.isDirectory()) {
      assertFilesContain(entryPath, fileNamePattern, expectedText);
      continue;
    }

    if (!entry.endsWith(fileNamePattern)) {
      continue;
    }

    const content = fs.readFileSync(entryPath, 'utf8');
    if (!content.includes(expectedText)) {
      throw new Error(`Expected ${entryPath} to include ${expectedText}.`);
    }
  }
}