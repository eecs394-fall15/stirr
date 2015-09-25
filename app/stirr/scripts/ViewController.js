angular
  .module('stirr')
  .controller('ViewController', function($scope, supersonic) {

    $scope.navbarTitle = 'View';

    $scope.dishes = [
      {
        name: 'Tomato soup',
        icon: '/tomatosoup.jpg',
        prepTime: '1 hour',
        author: 'Pooja'
      },
      {
        name: 'Ramen',
        icon: '/tomatosoup.jpg',
        prepTime: '2 hour',
        author: 'Adrian'
      },
      {
        name: 'Rice',
        icon: '/tomatosoup.jpg',
        prepTime: '1.5 hour',
        author: 'Benjamin'
      }
    ];

  });
