'use strict';

/**
 * @ngdoc overview
 * @name apptrackApp
 * @description
 * # apptrackApp
 *
 * Main module of the application.
 */
angular
  .module('apptrackApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'apptrack.services',
    'siyfion.sfTypeahead'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
