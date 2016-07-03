Package.describe({
  name: 'meteoric124:router-adapter',
  version: '0.1.0-beta.1',
  // Brief, one-line summary of the package.
  summary: 'Router adapter enables router agnostic meteor packages.',
  // URL to the Git repository containing the source code for this package.
  git: 'https://github.com/meteoric124/router-adapter.git',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.3.4.1');
  api.use([
    'ecmascript',
    'underscore'
  ]);

  api.addFiles([
    'src/sanity-check.js'
  ]);

  api.mainModule('src/router-adapter.js', 'client');
});

Package.onTest(function(api) {
  api.use([
    'ecmascript',
    'underscore',
    'tracker',

    'sanjo:jasmine@1.0.1',
    'velocity:html-reporter',

    'iron:router@1.0.0',
    'kadira:flow-router@2.12.1'
  ]);
  api.use('meteoric124:router-adapter', 'client');
  api.addFiles([
    'tests/router-adapter.iron.test.js',
    'tests/router-adapter.flow.test.js'
  ], 'client');
});
