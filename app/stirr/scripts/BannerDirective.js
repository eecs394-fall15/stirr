angular
  .module('stirr')
  .directive('stirrBanner', function() {
    return {
      link: function(scope, element, attrs) {
        var targetWidth = null;
        var targetHeight = null;
        var imgLoaded = false;

        var setContainerDimensions = function() {
          targetWidth = window.innerWidth;
          targetHeight = targetWidth / (3 / 2);
          element.css('height', targetHeight.toString() + 'px');
        };

        var setImageDimensions = function() {
          imgLoaded = true;
          var imgWidth = this.naturalWidth;
          var imgHeight = this.naturalHeight;
          var imgRatio = imgWidth / imgHeight;
          console.log(imgWidth, imgHeight, targetWidth, targetHeight);
          if (imgWidth / imgHeight < (3 / 2)) {
            angular.element(this)
                .css('width', targetWidth.toString() + 'px')
                .css('height', (targetWidth / imgRatio).toString() + 'px');
          } else {
            angular.element(this)
                .css('width', (targetHeight * imgRatio).toString() + 'px')
                .css('height', targetHeight.toString() + 'px');
          }
        };

        element.find('img').on('load', setImageDimensions);

        angular.element(window).on('resize', function() {
          setContainerDimensions();
          if (imgLoaded) {
            setImageDimensions();
          }
        });

        setContainerDimensions();
      },
      restrict: 'C'
    };

  });
