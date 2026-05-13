#!/usr/bin/env node

const childProcess = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const readline = require('node:readline');

const commandName = 'codespec';
const minNodeVersion = [20, 19, 0];
const openspecPackage = '@fission-ai/openspec@latest';
const openspecTelemetryOptOutEnv = {
  OPENSPEC_TELEMETRY: '0',
};
const initCommand = 'init';
const reservedCommands = new Set(['doctor', 'check', 'verify', 'repair', 'version']);
let activePromptInterface = null;
let pipedPromptLines = null;

async function main() {
  const options = parseArgs(process.argv.slice(2));

  if (options.help) {
    printHelp();
    return;
  }

  const projectName = options.projectName || await promptForProjectName();
  validateProjectName(projectName);

  const targetPath = path.resolve(process.cwd(), projectName);
  const templateRoot = path.resolve(__dirname, '..', 'templates');
  const progress = new ProgressTree('Initialize CodeSpec Project');
  let powerAppsInitStatus = options.skipPacInit ? 'skipped' : 'pending';

  progress.start(projectName);

  await progress.runStep('preflight', 'Check required tools', 'Check Node.js', () => checkNodeVersion());
  await progress.runStep('preflight', 'Check required tools', 'Check npm', () => requireCommand('npm'));
  await progress.runStep('preflight', 'Check required tools', 'Check git', () => requireCommand('git'));

  if (options.skipPacInit) {
    progress.skipStep('preflight', 'Check required tools', 'Check Power Platform CLI');
  } else {
    await progress.runStep('preflight', 'Check required tools', 'Check Power Platform CLI', () => ensurePowerPlatformCli());
  }

  await progress.runStep('preflight', 'Check required tools', 'Check OpenSpec', () => ensureOpenSpec());
  await progress.runStep('preflight', 'Check required tools', 'Validate target folder', () => ensureTargetAvailable(targetPath));
  await progress.runStep('local-project', 'Set up local project', 'Copy starter template', () => copyStarter(templateRoot, targetPath, projectName));
  await progress.runStep('local-project', 'Set up local project', 'Copy OpenSpec OPSX assets', () => copyGithubOverlay(templateRoot, targetPath));
  await progress.runStep('local-project', 'Set up local project', 'Install npm dependencies', () => installDependencies(targetPath, options));
  await progress.runStep('local-project', 'Set up local project', 'Initialize OpenSpec', () => setupOpenSpec(targetPath));
  await progress.runStep('local-project', 'Set up local project', 'Apply Power Apps OpenSpec config', () => applyOpenSpecConfig(templateRoot, targetPath));
  await progress.runStep('local-project', 'Set up local project', 'Finalize OPSX assets', () => copyGithubOverlay(templateRoot, targetPath));
  await progress.runStep('local-project', 'Set up local project', 'Initialize git repository', () => initializeGit(targetPath, options));

  if (options.skipPacInit) {
    progress.skipStep('power-apps', 'Initialize Power Apps Code App', 'Run guided pac code init');
  } else {
    powerAppsInitStatus = await initializePowerAppsCodeApp(targetPath, progress);
  }

  await progress.runStep('finalization', 'Finalize', 'Project ready', () => undefined);

  closePromptInterface();
  printNextSteps(projectName, powerAppsInitStatus);
}

function parseArgs(args) {
  const options = {
    command: '',
    help: false,
    projectName: '',
    skipInstall: false,
    skipGit: false,
    skipPacInit: false,
  };

  if (args.length === 0) {
    options.help = true;
    return options;
  }

  const [command, ...commandArgs] = args;

  if (command === '--help' || command === '-h' || command === 'help') {
    options.help = true;
    return options;
  }

  if (command !== initCommand) {
    if (reservedCommands.has(command)) {
      throw new Error(`Command not implemented yet: ${command}`);
    }

    if (command.startsWith('-')) {
      throw new Error(`Unknown option: ${command}`);
    }

    throw new Error(`Project creation now requires the init command. Use: ${commandName} init ${command}`);
  }

  options.command = command;

  for (const arg of commandArgs) {
    if (arg === '--help' || arg === '-h') {
      options.help = true;
    } else if (arg === '--here') {
      throw new Error(`Current-folder initialization is not supported yet. Use: ${commandName} init <project-name>`);
    } else if (arg === '--skip-install') {
      options.skipInstall = true;
    } else if (arg === '--skip-git') {
      options.skipGit = true;
    } else if (arg === '--skip-pac-init') {
      options.skipPacInit = true;
    } else if (arg.startsWith('-')) {
      throw new Error(`Unknown option: ${arg}`);
    } else if (!options.projectName) {
      options.projectName = arg.trim();
    } else {
      throw new Error(`Unexpected argument: ${arg}`);
    }
  }

  return options;
}

