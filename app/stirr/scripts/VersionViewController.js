angular
  .module('stirr')
  .controller('VersionViewController', function($scope, Recipe, supersonic) {

    $scope.recipes = null;
    $scope.showSpinner = true;

    var _getRecipes = function() {
      $scope.showSpinner = true;
      Recipe.findAll().then(function(recipes) {
        $scope.$apply(function() {
          $scope.recipes = recipes.filter(function(recipe) {
            return recipe.parentId === steroids.view.params.parentId;
          });
          $scope.showSpinner = false;
        });
      });
    };

    supersonic.ui.views.current.whenVisible(_getRecipes);

    var _back = function() {
      supersonic.ui.modal.hide();
    };

    var _backButton = new supersonic.ui.NavigationBarButton({
      styleId: 'back-button',
      onTap: _back
    });

    supersonic.ui.navigationBar.update({
      title: 'stirr',
      overrideBackButton: false,
      buttons: {
        left: [_backButton]
      }
    }).then(supersonic.ui.navigationBar.show());
  });
