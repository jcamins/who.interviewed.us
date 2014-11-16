'use strict';

var app = angular.module('apptrackApp');

/**
 * @ngdoc function
 * @name apptrackApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the apptrackApp
 */
app.controller('MainCtrl', ['$scope', '$resource', 'JobApp', function ($scope, $resource, JobApp) {
    JobApp.query(function (jobapps) {
        $scope.jobapps = jobapps;
    });
}]);

app.controller('AboutCtrl', ['$scope', function ($scope) {
    $scope.about = true;
}]);
