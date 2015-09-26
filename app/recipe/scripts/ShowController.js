angular
  .module('recipe')
  .controller("ShowController", function ($scope, Recipe, supersonic) {
    $scope.recipe = null;
    $scope.showSpinner = true;
    $scope.dataId = undefined;

    var _refreshViewData = function () {
      Recipe.find($scope.dataId).then( function (recipe) {
        $scope.$apply( function () {
          $scope.recipe = recipe;
          $scope.showSpinner = false;
        });
      });
    }

    supersonic.ui.views.current.whenVisible( function () {
      if ( $scope.dataId ) {
        _refreshViewData();
      }
    });

    supersonic.ui.views.current.params.onValue( function (values) {
      $scope.dataId = values.id;
      _refreshViewData();
    });

    $scope.remove = function (id) {
      $scope.showSpinner = true;
      $scope.recipe.delete().then( function () {
        supersonic.ui.layers.pop();
      });
    }
  });