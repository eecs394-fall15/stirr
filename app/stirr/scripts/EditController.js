angular
  .module('stirr')
  .controller('EditController', function($scope, supersonic) {

    $scope.navbarTitle = "Edit";

    $scope.dishes = ["Tomato Soup", "Ramen", "Rice"];

  });
