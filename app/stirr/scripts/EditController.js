angular
  .module('stirr')
  .controller('EditController', function($scope, Recipe, supersonic) {
    $scope.recipe = null;
    $scope.errorMsg = null;
    $scope.showSpinner = true;
    $scope.showImageSpinner = true;
    $scope.ingredients = null;
    $scope.actions = null;
    $scope.time = null;
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

    var _alertError = function(error) {
      window.alert(error);
      $scope.$apply(function($scope) {
        $scope.showSpinner = false;
      });
    };

    var changed = false;

    var _back = function() {
      var backAndPub = function() {
        if (!$scope.recipe.id && !$scope.recipe.parentId) {
          supersonic.ui.layers.popAll();
        } else {
          supersonic.data.channel('editPop').publish({
            id: $scope.recipe.id
          });
          supersonic.ui.layers.pop();
        }
      };
      if (changed) {
        if (window.confirm('Discard unsaved changes?')) {
          backAndPub();
        }
      } else {
        backAndPub();
      }
    };

    var _save = function() {
      if ($scope.recipe) {
        $scope.$apply(function($scope) {
          $scope.showSpinner = true;
        });

        // check for empty ingredients and steps
        $scope.ingredients = checkEmpty($scope.ingredients, 'name');
        $scope.actions = checkEmpty($scope.actions, 'step');

        // convert recipe JSON into strings
        $scope.recipe.ingredients = angular.toJson($scope.ingredients);
        $scope.recipe.actions = angular.toJson($scope.actions);
        $scope.recipe.time = angular.toJson($scope.time);

        if ($scope.name) {
          $scope.recipe.image = {
            __type: 'File',
            name: $scope.name,
            url: $scope.url
          };
        }

        var prevUndef = $scope.recipe.id === undefined;
        $scope.recipe.save().then(function() {
          $scope.$apply(function($scope) {
            $scope.showSpinner = false;
          });

          if (prevUndef) {
            Recipe.find($scope.recipe.id).then(_display, _alertError);
          }
          changed = false;
        }, _alertError);
      }
    };

    var _backButton = new supersonic.ui.NavigationBarButton({
      styleId: 'back-button',
      onTap: _back
    });

    var _saveButton = new supersonic.ui.NavigationBarButton({
      styleId: 'save-button',
      onTap: _save
    });

    var _options = {
      title: 'stirr',
      overrideBackButton: true,
      buttons: {
        left: [_backButton],
        right: [_saveButton]
      }
    };

    supersonic.ui.navigationBar.update(_options);

    supersonic.device.buttons.back.whenPressed(_back);

    var _display = function(recipe) {
      $scope.$apply(function($scope) {
        $scope.recipe = recipe;

        if ($scope.recipe.image) {
          $scope.name = $scope.recipe.image.name;
          $scope.url = $scope.recipe.image.url;
        }

        // Parse string json into in json object
        $scope.ingredients = JSON.parse($scope.recipe.ingredients || '[]');
        $scope.actions = JSON.parse($scope.recipe.actions || '[]');
        $scope.time = JSON.parse($scope.recipe.time || '{}');

        $scope.showSpinner = false;
      });
    };

    if (steroids.view.params.id) {
      Recipe.find(steroids.view.params.id).then(_display, _alertError);
    } else if (steroids.view.params.baseId) {
      Recipe.find(steroids.view.params.baseId).then(function(recipe) {
        _whenDeviceReady(function() {
          _display(new Recipe({
            description: recipe.description,
            ingredients: recipe.ingredients,
            actions: recipe.actions,
            time: recipe.time,
            image: recipe.image,
            uuid: device.uuid,
            parentId: recipe.parentId || recipe.id
          }));
        });
      }, _alertError);
    } else {
      _whenDeviceReady(function() {
        _display(new Recipe({
          uuid: device.uuid
        }));
      });
    }

    $scope.addIngredient = function() {
      $scope.ingredients.push({'name': '', 'quantity': ''});
    };

    $scope.addAction = function() {
      $scope.actions.push({'step': ''});
    };

    /**
     * Creates a new array for ingredients/actions without
     * blank object entries. Object is blank if key value is empty string.
     *
     * @param  {Array} objArray - array of objects
     * @param  {String} key - component of object to check if empty
     * @return {Array} - array with blank objects removed
     */
    var checkEmpty = function(objArray, key) {
      var outputArray = [];
      for (var i in objArray) {
        if (objArray[i][key] !== '') {
          outputArray.push(objArray[i]);
        }
      }
      return (outputArray);
    };

    var _uploadBase64ToParse = function(base64) {
      supersonic.logger.info('uploading');
      $scope.showImageSpinner = true;
      var file = new Parse.File(
          Date.now().toString(), {base64: base64}, 'image/png');
      file.save().then(function() {
        supersonic.logger.info('file saved');
        $scope.change();
        $scope.$apply(function($scope) {
          $scope.name = file.name();
          $scope.url = file.url();
        });
      });
    };

    $scope.uploadImage = function() {
      supersonic.media.camera.getFromPhotoLibrary({
        quality: 50,
        encodingType: 'png',
        destinationType: 'dataURL'
      }).then(_uploadBase64ToParse);
    };

    $scope.snapImage = function() {
      supersonic.media.camera.takePicture({
        quality: 50,
        encodingType: 'png',
        destinationType: 'dataURL'
      }).then(_uploadBase64ToParse);
    };

    $scope.change = function() {
      changed = true;
    };
  });
