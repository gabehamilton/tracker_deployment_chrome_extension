var gulp = require('gulp');
var execSync = require('child_process').execSync;
var fs = require("fs");


gulp.task('commits', function (cb) {
  writeCommits('dev'); // or process.env.NODE_ENV
});

var writeCommits = function(environment) {
  var raw_commit_data = String(execSync('git --no-pager log --pretty=oneline --since=30.days'));
  var commit_data = raw_commit_data.split(/\r?\n/);

  var git_json = {};

  for(var i in commit_data) {
    var line = commit_data[i];
    var sha = line.split(" ")[0];

    var story_ids = line.match(/(?:Finishes|Fixes)\s?\#([0-9]+)/g);
    var story_id = null;

    if (story_ids && story_ids.length) {
      for (i = 0; i < story_ids.length; i++) {
        story_id = story_ids[i].replace(/(?:Finishes|Fixes)\s?\#/g, '');
        git_json[story_id] = git_json[story_id] || new Array();

        git_json[story_id].push(sha);
      }
    }
  }

  var path = "./public/commits.json"
  fs.writeFile(path, JSON.stringify(git_json, null, 2), function(err) {
    if(err) {
      return console.log(err);
    }

    console.log("Wrote story numbers to " + path);
  });
}
