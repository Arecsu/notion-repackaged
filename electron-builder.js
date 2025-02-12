function ensureEnvVar(envVarName) {
  if (!(envVarName in process.env)) {
    throw new Error(`Missing environment variable ${envVarName}`);
  }

  return process.env[envVarName];
}

const editionEnvVar = ensureEnvVar('NOTION_REPACKAGED_EDITION'),
  versionEnvVar = ensureEnvVar('NOTION_VERSION'),
  revisionEnvVar = ensureEnvVar('NOTION_REPACKAGED_REVISION');

const isVanilla = editionEnvVar === 'vanilla';

const productName = isVanilla ? 'Notion' : 'Notion Enhanced',
  productId = isVanilla ? 'notion-app' : 'notion-app-enhanced',
  conflictProductId = !isVanilla ? 'notion-app' : 'notion-app-enhanced',
  productDescription =
    editionEnvVar === 'vanilla'
      ? 'The all-in-one workspace for your notes and tasks'
      : 'The all-in-one workspace for your notes and tasks, but enhanced';

const fpmOptions = [
  `--version=${versionEnvVar}`,
  `--iteration=${revisionEnvVar}`,
  `--conflicts=${conflictProductId}`,
];

module.exports = {
  asar: editionEnvVar === 'vanilla',
  productName: productName,
  extraMetadata: {
    description: productDescription,
  },
  appId: 'com.github.notion-repackaged',
  protocols: [{ name: 'Notion', schemes: ['notion'] }],
  win: {
    icon: 'icon.ico',
    target: ['nsis', 'zip'],
  },
  nsis: {
    installerIcon: 'icon.ico',
    oneClick: false,
    perMachine: false,
  },
  mac: {
    icon: 'icon.icns',
    category: 'public.app-category.productivity',
    target: [
      {
        target: 'dmg',
        arch: ['x64', 'arm64'],
      },
      {
        target: 'zip',
        arch: ['x64', 'arm64'],
      },
    ],
  },
  linux: {
    icon: 'icon.icns',
    category: 'Office;Utility;',
    maintainer: 'jaime@jamezrin.name',
    mimeTypes: ['x-scheme-handler/notion'],
    desktop: {
      StartupNotify: 'true',
      StartupWMClass: productId,
    },
    target: ['AppImage', 'deb', 'rpm', 'pacman', 'zip'],
  },
  deb: { fpm: fpmOptions },
  pacman: { fpm: fpmOptions },
  rpm: { fpm: fpmOptions },
  publish: ['github'],
};
