Package.describe({
  name: 'browserify:semver',
  version: '5.0.3',
  summary: 'Browserify package for the npm package \'semver\'',
  git: 'https://github.com/npm/node-semver',
  documentation: null
});

Npm.depends({
  'semver':'5.0.3'
});

Package.onUse(function(api) {
  api.versionsFrom('1.2');
  api.use('browserify:base@1.0.0', 'client');
  api.use('cosmos:browserify@0.8.0', 'client');
  api.addFiles('client.browserify.js', 'client');
  api.imply('browserify:base', 'client');
});
