'use strict';

var app = angular.module('apptrackApp');

/**
 * @ngdoc function
 * @name apptrackApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the apptrackApp
 */
app.controller('MainCtrl', ['$scope', '$resource', '$timeout', 'JobApp', function ($scope, $resource, $timeout, JobApp) {
    $scope.newApplication = function () {
        $scope.current = new JobApp({ interviews: [ ] });
    };
    $scope.selectApplication = function (jobapp) {
        if ($scope.currentForm.$dirty) {
            $scope.current.dirty = true;
        }
        $scope.current = jobapp;
        if (!$scope.current.dirty) {
            $timeout(function () {
                $scope.currentForm.$setPristine(true);
            });
        }
    };
    $scope.saveApplication = function () {
        delete $scope.current.dirty;
        $scope.current.$save().then(function (rec) {
            rec.dirty = false;
            if (typeof $scope.current._id === 'undefined') {
                $scope.jobapps.push(rec);
            }
        });
    };
    $scope.removeInterview = function (interview, $event) {
        var index = $scope.current.interviews.indexOf(interview);
        if (index > -1) {
            $scope.current.interviews.splice(index, 1);
            if ($event) {
                $event.preventDefault();
            }
        }
    };
    var recruitercompanies = new Bloodhound({
        datumTokenizer: function (d) { if (d) { return Bloodhound.tokenizers.whitespace(d.name); } },
        queryTokenizer: Bloodhound.tokenizers.whitespace,
        local: [ ]
    });
    recruitercompanies.initialize();
    $scope.recruitercompanies = { 
        displayKey: 'name',
        source: recruitercompanies.ttAdapter()
    };
    JobApp.query(function (jobapps) {
        $scope.jobapps = jobapps;
        var seen = { };
        jobapps.forEach(function (ja) {
            if (ja.recruiter && ja.recruiter.company && !seen[ja.recruiter.company]) {
                seen[ja.recruiter.company] = true;
                recruitercompanies.add([ja.recruiter.company]);
            }
        });
    });
}]);

app.controller('EditCtrl', function() {
});

app.controller('AboutCtrl', ['$scope', function ($scope) {
    $scope.about = true;
}]);
