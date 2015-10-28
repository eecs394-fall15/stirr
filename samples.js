var fs = require('fs');
var glob = require('glob');
var Parse = require('parse/node').Parse;

Parse.initialize(
    "p1TaGRy0v3CPYkAG1lbRSn0RaUnFpWOFrlGL6FsD",
    "ZfzqREum4VAvKo2c1g5gNP3IdCCuRpUA0xq3YLM5");

var count = 0;
var filenameFileRecipe = {};

var createRecipeFromFile = function(filename) {
  var file = require('./' + filename);
  var base64 = fs.readFileSync('samples/' + file.image, {encoding: 'base64'});
  var image = new Parse.File(file.image, {base64: base64});
  image.save().then(function() {
    var recipe = new Parse.Object('Recipe');
    recipe.set('name', file.name);
    recipe.set('author', file.author);
    recipe.set('description', file.description);
    recipe.set('ingredients', JSON.stringify(file.ingredients));
    recipe.set('actions', JSON.stringify(file.actions));
    recipe.set('time', JSON.stringify(file.time));
    recipe.set('image', image);
    recipe.set('uuid', file.uuid);
    recipe.save().then(function() {
      filenameFileRecipe[filename] = {
        file: file,
        recipe: recipe
      };
      console.log('Finished uploading ' + file.name);
      count += 1;
    });
  });
};

var addParentToRecipe = function(fileRecipe) {
  var parentFilename = fileRecipe.file.parentFilename;
  if (parentFilename) {
    var parentFileRecipe = filenameFileRecipe['samples/' + parentFilename];
    fileRecipe.recipe.set('parentId', parentFileRecipe.recipe.get('objectId'));
    fileRecipe.recipe.save().then(function() {
      console.log(fileRecipe.file.name + ' is now a child of ' +
                  parentFileRecipe.file.name);
    });
  }
}

glob('samples/*.json', function(er, filenames) {
  for (var i = 0; i < filenames.length; i++) {
    createRecipeFromFile(filenames[i]);
  }
  var wait = function() {
    if (count !== filenames.length) {
      setTimeout(wait, 1000);
    } else {
      console.log(filenameFileRecipe)
      for (filename in filenameFileRecipe) {
        addParentToRecipe(filenameFileRecipe[filename]);
      }
    }
  }
  wait();
});
