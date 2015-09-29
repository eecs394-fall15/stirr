angular
  .module('stirr')
  .controller('EditController', function($scope, Recipe, supersonic) {
    $scope.recipe = null;
    $scope.showSpinner = true;

    var _back = function() {
      if ($scope.recipe) {
        $scope.showSpinner = true;
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
        $scope.showSpinner = false;
      });
    });

  });
