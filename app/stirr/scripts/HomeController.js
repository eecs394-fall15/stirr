angular
  .module('stirr')
  .controller('HomeController', function($scope, supersonic) {

    $scope.navbarTitle = "Home";
    $scope.pageTitle = "Welcome to stirr";

    $scope.teamMembers = ["Adrian", "Benjamin", "Kapil", "Pooja"];

  });
