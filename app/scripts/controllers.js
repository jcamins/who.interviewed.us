'use strict';

var app = angular.module('whoInterviewedUsApp');

/**
 * @ngdoc function
 * @name whoInterviewedUsApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the whoInterviewedUsApp
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
        var isnew = typeof $scope.current._id === 'undefined';
        delete $scope.current.dirty;
        $scope.current.$save().then(function (rec) {
            $scope.currentForm.$setPristine(true);
            if (isnew) {
                $scope.jobapps.push(rec);
            }
        });
    };
    $scope.removeApplication = function (jobapp) {
        jobapp.$delete();
        $scope.jobapps.splice($scope.jobapps.indexOf(jobapp), 1);
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

app.controller('LoginCtrl', [ '$scope', '$location', 'Auth', function($scope, $location, Auth) {
    $scope.submit = function (user, newuser) {
        var action = newuser ? Auth.createUser(user) : Auth.login(user);
        action.then(function () {
            $location.path('/');
        }, function (err) {
            $scope.usererr = err.data.error || { error: true };
        });
    };
}]);

app.controller('MenuCtrl', ['$scope', 'Auth', function ($scope, Auth) {
    $scope.logout = Auth.logout;
}]);
