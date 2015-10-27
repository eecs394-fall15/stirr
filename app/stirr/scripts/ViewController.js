angular
  .module('stirr')
  .controller('ViewController', function($scope, Recipe, supersonic) {
    $scope.recipe = null;
    $scope.showSpinner = true;
    $scope.dataId = undefined;
    $scope.name = null;
    $scope.url = '/food-placeholder.png';

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

    var _back = function() {
      supersonic.ui.layers.pop();
    };

    var _backButton = new supersonic.ui.NavigationBarButton({
      styleId: 'back-button',
      onTap: _back
    });

    $scope.forkRecipe = function() {
      var editView = new supersonic.ui.View('stirr#edit');
      supersonic.ui.layers.push(editView, {
        params: {
          baseId: $scope.recipe.id
        }
      });
    };

    $scope.seeVersions = function() {
      console.log($scope.recipe);
      var versionView = new supersonic.ui.View('stirr#version-view');
      var options = {
        params: {
          parentId: $scope.recipe.parentId || $scope.recipe.id
        }
      };
      supersonic.ui.modal.show(versionView, options);
    };

    var _edit = function() {
      var view = new supersonic.ui.View('stirr#edit');
      supersonic.ui.layers.push(view, {
        params: {
          id: $scope.recipe.id
        }
      });
    };

    var _editButton = new supersonic.ui.NavigationBarButton({
      styleId: 'edit-button',
      onTap: _edit
    });

    var _getRecipe = function(recipeId) {
      Recipe.find(recipeId).then(
      function(recipe) {
        $scope.$apply(function($scope) {
          $scope.recipe = recipe;

          if ($scope.recipe.image) {
            $scope.name = $scope.recipe.image.name;
            $scope.url = $scope.recipe.image.url;
          }

          // Parse string json into in json object
          $scope.ingredients =
              JSON.parse($scope.recipe.ingredients || '[]');
          $scope.actions = JSON.parse($scope.recipe.actions || '[]');
          $scope.time = JSON.parse($scope.recipe.time || '{}');

          _updateMenu();

          $scope.showSpinner = false;
        });
        $scope.changed = false;
      },
      function(errorMsg) {
        $scope.showSpinner = false;
        $scope.errorMsg = errorMsg;
      });
    };

    supersonic.data.channel('editPop').subscribe(function(data) {
      supersonic.ui.views.current.whenVisible(_.once(function() {
        if (data.id) {
          _getRecipe(data.id);
        }
      }));
    });

    var _updateMenu = function() {
      _whenDeviceReady(function() {
        var _options;
        var deviceID = device.uuid;
        if ($scope.recipe.uuid == deviceID) {
          _options = {
            title: 'stirr',
            overrideBackButton: true,
            buttons: {
              left: [_backButton],
              right: [_editButton]
            }
          };
        } else {
          _options = {
            title: 'stirr',
            overrideBackButton: true,
            buttons: {
              left: [_backButton]
            }
          };
        }
        supersonic.ui.navigationBar.update(_options);
      });
    };

    supersonic.ui.views.current.params.onValue(function(params) {
      if (params.bypass) {
        var pushEdit = function() {
          var editView = new supersonic.ui.View('stirr#edit');
          supersonic.ui.layers.push(editView);
        };
        supersonic.device.platform().then(function(platform) {
          angular.element(document).ready(pushEdit);
        });
      } else {
        _getRecipe(params.id);
      }
    });
  });
