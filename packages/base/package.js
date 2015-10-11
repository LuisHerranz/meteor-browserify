Package.describe({
  name: 'browserify:base',
  version: '1.0.0',
  summary: 'Basic package for the Meteor Browserify project.',
  git: '',
  documentation: null
});

Package.onUse(function(api) {
  api.versionsFrom('1.2');
  api.addFiles('base.js');
  api.export('Browserify');
});
