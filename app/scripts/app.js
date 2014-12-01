'use strict';

var indexContent = document.querySelector('#viewContent').innerHTML;

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
    'ui.utils',
    'ui.bootstrap',
    'whoInterviewedUs.directives'
  ])
  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider
      .when('/applications', {
        templateUrl: 'views/applications.html',
        controller: 'ApplicationsCtrl',
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
      .when('/', {
        template: function () { return indexContent; },
        controller: 'IndexCtrl'
      })
      .otherwise({
        redirectTo: '/'
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
