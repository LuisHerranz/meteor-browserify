Meteor.methods({
  checkNpm(npmpackage) {
    var semver = Meteor.npmRequire('semver');
    var RegClient = Meteor.npmRequire('npm-registry-client');
    var client = new RegClient();
    var uri = "https://registry.npmjs.org/" + npmpackage;
    var params = {timeout: 10000};

    return Async.runSync(function(done) {
      client.get(uri, params, function (error, data) {
        if (data && data.versions) {
          let name = data.name;
          let git = data.homepage;
          let versions = _.keys(data.versions);
          versions.sort((a,b) => semver.gt(a, b));
          lastVersion = _.last(versions);
          let result = {
            name,
            lastVersion,
            git
          };
          done(null, result);
        } else {
          done(null, false);
        }
      });
    });
  },
  publishMeteorPackage(payload) {
    Packages.upsert({ name: payload.name }, { $set: { status: '' } });
    var url = Meteor.settings.private.publishPackageUrl;
    HTTP.post(url, { data: payload });
  }
});


Meteor.publish('packages', function(name){
  return Packages.findOne({ name });
});
