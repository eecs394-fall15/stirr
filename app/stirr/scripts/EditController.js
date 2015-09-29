angular
  .module('stirr')
  .controller('EditController', function($scope, Recipe, supersonic) {
    $scope.recipe = null;
    $scope.showSpinner = true;

    var _back = function() {
      if ($scope.recipe) {
        $scope.showSpinner = true;

        // check for empty ingredients and steps
        $scope.recipe.ingredients = checkEmpty($scope.recipe.ingredients,
                                               'name');
        $scope.recipe.actions = checkEmpty($scope.recipe.actions,
                                            'step');

        // convert recipe JSON into strings
        $scope.recipe.ingredients = JSON.stringify($scope.recipe.ingredients);
        $scope.recipe.actions = JSON.stringify($scope.recipe.actions);
        $scope.recipe.time = JSON.stringify($scope.recipe.time);

        $scope.recipe.save().then(function() {
          $scope.showSpinner = false;
          supersonic.ui.layers.pop();
        });
      }
    };

    var _backButton = new supersonic.ui.NavigationBarButton({
      title: 'Back',
      onTap: _back
    });

    var _options = {
      title: 'stirr',
      overrideBackButton: true,
      buttons: {
        left: [_backButton]
      }
    };

    supersonic.ui.navigationBar.update(_options);

    // Fetch an object based on id from the database
    Recipe.find(steroids.view.params.id).then(function(recipe) {
      $scope.$apply(function() {
        $scope.recipe = recipe;

        // Parse string json into in json object
        $scope.recipe.ingredients = JSON.parse($scope.recipe.ingredients);
        $scope.recipe.actions = JSON.parse($scope.recipe.actions);
        $scope.recipe.time = JSON.parse($scope.recipe.time);

        $scope.showSpinner = false;
      });
    });

    $scope.addIngredient = function() {
      $scope.recipe.ingredients = $scope.recipe.ingredients.
                                    concat({'name': '', 'quantity': ''});
      $scope.apply();
    };

    $scope.addAction = function() {
      $scope.recipe.actions = $scope.recipe.actions.concat({'step': ''});
      $scope.apply();
    };

    var checkEmpty = function(objArray, key) {
      var outputArray = [];
      for (var i in objArray) {
        if (objArray[i][key] !== '') {
          outputArray = outputArray.concat(objArray[i]);
        }
      }
      return (outputArray);
    };

  });