function printHelp() {
  console.log(`Usage: ${commandName} <command> [options]\n`);
  console.log(`Project creation: ${commandName} init <project-name> [options]\n`);
  console.log('Install: npm install -g @voyager163/codespec@latest');
  console.log('Run without installing: npx @voyager163/codespec init <project-name> [options]\n');
  console.log('Commands:');
  console.log('  init <project-name>   Create a new CodeSpec project');
  console.log('');
  console.log('Options:');
  console.log('  --skip-install   Create the project without running npm install');
  console.log('  --skip-git       Create the project without running git init');
  console.log('  --skip-pac-init  Create the project without checking pac or running pac code init');
  console.log('  -h, --help       Show this help message');
}

async function promptForProjectName() {
  const answer = await promptLine('Project name: ');
  return answer ? answer.trim() : '';
}

function promptLine(question) {
  if (!process.stdin.isTTY) {
    process.stdout.write(question);
    const pipedLine = readPipedPromptLine();
    return Promise.resolve(pipedLine === null ? null : pipedLine.trim());
  }

  const promptInterface = getPromptInterface();

  return new Promise((resolve) => {
    let settled = false;
    const handleClose = () => {
      activePromptInterface = null;

      if (!settled) {
        settled = true;
        resolve(null);
      }
    };

    promptInterface.once('close', handleClose);

    promptInterface.question(question, (answer) => {
      settled = true;
      promptInterface.off('close', handleClose);
      resolve(answer.trim());
    });
  });
}

function readPipedPromptLine() {
  if (!pipedPromptLines) {
    const input = fs.readFileSync(0, 'utf8');
    pipedPromptLines = input ? input.split(/\r?\n/) : [];
  }

  if (pipedPromptLines.length === 0) {
    return null;
  }

  return pipedPromptLines.shift();
}

function getPromptInterface() {
  if (!activePromptInterface) {
    activePromptInterface = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
  }

  return activePromptInterface;
}

function closePromptInterface() {
  if (activePromptInterface) {
    activePromptInterface.close();
    activePromptInterface = null;
  }
}

function validateProjectName(projectName) {
  if (!projectName) {
    throw new Error('Project name is required.');
  }

  if (projectName.includes('/') || projectName.includes('\\')) {
    throw new Error('Project name must be a folder name, not a path.');
  }

  if (projectName === '.') {
    throw new Error(`Current-folder initialization is not supported yet. Use: ${commandName} init <project-name>`);
  }

  if (projectName === '..') {
    throw new Error('Project name cannot be ...');
  }
}

class ProgressTree {
  constructor(title) {
    this.title = title;
    this.currentPhaseId = '';
    this.phases = new Map();
  }

  start(projectName) {
    console.log(this.title);
    console.log(`Creating new project: ${projectName}`);
    console.log('');
  }

  async runStep(phaseId, phaseLabel, stepLabel, task) {
    const step = this.addStep(phaseId, phaseLabel, stepLabel);

    try {
      const result = await task();
      step.status = result === 'skipped' ? 'skipped' : 'done';
      this.printStep(step);
      return result;
    } catch (error) {
      step.status = 'failed';
      this.printStep(step);
      throw error;
    }
  }

  skipStep(phaseId, phaseLabel, stepLabel) {
    const step = this.addStep(phaseId, phaseLabel, stepLabel);
    step.status = 'skipped';
    this.printStep(step);
  }

  addStep(phaseId, phaseLabel, stepLabel) {
    if (!this.phases.has(phaseId)) {
      this.phases.set(phaseId, {
        id: phaseId,
        label: phaseLabel,
        steps: [],
      });
    }

    const phase = this.phases.get(phaseId);
    if (this.currentPhaseId !== phaseId) {
      this.currentPhaseId = phaseId;
      console.log(`|-- ${phase.label}`);
    }

    const step = {
      label: stepLabel,
      status: 'pending',
    };
    phase.steps.push(step);
    return step;
  }

  printStep(step) {
    console.log(`|   |-- ${formatStepStatus(step.status)} ${step.label}`);
  }
}

function formatStepStatus(status) {
  const labels = {
    done: '[ok]',
    failed: '[fail]',
    skipped: '[skip]',
    warning: '[warn]',
    pending: '[wait]',
  };

  return labels[status] || '[wait]';
}

function checkNodeVersion() {
  const actual = process.versions.node.split('.').map((part) => Number.parseInt(part, 10));
  for (let index = 0; index < minNodeVersion.length; index += 1) {
    if (actual[index] > minNodeVersion[index]) {
      return;
    }

    if (actual[index] < minNodeVersion[index]) {
      throw new Error(`Node.js ${minNodeVersion.join('.')} or newer is required. Current version: ${process.versions.node}`);
    }
  }
}

