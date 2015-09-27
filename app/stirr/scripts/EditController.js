// angular
//   .module('stirr')
//   .controller('EditController', function($scope, supersonic) {

//     $scope.navbarTitle = 'Edit';

//     $scope.dish = {
//                     name: 'Tomato soup',
//                     icon: '/tomato-soup.jpg',
//                     prepTime: '1 hour',
//                     author: 'Pooja'
//                   };

//   });

angular
  .module('stirr')
  .controller('EditController', function($scope, Recipe, supersonic) {
    $scope.recipe = null;
    $scope.showSpinner = true;

    supersonic.ui.views.current.whenVisible(function() {
      _refreshViewData();
    });

    var _refreshViewData = function() {
      // for now, while we don't have a home or view page
      var id = 'lLodrIigiW';

      Recipe.find(id).then(function(recipe) {
        $scope.$apply(function() {
          $scope.recipe = recipe;
          $scope.showSpinner = false;
        });
        $scope.apply();
      });
    };

    // // Fetch an object based on id from the database
    // Recipe.find(steroids.view.params.id).then(function(recipe) {
    //   $scope.$apply(function() {
    //     $scope.recipe = recipe;
    //     $scope.showSpinner = false;
    //   });
    // });

    $scope.submitForm = function() {
      $scope.showSpinner = true;
      $scope.recipe.save().then(function() {
        supersonic.ui.modal.hide();
      });

      // update recipe page
      _refreshViewData();

    };

    $scope.cancel = function() {
      supersonic.ui.modal.hide();
    };

  });
