'use strict';

/**
 * @ngdoc overview
 * @name crystalSlipperApp
 * @description
 * # crystalSlipperApp
 *
 * Main module of the application.
 */
angular
  .module('crystalSlipperApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'crystalSlipper.services',
    'siyfion.sfTypeahead',
    'ui.bootstrap',
    'crystalSlipper.directives'
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
