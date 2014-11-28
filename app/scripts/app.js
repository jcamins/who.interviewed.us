'use strict';

/**
 * @ngdoc overview
 * @name whoInterviewedUsApp
 * @description
 * # whoInterviewedUsApp
 *
 * Main module of the application.
 */
angular
  .module('whoInterviewedUsApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'whoInterviewedUs.services',
    'siyfion.sfTypeahead',
    'ui.bootstrap',
    'whoInterviewedUs.directives'
  ])
  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider
      .when('/applications', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        restrictedAccess: true,
        resolve: {
            auth: [ 'Auth', function (Auth) {
                return Auth.check();
            }]
        }
      })
      .when('/login', {
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl'
      })
      .otherwise({
        redirectTo: '/applications'
      });
  }])
  .factory('authInterceptor', ['$q', '$location', function($q, $location) {
    return {
        responseError: function (rejection) {
            if (rejection.status === 401) {
                $location.path('/login');
            }
            return $q.reject(rejection);
        }
    };
  }])
  .config(['$httpProvider', function($httpProvider) {
    $httpProvider.interceptors.push('authInterceptor');
  }])
  .run(['$rootScope', '$location', function ($rootScope, $location) {
    $rootScope.$on('$routeChangeError', function(event, next, current, error) {
        if (error.status === 401) {
            $location.path('/login');
        }
    });
  }]);
