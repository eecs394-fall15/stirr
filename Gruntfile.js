/*

Default Gruntfile for AppGyver Steroids
http://www.appgyver.com
Licensed under the MIT license.

*/

module.exports = function(grunt) {
  grunt.loadNpmTasks("grunt-jscs");
  grunt.loadNpmTasks("grunt-contrib-jshint")
  grunt.loadNpmTasks("grunt-steroids");
  grunt.registerTask("default", [
    "steroids-make-fresh"
  ]);

  grunt.registerTask("lint", [
    "jshint",
    "jscs",
  ]);

  grunt.initConfig({
    jscs: {
      options: {
        config: ".jscsrc",
        verbose: true
      },
      src: ["app/**/*.js"]
    },
    jshint: {
      options: {
        jshintrc: ".jshintrc"
      },
      src: ["app/**/*.js"]
    },
  });
}
