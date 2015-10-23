angular
  .module('stirr')
  .controller('HomeController', function($scope, Recipe, supersonic) {

    $scope.recipes = null;
    $scope.showSpinner = true;
    $scope.filtering = true;

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

    var _getRecipes = function() {
      $scope.showSpinner = true;
      _whenDeviceReady(function() {
        Recipe.findAll().then(function(recipes) {
          $scope.$apply(function() {
            recipes = recipes.filter(function(recipe) {
              return !recipe.parentId;
            });
            if ($scope.filtering) {
              $scope.recipes = recipes.filter(function(recipe) {
                return recipe.uuid === device.uuid;
              });
            } else {
              $scope.recipes = recipes.filter(function(recipe) {
                return recipe.uuid !== device.uuid;
              });
            }
            $scope.showSpinner = false;
          });
        });
      });
    };

    supersonic.ui.views.current.whenVisible(_getRecipes);

    $scope.filter = function(enabled) {
      $scope.filtering = enabled;
      _getRecipes();
    };

    var _newRecipe = function() {
      _whenDeviceReady(function() {
        var recipe = new Recipe({});
        recipe.uuid = device.uuid;
        recipe.save().then(function() {
          var viewView = new supersonic.ui.View('stirr#view');
          supersonic.ui.layers.push(viewView, {
            params: {
              id: recipe.id,
              bypass: true
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
