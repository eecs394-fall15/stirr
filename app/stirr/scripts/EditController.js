angular
  .module('stirr')
  .controller('EditController', function($scope, Recipe, supersonic) {
    $scope.recipe = null;
    $scope.showSpinner = true;
    $scope.hello = "hello";

    supersonic.ui.views.current.whenVisible(function() {
      _refreshViewData();
    });

    var _refreshViewData = function() {
      // Fetch an object based on id from the database
      Recipe.find(steroids.view.params.id).then(function(recipe) {
        $scope.$apply(function() {
          $scope.recipe = recipe;
          $scope.showSpinner = false;
        });
      });
    };

    _refreshViewData();

    $scope.submitForm = function() {
      $scope.showSpinner = true;
      $scope.recipe.save().then(function() {
        supersonic.ui.modal.hide();
      });

      // update recipe page
      _refreshViewData();

    };

    $scope.cancel = function() {
      supersonic.ui.modal.hide();
    };

  });
