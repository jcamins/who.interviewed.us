'use strict';

var services = angular.module('apptrack.services', ['ngResource']);

services.factory('JobApp', ['$resource', function($resource) {
    return $resource('/applications.json');
}]);

services.factory('filterService', function () {
    return {
        searchText: ''
    };
});
