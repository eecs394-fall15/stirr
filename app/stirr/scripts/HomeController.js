angular
  .module('stirr')
  .controller('HomeController', function($scope, Recipe, supersonic) {

    $scope.recipes = null;
    $scope.showSpinner = true;

    var deviceReady = false;

    var _whenDeviceReady = function(callback) {
      if (deviceReady) {
        callback();
      } else {
        angular.element(document).on('deviceready', callback);
      }
    };

    angular.element(document).on('deviceready', function() {
      deviceReady = true;
    });

    Recipe.all().whenChanged(function(recipes) {
      $scope.$apply(function() {
        $scope.recipes = recipes;
        $scope.showSpinner = false;
      });
    });

    var _newRecipe = function() {
      _whenDeviceReady(function() {
        var recipe = new Recipe({});
        recipe.uuid = device.uuid;
        recipe.save().then(function() {
          var view = new supersonic.ui.View('stirr#edit');
          supersonic.ui.layers.push(view, {
            params: {
              id: recipe.id
            }
          });
        });
      });
    };

    var addBtn = new supersonic.ui.NavigationBarButton({
      styleId: 'home-nav-add',
      onTap: _newRecipe
    });

    supersonic.ui.navigationBar.update({
      title: 'stirr',
      overrideBackButton: false,
      buttons: {
        right: [addBtn]
      }
    }).then(supersonic.ui.navigationBar.show());
  });
