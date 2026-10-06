// Postinstall fix for Keystatic bug Thinkmill/keystatic#1626: creating a new
// entry in a tab opened before another commit landed on main shows the
// "New branch… / entry has been updated" dialog, because useUpsertItem compares
// the fresh tree key against currentLocalTreeKey, which is undefined for creates.
// Replaces patch-package, whose dependency chain pulls in an unpatched `braces`.
import { readFileSync, writeFileSync } from 'node:fs';

const VERSION = '0.5.50';
const pkgDir = 'node_modules/@keystatic/core';
const file = `${pkgDir}/dist/keystatic-core-ui.js`;

const from = 'if (treeKey === args.currentLocalTreeKey) {';
const to =
  'if (treeKey === (args.currentLocalTreeKey !== undefined ? args.currentLocalTreeKey : getTreeKey(getDirectoriesForTreeKey(object(args.schema), args.basePath, (_args$slug3 = args.slug) === null || _args$slug3 === void 0 ? void 0 : _args$slug3.value, args.format), new Map()))) {';

const { version } = JSON.parse(readFileSync(`${pkgDir}/package.json`, 'utf8'));
if (version !== VERSION) {
  throw new Error(
    `patch-keystatic: expected @keystatic/core ${VERSION}, found ${version}. ` +
      'Check whether #1626 is fixed upstream, then update or remove this script.'
  );
}

const src = readFileSync(file, 'utf8');
if (src.includes(to)) {
  console.log('patch-keystatic: already applied');
} else if (src.split(from).length === 2) {
  writeFileSync(file, src.replace(from, to));
  console.log('patch-keystatic: applied');
} else {
  throw new Error(`patch-keystatic: target line not found exactly once in ${file}`);
}
