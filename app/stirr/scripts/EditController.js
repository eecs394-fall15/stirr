angular
  .module('stirr')
  .controller('EditController', function($scope, Recipe, supersonic) {
    $scope.recipe = null;
    $scope.errorMsg = null;
    $scope.showSpinner = true;

    var _back = function() {
      if ($scope.recipe) {
        $scope.showSpinner = true;

        // check for empty ingredients and steps
        $scope.recipe.ingredients = checkEmpty(
          $scope.recipe.ingredients, 'name');
        $scope.recipe.actions = checkEmpty(
          $scope.recipe.actions, 'step');

        // convert recipe JSON into strings
        $scope.recipe.ingredients = angular.toJson($scope.recipe.ingredients);
        $scope.recipe.actions = angular.toJson($scope.recipe.actions);
        $scope.recipe.time = angular.toJson($scope.recipe.time);

        $scope.recipe.save().then(function() {
          $scope.showSpinner = false;
          supersonic.ui.layers.pop();
        });
      } else {
        supersonic.ui.layers.pop();
      }
    };

    var _backButton = new supersonic.ui.NavigationBarButton({
      title: 'Back',
      onTap: _back
    });

    var _options = {
      title: 'stirr',
      overrideBackButton: true,
      buttons: {
        left: [_backButton]
      }
    };

    supersonic.ui.navigationBar.update(_options);

    supersonic.device.buttons.back.whenPressed(_back);

    // Fetch an object based on id from the database
    Recipe.find(steroids.view.params.id).then(
        function(recipe) {
          $scope.$apply(function($scope) {
            $scope.recipe = recipe;

            // Parse string json into in json object
            $scope.recipe.ingredients =
                JSON.parse($scope.recipe.ingredients || '[]');
            $scope.recipe.actions = JSON.parse($scope.recipe.actions || '[]');
            $scope.recipe.time = JSON.parse($scope.recipe.time || '{}');

            $scope.showSpinner = false;
          });
        },
        function(errorMsg) {
          $scope.showSpinner = false;
          $scope.errorMsg = errorMsg;
        });

    $scope.addIngredient = function() {
      $scope.recipe.ingredients.push({'name': '', 'quantity': ''});
    };

    $scope.addAction = function() {
      $scope.recipe.actions.push({'step': ''});
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
      $scope.$apply(function($scope) {
        $scope.showSpinner = true;
      });

      var file = new Parse.File(
          Date.now().toString(), {base64: base64}, 'image/png');
      file.save().then(function() {
        var url = file.url();
        $scope.$apply(function($scope) {
          $scope.showSpinner = false;
          $scope.recipe.image = {
            __type: "File",
            name: file.name(),
            url: file.url()
          };
        });
      });
    }

    $scope.uploadImage = function() {
      supersonic.media.camera.getFromPhotoLibrary({
        quality: 15,
        encodingType: 'png',
        destinationType: 'dataURL'
      }).then(_uploadBase64ToParse);
    };

    $scope.snapImage = function() {
      supersonic.media.camera.takePicture({
        quality: 15,
        encodingType: 'png',
        destinationType: 'dataURL'
      }).then(_uploadBase64ToParse);
    };

  });
