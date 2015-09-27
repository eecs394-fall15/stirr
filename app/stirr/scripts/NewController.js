angular
  .module('stirr')
  .controller('NewController', function($scope, Recipe, supersonic) {
    $scope.recipe = {};

    $scope.submitForm = function() {
      $scope.showSpinner = true;
      var newrecipe = new Recipe($scope.recipe);
      newrecipe.save().then(function() {
        supersonic.ui.modal.hide();
      });
    };

    $scope.cancel = function() {
      supersonic.ui.modal.hide();
    };

  });
