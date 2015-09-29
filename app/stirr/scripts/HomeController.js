angular
  .module('stirr')
  .controller('HomeController', function($scope, Recipe, supersonic) {

    $scope.recipes = null;
    $scope.showSpinner = true;

    Recipe.all().whenChanged(function(recipes) {
      $scope.$apply(function() {
        $scope.recipes = recipes;
        $scope.showSpinner = false;
      });
    });

    $scope.newRecipe = function() {
      var recipe = new Recipe({});
      recipe.save().then(function() {
        var view = new supersonic.ui.View('stirr#edit');
        supersonic.ui.layers.push(view, {
          params: {
            id: recipe.id
          }
        });
      });
    };
  });
