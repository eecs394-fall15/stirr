angular
  .module('stirr')
  .directive('stirrBanner', function() {
    return {
      link: function(scope, $element, attrs) {
        var targetWidth = null;
        var targetHeight = null;
        var imgLoaded = false;
        var $img = $element.find('img');

        var setContainerDimensions = function() {
          if (!$element[0].offsetWidth) {
            _.defer(setContainerDimensions);
            return;
          }
          targetWidth = $element[0].offsetWidth;
          targetHeight = targetWidth / (3 / 2);
          $element.css('height', targetHeight.toString() + 'px');
          if (imgLoaded) {
            angular.forEach($img, setImageDimensions);
          }
        };

        var setImageDimensions = function(img) {
          if (!targetWidth || !targetHeight) {
            return;
          }
          var imgWidth = img.naturalWidth;
          var imgHeight = img.naturalHeight;
          var imgRatio = imgWidth / imgHeight;
          if (imgWidth / imgHeight < (3 / 2)) {
            angular.element(img)
                .css('width', targetWidth.toString() + 'px')
                .css('height', (targetWidth / imgRatio).toString() + 'px');
          } else {
            angular.element(img)
                .css('width', (targetHeight * imgRatio).toString() + 'px')
                .css('height', targetHeight.toString() + 'px');
          }
        };

        $img.on('load', function() {
          imgLoaded = true;
          setImageDimensions(this);
        });

        angular.element(window).on('resize', setContainerDimensions);
        angular.element(document).ready(setContainerDimensions);
      },
      restrict: 'C'
    };

  });