function requireCommand(command) {
  if (!commandExists(command)) {
    throw new Error(`Required command not found: ${command}`);
  }
}

function ensurePowerPlatformCli() {
  if (commandExists('pac')) {
    return;
  }

  throw new Error('Power Platform CLI not found: pac. Install the Power Platform CLI, or rerun with --skip-pac-init to create the local project without Power Apps initialization.');
}

function commandExists(command, options = {}) {
  const result = childProcess.spawnSync(command, ['--version'], {
    env: mergeEnv(options.env),
    stdio: 'ignore',
    shell: process.platform === 'win32',
  });

  return !result.error && result.status === 0;
}

function ensureOpenSpec() {
  if (commandExists('openspec', { env: openspecTelemetryOptOutEnv })) {
    return;
  }

  console.log(`OpenSpec not found. Installing ${openspecPackage} globally...`);
  runCommand('npm', ['install', '-g', openspecPackage], { env: openspecTelemetryOptOutEnv });

  if (!commandExists('openspec', { env: openspecTelemetryOptOutEnv })) {
    throw new Error(`OpenSpec installation finished but openspec is still unavailable. Try manually running: npm install -g ${openspecPackage}`);
  }
}

function ensureTargetAvailable(targetPath) {
  if (fs.existsSync(targetPath)) {
    throw new Error(`Target folder already exists: ${targetPath}`);
  }
}

function copyStarter(templateRoot, targetPath, projectName) {
  const starterPath = path.join(templateRoot, 'starter');
  assertDirectory(starterPath, 'Starter template is missing.');

  fs.cpSync(starterPath, targetPath, {
    recursive: true,
    force: false,
    errorOnExist: true,
  });

  updatePackageName(targetPath, projectName);
}

function updatePackageName(targetPath, projectName) {
  const packagePath = path.join(targetPath, 'package.json');
  if (!fs.existsSync(packagePath)) {
    return;
  }

  const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  packageJson.name = normalizePackageName(projectName);
  fs.writeFileSync(packagePath, `${JSON.stringify(packageJson, null, 2)}${os.EOL}`);
}

function normalizePackageName(projectName) {
  const normalized = projectName
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, '-')
    .replace(/^[._-]+/, '')
    .replace(/[._-]+$/, '')
    .replace(/-{2,}/g, '-');

  return normalized || 'codespec-app';
}

function copyGithubOverlay(templateRoot, targetPath) {
  const githubTemplatePath = path.join(templateRoot, 'github');
  assertDirectory(githubTemplatePath, 'GitHub OpenSpec template overlay is missing.');

  const targetGithubPath = path.join(targetPath, '.github');
  fs.mkdirSync(targetGithubPath, { recursive: true });
  fs.cpSync(githubTemplatePath, targetGithubPath, {
    recursive: true,
    force: true,
  });
}

function installDependencies(targetPath, options) {
  if (options.skipInstall) {
    return 'skipped';
  }

  runCommand('npm', ['install'], { cwd: targetPath });
}

function setupOpenSpec(targetPath) {
  const openspecPath = path.join(targetPath, 'openspec');
  if (fs.existsSync(openspecPath)) {
    runCommand('openspec', ['update', '--force'], { cwd: targetPath, env: openspecTelemetryOptOutEnv });
    return;
  }

  runCommand('openspec', ['init', '--tools', 'github-copilot', '--force'], { cwd: targetPath, env: openspecTelemetryOptOutEnv });
}

function applyOpenSpecConfig(templateRoot, targetPath) {
  const configTemplatePath = path.join(templateRoot, 'openspec', 'config.yaml');
  const targetConfigPath = path.join(targetPath, 'openspec', 'config.yaml');
  assertFile(configTemplatePath, 'OpenSpec config template is missing.');

  fs.mkdirSync(path.dirname(targetConfigPath), { recursive: true });
  fs.copyFileSync(configTemplatePath, targetConfigPath);
}

function initializeGit(targetPath, options) {
  if (options.skipGit) {
    return 'skipped';
  }

  runCommand('git', ['init'], { cwd: targetPath });
}

