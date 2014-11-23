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
  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider
      .when('/applications', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        resolve: {
            user: [ 'Auth', function (Auth) {
                return Auth.check();
            }]
        }
      })
      .when('/login', {
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl'
      })
      .otherwise({
        redirectTo: '/applications'
      });
  }])
  .run(['$rootScope', '$location', 'Auth', function ($rootScope, $location, Auth) {
    $rootScope.$on('$routeChangeStart', function(event, next, current) {
        if (next && next.$$route && next.$$route.restrictedAccess) {
            if (Auth.check()) {
            } else {
                $location.path('/login');
            }
        }
    });
  }]);
