// angular
//   .module('stirr')
//   .controller('ViewController', function($scope, supersonic) {

//     $scope.navbarTitle = 'View';

//     $scope.dishes = [
//       {
//         name: 'Tomato soup',
//         icon: '/tomato-soup.jpg',
//         prepTime: '1 hour',
//         author: 'Pooja'
//       },
//       {
//         name: 'Ramen',
//         icon: '/tomato-soup.jpg',
//         prepTime: '2 hour',
//         author: 'Adrian'
//       },
//       {
//         name: 'Rice',
//         icon: '/tomato-soup.jpg',
//         prepTime: '1.5 hour',
//         author: 'Benjamin'
//       }
//     ];

//   });

angular
  .module('recipe')
  .controller("ShowController", function ($scope, Recipe, supersonic) {
    $scope.recipe = null;
    $scope.showSpinner = true;
    $scope.dataId = undefined;

    var _refreshViewData = function () {
      Recipe.find($scope.dataId).then( function (recipe) {
        $scope.$apply( function () {
          $scope.recipe = recipe;
          $scope.showSpinner = false;
        });
      });
    }

    supersonic.ui.views.current.whenVisible( function () {
      if ( $scope.dataId ) {
        _refreshViewData();
      }
    });

    supersonic.ui.views.current.params.onValue( function (values) {
      $scope.dataId = values.id;
      _refreshViewData();
    });

    $scope.remove = function (id) {
      $scope.showSpinner = true;
      $scope.recipe.delete().then( function () {
        supersonic.ui.layers.pop();
      });
    }
  });
