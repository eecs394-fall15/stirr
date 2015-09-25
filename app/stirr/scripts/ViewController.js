angular
  .module('stirr')
  .controller('ViewController', function($scope, supersonic) {

    $scope.navbarTitle = "View";

    $scope.dishes = [
       {
           name: "Tomato soup",
           prepTime: "1 hour",
           author: "Pooja"
       },
       {
           name: "Ramen",
           prepTime: "2 hour",
           author: "Adrian"
       },
       {
           name: "Rice",
           prepTime: "1.5 hour",
           author: "Benjamin"
       }
    ];

  });
