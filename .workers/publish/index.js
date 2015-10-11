var express = require('express');
var app = express();
var execSync = require('child_process').execSync;
var fs = require('fs');
var http = require('http');
var bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

var log = function(req, message, text) {
  var name = req.body.name;
  var version = req.body.version;
  var path = '/package-status/' + name + '/' + version + '/' + text;
  console.log(path);
  console.log(message);
  http.request({
    host: 'browserify.meteor.com',
    path: path}).end();
};

app.post('/publish-package', function (req, res) {
  var name = req.body.name;
  var version = req.body.version;
  var git = req.body.git;


  // Login in Meteor.
  log(req, "Trying to log in...", "started-publication");
  var buffer = execSync('./login.exp');
  // if (buffer.toString() !== 'Logged in successfully!')
    // return log(req, "Can't login." + buffer.toString(), "cant-login-meteor");
  // else
    // log(req, "Logged in successfully.", "logged-in-meteor");

  // log(req, "Modifying client.browserify.js...", "modified-files");
  var browserifyFile = fs.readFileSync(
    'original_files/client.browserify.js', 'utf8');
  var result = browserifyFile.replace(/PACKAGENAME/g, name);
  fs.writeFileSync('packages/browserify_package/client.browserify.js', result);

  var readmeFile = fs.readFileSync(
    'original_files/README.md', 'utf8');
  result = readmeFile.replace(/PACKAGENAME/g, name);
  result = result.replace(/PACKAGEVERSION/g, version);
  result = result.replace(/PACKAGEGIT/g, git);
  fs.writeFileSync('packages/browserify_package/README.md', result);

  var packageFile = fs.readFileSync(
    'original_files/package.js', 'utf8');
  result = packageFile.replace(/PACKAGENAME/g, name);
  result = result.replace(/PACKAGEVERSION/g, version);
  result = result.replace(/PACKAGEGIT/g, git);
  fs.writeFileSync('packages/browserify_package/package.js', result);
  // log(req, "Modification succesful.", "files-modified");

  // log(req, "Publishing package...", "publishing-package");
  var create = (req.body.action === 'create') ? '--create' : '';
  execSync('cd packages/browserify_package && ' +
    ' meteor publish ' + create);
  log(req, "Package published.", "package-published");

  res.send('ok');
});

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
