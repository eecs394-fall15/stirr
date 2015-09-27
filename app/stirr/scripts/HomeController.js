// angular
//   .module('stirr')
//   .controller('HomeController', function($scope, supersonic) {

//     $scope.navbarTitle = 'Home';
//     $scope.pageTitle = 'Welcome to stirr';

//     $scope.teamMembers = ['Adrien', 'Benjamin', 'Kapil', 'Pooja'];

//   });

angular
  .module('stirr')
  .controller('HomeController', function($scope, Recipe, supersonic) {
    $scope.pageTitle = 'welcome to stirr';
    $scope.recipes = null;
    $scope.showSpinner = true;

    Recipe.all().whenChanged(function(recipes) {
      $scope.$apply(function() {
        $scope.recipes = recipes;
        $scope.showSpinner = false;
      });
    });
  });
