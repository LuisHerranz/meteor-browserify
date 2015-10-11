
let resetState = function() {
  AppState.set('checkingNpm', false);
  AppState.set('npmPackage', false);
  AppState.set('meteorPackage', false);
  AppState.set('bothPackages', false);
  AppState.set('packageStatus', false);
};
resetState();

let checkNpm = function(err, res) {
  if (err) {
    console.log(err);
  } else {
    if (res.result) {
      Dispatcher.dispatch('CHECK-METEOR-PACKAGE', res.result);
    } else {
      Dispatcher.dispatch('NPM-PACKAGE-NOT-FOUND');
    }

  }
};

let checkFastosphere = function(name) {
  client = AlgoliaSearch(
    Meteor.settings.public.algoliaApplicationId,
    Meteor.settings.public.algoliaPublicId,
    { dsn: true }
  );
  index = client.initIndex('Packages');
  index.search('browserify:' + name,
    { hitsPerPage: Session.get('hitsPerPage') },
    function (error, content) {
      if(error) {
        return console.error('Error during Algolia search: ', error);
      } else {
        if (content.hits && content.hits.length > 0) {
          Dispatcher.dispatch('METEOR-PACKAGE-FOUND', {
            name: content.hits[0].name,
            lastVersion: content.hits[0].version
          });
        } else {
          Dispatcher.dispatch('METEOR-PACKAGE-NOT-FOUND');
        }
      }
    });
};

let checkBothPackages = function() {
  let npmVersion = AppState.get('npmPackage.lastVersion');
  let meteorVersion = AppState.get('meteorPackage.lastVersion');
  if (npmVersion === meteorVersion) {
    AppState.set('bothPackages.equal', true);
  } else {
    AppState.set('bothPackages.different', true);
  }
};

let publishMeteorPackage = function(action) {
  let name = AppState.get('npmPackage.name');
  let version = AppState.get('npmPackage.lastVersion');
  let git = AppState.get('npmPackage.git');
  Meteor.subscribe('packages', name);
  Meteor.call('publishMeteorPackage', { name, version, git, action });
  AppState.set('packageStatus', function(){
    return Packages.findOne({ name });
  });
};

Dispatcher.register(function(action){
  console.log(action);
  switch (action.type) {
    case 'CHECK-NPM-PACKAGE':
      resetState();
      AppState.set('checkingNpm', true);
      let npmpackage = action.event.currentTarget.package.value;
      Meteor.call('checkNpm', npmpackage, checkNpm);
      break;
    case 'CHECK-METEOR-PACKAGE':
      AppState.set('checkingNpm', false);
      AppState.set('npmPackage', _.omit(action, 'type'));
      AppState.set('npmPackage.found', true);
      checkFastosphere(action.name, action.version);
      break;
    case 'NPM-PACKAGE-NOT-FOUND':
      AppState.set('checkingNpm', false);
      AppState.set('npmPackage.notFound', true);
      break;
    case 'METEOR-PACKAGE-FOUND':
      AppState.set('meteorPackage', _.omit(action, 'type'));
      AppState.set('meteorPackage.found', true);
      checkBothPackages();
      break;
    case 'METEOR-PACKAGE-NOT-FOUND':
      AppState.set('meteorPackage.notFound', true);
      break;
    case 'PUBLISH-METEOR-PACKAGE':
      publishMeteorPackage(action.task);
      break;
    default:
  }
});
