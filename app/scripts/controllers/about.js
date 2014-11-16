'use strict';

/**
 * @ngdoc function
 * @name apptrackApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the apptrackApp
 */
angular.module('apptrackApp')
  .controller('AboutCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
