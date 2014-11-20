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
    $scope.newInterview = function () {
        $scope.current.interviews = $scope.current.interviews || [ ];
        $scope.current.interviews.push({ new: true });
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
    JobApp.query(function (jobapps) {
        $scope.jobapps = jobapps;
    });
    var recruitercompanies = new Bloodhound({
        datumTokenizer: function (d) { if (d) { return Bloodhound.tokenizers.whitespace(d.value); } },
        queryTokenizer: Bloodhound.tokenizers.whitespace,
        prefetch: {
            url: 'applications.json',
            ttl: 1000,
            filter: function (data) {
                var sugs = [ ];
                var seen = { };
                data.forEach(function (ja) {
                    if (ja.recruiter && ja.recruiter.company && !seen[ja.recruiter.company]) {
                        seen[ja.recruiter.company] = true;
                        sugs.push({ value: ja.recruiter.company});
                    }
                });
                return sugs;
            }
        }
    });
    recruitercompanies.initialize();
    $scope.recruitercompanies = { 
        source: recruitercompanies.ttAdapter()
    };
}]);

app.controller('EditCtrl', function() {
});

app.controller('AboutCtrl', ['$scope', function ($scope) {
    $scope.about = true;
}]);
