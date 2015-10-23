var fs = require('fs');
var glob = require('glob');
var Parse = require('parse/node').Parse;

Parse.initialize(
    "p1TaGRy0v3CPYkAG1lbRSn0RaUnFpWOFrlGL6FsD",
    "ZfzqREum4VAvKo2c1g5gNP3IdCCuRpUA0xq3YLM5");

var createRecipeFromFile = function(filename) {
  var file = require('./' + filename);
  var base64 = fs.readFileSync('samples/' + file.image, {encoding: 'base64'});
  var image = new Parse.File(file.image, {base64: base64});
  image.save().then(function() {
    console.log(file.name);
    var recipe = new Parse.Object('Recipe');
    recipe.set('name', file.name);
    recipe.set('author', file.author);
    recipe.set('description', file.description);
    recipe.set('ingredients', JSON.stringify(file.ingredients));
    recipe.set('actions', JSON.stringify(file.actions));
    recipe.set('time', JSON.stringify(file.time));
    recipe.set('image', image);
    recipe.set('uuid', file.uuid);
    recipe.save();
  });
};

glob('samples/*.json', function(er, filenames) {
  for (var i = 0; i < filenames.length; i++) {
    try {
      createRecipeFromFile(filenames[i]);
    } catch (er) {
      console.log(er);
    }
  }
});
