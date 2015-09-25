angular
  .module('stirr')
  .controller('HomeController', function($scope, supersonic) {

    $scope.navbarTitle = "Home";
    $scope.pageTitle = "Welcome to stirr";

    $scope.teamMembers = ["Adrien", "Benjamin", "Kapil", "Pooja"];

  });
