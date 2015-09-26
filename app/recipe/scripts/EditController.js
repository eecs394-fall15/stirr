angular
  .module('recipe')
  .controller("EditController", function ($scope, Recipe, supersonic) {
    $scope.recipe = null;
    $scope.showSpinner = true;

    // Fetch an object based on id from the database
    Recipe.find(steroids.view.params.id).then( function (recipe) {
      $scope.$apply(function() {
        $scope.recipe = recipe;
        $scope.showSpinner = false;
      });
    });

    $scope.submitForm = function() {
      $scope.showSpinner = true;
      $scope.recipe.save().then( function () {
        supersonic.ui.modal.hide();
      });
    }

    $scope.cancel = function () {
      supersonic.ui.modal.hide();
    }

  });
