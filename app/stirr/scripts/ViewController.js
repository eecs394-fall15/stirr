angular
  .module('stirr')
  .controller('ViewController', function($scope, supersonic) {

    $scope.navbarTitle = 'View';

    $scope.dishes = [
       {
         name: 'Tomato soup',
         icon: 'http://dingo.care2.com/pictures/greenliving/4/3519.large.jpg',
         prepTime: '1 hour',
         author: 'Pooja'
       },
       {
         name: 'Ramen',
         icon: 'http://dingo.care2.com/pictures/greenliving/4/3519.large.jpg',
         prepTime: '2 hour',
         author: 'Adrian'
       },
       {
         name: 'Rice',
         icon: 'http://dingo.care2.com/pictures/greenliving/4/3519.large.jpg',
         prepTime: '1.5 hour',
         author: 'Benjamin'
       }
    ];

  });
