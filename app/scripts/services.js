'use strict';

var services = angular.module('apptrack.services', ['ngResource']);

services.factory('JobApp', ['$resource', function($resource) {
    function processJobApp(jobapp) {
        if (jobapp && jobapp.interviews) {
            jobapp.interviews = jobapp.interviews.map(function (interview) {
                interview.date = new Date(interview.date);
                return interview;
            });
        }
        return jobapp;
    }
    var resource = $resource('/application/:id', { id: '@_id' }, {
        query: {
            transformResponse: [ angular.fromJson, function (data) {
                data.forEach(processJobApp);
                return data;
            } ],
            isArray: true
        },
        get: {
            transformResponse: [ angular.fromJson, processJobApp ]
        },
        update: { method: 'put', isArray: false },
        create: { method: 'post' }
    });
    resource.prototype.$save = function() {
        if ( !this._id ) {
            return this.$create();
        } else {
            return this.$update();
        }
    };
    return resource;
}]);

services.factory('filterService', function () {
    return {
        searchText: ''
    };
});
