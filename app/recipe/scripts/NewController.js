angular
  .module('recipe')
  .controller("NewController", function ($scope, Recipe, supersonic) {
    $scope.recipe = {};

    $scope.submitForm = function () {
      $scope.showSpinner = true;
      newrecipe = new Recipe($scope.recipe);
      newrecipe.save().then( function () {
        supersonic.ui.modal.hide();
      });
    };

    $scope.cancel = function () {
      supersonic.ui.modal.hide();
    }

  });