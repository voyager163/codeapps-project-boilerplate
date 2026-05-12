#!/usr/bin/env node

const childProcess = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const repoRoot = path.resolve(__dirname, '..');
const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'codespec-'));
const projectName = 'verify-app';
const projectPath = path.join(tempRoot, projectName);

try {
  run('node', [path.join(repoRoot, 'bin', 'create-codespec.js'), projectName, '--skip-install', '--skip-git'], tempRoot);

  assertFile(path.join(projectPath, 'package.json'));
  assertFile(path.join(projectPath, 'openspec', 'config.yaml'));
  assertDirectory(path.join(projectPath, '.github', 'prompts'));
  assertDirectory(path.join(projectPath, '.github', 'skills'));

  const promptCount = countFiles(path.join(projectPath, '.github', 'prompts'));
  const skillCount = countDirectories(path.join(projectPath, '.github', 'skills'));

  if (promptCount !== 11) {
    throw new Error(`Expected 11 OPSX prompt files, found ${promptCount}.`);
  }

  if (skillCount !== 11) {
    throw new Error(`Expected 11 OpenSpec skill folders, found ${skillCount}.`);
  }

  const expectedConfig = fs.readFileSync(path.join(repoRoot, 'templates', 'openspec', 'config.yaml'), 'utf8');
  const actualConfig = fs.readFileSync(path.join(projectPath, 'openspec', 'config.yaml'), 'utf8');

  if (actualConfig !== expectedConfig) {
    throw new Error('Generated openspec/config.yaml does not match the fixed template config.');
  }

  console.log('Generated project verification passed.');
} finally {
  fs.rmSync(tempRoot, { recursive: true, force: true });
}

function run(command, args, cwd) {
  const result = childProcess.spawnSync(command, args, {
    cwd,
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