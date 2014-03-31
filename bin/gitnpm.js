#!/usr/bin/env node

var path = require('path');
var fs = require("fs");
var child_process = require("child_process");

var optimist = require('optimist');
var _ = require('lodash');
var yaml = require('yamljs');
var osenv = require('osenv');

var giturl = "<%=protocol%>://git@<%=hostname%>:<%=library%>.git#<%=version%>";

var argv = optimist
.usage('Usage :\n' +
       'gitnpm setup --protocol [string] --hostname [string]\n' +
       'OR\n' +
       'gitnpm install [library] [version(default : master)]\n'
)
.default('protocol', 'git+ssh')
.default('hostname', 'github.com')
.argv;

if (!argv._[0]) {
  optimist.showHelp(console.error);
  return;
};

// set subcommand
if (argv._[0] !== "setup" &&
    argv._[0] !== "install" &&
    argv._[0] !== "i" &&
    argv._[0] !== "isntall") {
  optimist.showHelp(console.error);
  return;
}


var subcommand = argv._[0] === "setup" ? "setup" : "install";

var homeConfig = path.join(osenv.home(), '.gnpmrc');

// install
// set library and version
if (subcommand === "install") {
  var gnpmrc = {};
  gnpmrc.protocol = argv.protocol;
  gnpmrc.hostname = argv.hostname;
  if (fs.existsSync(homeConfig)) {
    var temp = JSON.parse(fs.readFileSync(homeConfig, 'utf-8'));
    gnpmrc.protocol = temp.protocol || gnpmrc.protocol;
    gnpmrc.hostname = temp.hostname || gnpmrc.hostname;
  }
  if (!argv._[1]) {
    optimist.showHelp(console.error);
    return;
  }
  var library = argv._[1];
  var version = argv._[2] ? argv._[2] : "master";
  gnpmrc.library = library;
  gnpmrc.version = version;
  giturl = _.template(giturl, gnpmrc);
  var npmargv = process.argv;
  // clear node $0 install
  npmargv.splice(0, 3);
  npmargv.splice(npmargv.indexOf(library), 1);
  if (npmargv.indexOf(version) >= 0) npmargv.splice(npmargv.indexOf(version), 1);
  npmargv.unshift(giturl);
  npmargv.unshift("install");

  var npmproc = child_process.spawn("npm", npmargv, {
    stdio: ["ignore", process.stdout, process.stderr]
  });
}

// setup
// config from $HOME/.gnpmrc
if (subcommand === "setup") {
  if (argv._[1]) {
    optimist.showHelp(console.error);
    return;
  }
  fs.writeFileSync(homeConfig, JSON.stringify({
    protocol : argv.protocol,
    hostname : argv.hostname,
  }, null, "  "));
  console.log("created! : " + homeConfig);
}
