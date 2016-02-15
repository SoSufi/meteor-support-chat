Package.describe({
  name: 'ralof:support-chat',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: '',
  // URL to the Git repository containing the source code for this package.
  git: '',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.2.1');
  api.use('ecmascript');
  api.use(["templating", "underscore", "mongo", "session", "tracker"]);
  api.use('alanning:roles@1.2.14');
  api.use('momentjs:moment');
  api.use('mizzao:user-status@0.6.6');

  //api.use(["iron:router@1.0.7"], 'client', {weak: false, unordered: false});

  api.addFiles('support-chat.js');
  api.addFiles('templates.html', 'client');
  api.addFiles('theStyles.css', 'client');
  api.addFiles('clientstuff.js', 'client');
  api.addFiles('serverstuff.js', 'server');
  api.export(['SupportChatMessages', 'SupportChatChannels', "SupportChat"]);
});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('ralof:support-chat');
  api.addFiles('support-chat-tests.js');
});