async function initializePowerAppsCodeApp(targetPath, progress) {
  const prepared = await progress.runStep('power-apps', 'Initialize Power Apps Code App', 'Prepare Power Apps values', () => promptForPowerAppsPreparation());
  if (prepared === 'skipped') {
    progress.skipStep('power-apps', 'Initialize Power Apps Code App', 'Prompt environment ID');
    progress.skipStep('power-apps', 'Initialize Power Apps Code App', 'Prompt app display name');
    progress.skipStep('power-apps', 'Initialize Power Apps Code App', 'Confirm pac code init');
    progress.skipStep('power-apps', 'Initialize Power Apps Code App', 'Run pac code init');
    return 'skipped';
  }

  const environmentId = await progress.runStep('power-apps', 'Initialize Power Apps Code App', 'Prompt environment ID', () => promptRequiredValue('Power Platform environment ID'));
  const appDisplayName = await progress.runStep('power-apps', 'Initialize Power Apps Code App', 'Prompt app display name', () => promptRequiredValue('App display name'));
  const commandText = formatPacCodeInitCommand(environmentId, appDisplayName);
  const confirmed = await progress.runStep('power-apps', 'Initialize Power Apps Code App', 'Confirm pac code init', () => promptForCommandConfirmation(commandText));

  if (confirmed === 'skipped') {
    progress.skipStep('power-apps', 'Initialize Power Apps Code App', 'Run pac code init');
    return 'skipped';
  }

  await progress.runStep('power-apps', 'Initialize Power Apps Code App', 'Run pac code init', () => runPacCodeInit(targetPath, environmentId, appDisplayName, commandText));
  return 'initialized';
}

async function promptForPowerAppsPreparation() {
  console.log('');
  console.log('Power Apps Code App setup');
  console.log('You will need two values before continuing:');
  console.log('1. Power Platform environment ID');
  console.log('2. App display name');
  console.log('');
  console.log('Find those now in Power Platform admin center or with `pac org list`.');
  const answer = await promptLine('Press Enter when you have them, or type "skip" to do this later: ');

  if (answer === null) {
    throw new Error('Power Apps initialization needs input. Rerun with --skip-pac-init to create the local project without running pac code init.');
  }

  if (answer.trim().toLowerCase() === 'skip') {
    return 'skipped';
  }

  return 'ready';
}

async function promptRequiredValue(label) {
  while (true) {
    const answer = await promptLine(`${label}: `);

    if (answer === null) {
      throw new Error(`${label} is required. Rerun with --skip-pac-init to create the local project without running pac code init.`);
    }

    if (answer) {
      return answer;
    }

    console.log(`${label} is required.`);
  }
}

async function promptForCommandConfirmation(commandText) {
  console.log('');
  console.log('Run this command?');
  console.log(commandText);
  console.log('');

  while (true) {
    const answer = await promptLine('Continue? Y/n: ');

    if (answer === null) {
      throw new Error('Power Apps initialization needs confirmation. Rerun with --skip-pac-init to create the local project without running pac code init.');
    }

    const normalized = answer.trim().toLowerCase();
    if (!normalized || normalized === 'y' || normalized === 'yes') {
      return 'confirmed';
    }

    if (normalized === 'n' || normalized === 'no' || normalized === 'skip') {
      return 'skipped';
    }

    console.log('Please answer y or n.');
  }
}

function runPacCodeInit(targetPath, environmentId, appDisplayName, commandText) {
  try {
    runCommand('pac', ['code', 'init', '--environment', environmentId, '--displayName', appDisplayName], { cwd: targetPath });
  } catch (error) {
    console.error('');
    console.error('Power Apps initialization failed. You can retry manually:');
    console.error(commandText);
    throw error;
  }
}

function formatPacCodeInitCommand(environmentId, appDisplayName) {
  return `pac code init --environment ${shellQuote(environmentId)} --displayName ${shellQuote(appDisplayName)}`;
}

function shellQuote(value) {
  if (/^[A-Za-z0-9_./:=@-]+$/.test(value)) {
    return value;
  }

  return `"${value.replace(/["\\$`]/g, '\\$&')}"`;
}

function runCommand(command, args, options = {}) {
  const result = childProcess.spawnSync(command, args, {
    cwd: options.cwd || process.cwd(),
    env: mergeEnv(options.env),
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

function mergeEnv(env) {
  return env ? { ...process.env, ...env } : process.env;
}

function assertDirectory(directoryPath, message) {
  if (!fs.existsSync(directoryPath) || !fs.statSync(directoryPath).isDirectory()) {
    throw new Error(message);
  }
}

function assertFile(filePath, message) {
  if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
    throw new Error(message);
  }
}

function printNextSteps(projectName, powerAppsInitStatus) {
  console.log('');
  console.log('Project ready.');
  console.log('');
  console.log('Next steps');
  console.log(`1. cd ${projectName}`);
  console.log('2. code .');

  if (powerAppsInitStatus === 'initialized') {
    console.log('3. Use /opsx:explore, /opsx:propose, and /opsx:apply with GitHub Copilot');
    console.log('4. npm run dev');
    return;
  }

  console.log('3. pac code init --environment <environmentId> --displayName <appDisplayName>');
  console.log('4. Use /opsx:explore, /opsx:propose, and /opsx:apply with GitHub Copilot');
  console.log('5. npm run dev');
}

main().catch((error) => {
  closePromptInterface();
  console.error('');
  console.error(error.message);
  process.exitCode = 1;
});