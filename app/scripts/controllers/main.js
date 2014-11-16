'use strict';

/**
 * @ngdoc function
 * @name apptrackApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the apptrackApp
 */
angular.module('apptrackApp')
  .controller('MainCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
