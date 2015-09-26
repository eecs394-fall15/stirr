angular
  .module('stirr')
  .controller('EditController', function($scope, supersonic) {

    $scope.navbarTitle = 'Edit';

    $scope.dish = {
                    name: 'Tomato soup',
                    icon: '/tomato-soup.jpg',
                    prepTime: '1 hour',
                    author: 'Pooja'
                  };

  });
