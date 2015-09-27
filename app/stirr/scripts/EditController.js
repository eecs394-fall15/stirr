angular
  .module('stirr')
  .controller('EditController', function($scope, Recipe, supersonic) {

    $scope.navbarTitle = 'Edit';

    $scope.dishes = ['Tomato Soup', 'Ramen', 'Rice'];

  });
