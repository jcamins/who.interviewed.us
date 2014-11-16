'use strict';

var app = angular.module('apptrackApp');

app.controller('ListCtrl', ['$scope', '$resource', 'JobApp', function ($scope, $resource, JobApp) {
    JobApp.query(function (jobapps) {
        $scope.jobapps = jobapps;
    });
}]);
