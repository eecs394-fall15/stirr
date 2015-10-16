angular
  .module('stirr')
  .controller('ViewController', function($scope, Recipe, supersonic) {
    $scope.recipe = null;
    $scope.showSpinner = true;
    $scope.dataId = undefined;

    var _back = function() {
      supersonic.ui.layers.pop();
    };

    var _backButton = new supersonic.ui.NavigationBarButton({
      styleId: 'back-button',
      onTap: _back
    });

    var _edit = function() {
      var view = new supersonic.ui.View('stirr#edit');
      supersonic.ui.layers.push(view, {
        params: {
          id: $scope.recipe.id
        }
      });
    };

    var _editButton = new supersonic.ui.NavigationBarButton({
      styleId: 'edit-button',
      onTap: _edit
    });

    var _options = {
      title: 'stirr',
      overrideBackButton: true,
      buttons: {
        left: [_backButton],
        right: [_editButton]
      }
    };

    supersonic.ui.navigationBar.update(_options);

    var _getRecipe = function() {
      Recipe.find(steroids.view.params.id).then(
      function(recipe) {
        $scope.$apply(function($scope) {
          $scope.recipe = recipe;

          if ($scope.recipe.image) {
            $scope.name = $scope.recipe.image.name;
            $scope.url = $scope.recipe.image.url;
          }

          // Parse string json into in json object
          $scope.ingredients =
              JSON.parse($scope.recipe.ingredients || '[]');
          $scope.actions = JSON.parse($scope.recipe.actions || '[]');
          $scope.time = JSON.parse($scope.recipe.time || '{}');

          $scope.showSpinner = false;
        });
        $scope.changed = false;
      },
      function(errorMsg) {
        $scope.showSpinner = false;
        $scope.errorMsg = errorMsg;
      })
    };

    supersonic.ui.views.current.whenVisible(_getRecipe);

  });
