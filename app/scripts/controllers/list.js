'use strict';

angular.module('apptrackApp')
    .controller('ListCtrl', ['$scope', '$resource', function ($scope, $resource) {
        $resource('/applications.json').query(function (jobapps) {
            $scope.jobapps = jobapps;
        });
    }]);
