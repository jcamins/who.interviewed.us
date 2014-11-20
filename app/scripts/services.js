'use strict';

var services = angular.module('apptrack.services', ['ngResource']);

services.factory('JobApp', ['$resource', function($resource) {
    function processJobApp(jobapp) {
        if (jobapp.interviews) {
            jobapp.interviews = jobapp.interviews.map(function (interview) {
                interview.date = new Date(interview.date);
                return interview;
            });
        }
        return jobapp;
    }
    return $resource('/applications.json', { }, {
        query: {
            interceptor: {
                response: function (res) {
                    res.data.forEach(processJobApp);
                    return res.data;
                }
            },
            isArray: true
        }
    });
}]);

services.factory('filterService', function () {
    return {
        searchText: ''
    };
});
