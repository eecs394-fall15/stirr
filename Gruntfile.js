/*

Default Gruntfile for AppGyver Steroids
http://www.appgyver.com
Licensed under the MIT license.

*/

module.exports = function(grunt) {
  grunt.loadNpmTasks("grunt-steroids");
  grunt.loadNpmTasks("grunt-contrib-jshint")
  grunt.registerTask("default", [
    "jshint",
    "steroids-make-fresh"
  ]);
  grunt.initConfig({
    jshint: {
        options: {
            jshintrc: ".jshintrc"
        },
        src: ["app/**/*.js"]
    }
  });
}
