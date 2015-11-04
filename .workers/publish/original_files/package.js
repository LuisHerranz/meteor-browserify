Package.describe({
  name: 'browserify:PACKAGENAME',
  version: 'PACKAGEVERSION',
  summary: 'Browserify package for the npm package \'PACKAGENAME\'',
  git: 'PACKAGEGIT',
  documentation: null
});

Npm.depends({
  'PACKAGENAME':'PACKAGEVERSION'
});

Package.onUse(function(api) {
  api.versionsFrom('1.2');
  api.use('browserify:base@1.0.0', 'client');
  api.use('cosmos:browserify@0.8.3', 'client');
  api.addFiles('client.browserify.js', 'client');
  api.imply('browserify:base', 'client');
});
