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
    $scope.newIngredient = {name: ''};
    $scope.newAction = {step: ''};

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

    /**
     * if recipe already exists
     *   confirm
     *   if parent recipe
     *     if children exist
     *       disassociate author and uuid
     *       return to home
     *     else
     *       delete recipe
     *       return to home
     *   else
     *     delete recipe
     *     return to home
     * else
     *   if new recipe
     *     return to home
     *   else
     *     return to base recipe view
     */
    $scope.delete = function() {
      if ($scope.recipe.id) {
        if (window.confirm('Are you sure?')) {
          if ($scope.recipe.parentId) {
            $scope.recipe.delete().then(function() {
              supersonic.ui.layers.popAll();
            });
          } else {
            Recipe.findAll().then(function(recipes) {
              recipes = recipes.filter(function(recipe) {
                return recipe.parentId === $scope.recipe.id;
              });
              if (recipes.length) {
                $scope.recipe.author = null;
                $scope.recipe.uuid = null;
                $scope.recipe.save().then(function() {
                  supersonic.ui.layers.popAll();
                });
              } else {
                $scope.recipe.delete().then(function() {
                  supersonic.ui.layers.popAll();
                });
              }
            });
          }
        }
      } else {
        var pop = function() {
          if (!$scope.recipe.id && !$scope.recipe.parentId) {
            supersonic.ui.layers.popAll();
          } else {
            supersonic.ui.layers.pop();
          }
        };
        if (changed) {
          if (window.confirm('Are you sure?')) {
            pop();
          }
        } else {
          pop();
        }
      }
    };

    var _focusIngredient = function(field, index) {
      var element = document.getElementById(field + '-' + index.toString());
      element.focus();
    };

    $scope.addIngredient = function(field) {
      if ($scope.newIngredient.name || $scope.newIngredient.quantity) {
        $scope.ingredients.push($scope.newIngredient);
        $scope.newIngredient = {name: ''};
        _.defer(_.partial(
            _focusIngredient, field, $scope.ingredients.length - 1));
      }
    };

    $scope.ingredientEnter = function(event, field, index) {
      if (event.which === 13) {
        var targetField = field === 'ingredient' ? 'quantity' : 'ingredient';
        var targetIndex = field === 'ingredient' ? index : index + 1;
        if (targetIndex === $scope.ingredients.length) {
          _focusIngredient(targetField, 'new');
        } else {
          _focusIngredient(targetField, targetIndex);
        }
      }
    };

    var _focusAction = function(index) {
      var element = document.getElementById('action-' + index.toString());
      element.focus();
    };

    $scope.addAction = function() {
      if ($scope.newAction.step) {
        $scope.actions.push($scope.newAction);
        $scope.newAction = {step: ''};
        _.defer(_.partial(
            _focusAction, $scope.actions.length - 1));
      }
    };

    $scope.actionEnter = function(e, index) {
      if (event.which === 13) {
        event.preventDefault();
        if (index + 1 === $scope.actions.length) {
          _focusAction('new');
        } else {
          _focusAction(index + 1);
        }
      }
    };

    supersonic.ui.views.current.params.onValue(function(params) {
      if (params.id) {
        Recipe.find(params.id).then(_display, _alertError);
      } else if (params.baseId) {
        Recipe.find(params.baseId).then(function(recipe) {
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
    });
  });
