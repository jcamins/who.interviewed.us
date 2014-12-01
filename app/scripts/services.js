'use strict';

var services = angular.module('whoInterviewedUs.services', ['ngResource']);

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
                if (data && data.forEach) {
                    data.forEach(processJobApp);
                }
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

services.factory('Changelog', ['$resource', function($resource) {
    return $resource('/changelog', { }, {
        get: {
            method: 'GET',
            isArray: true,
            transformResponse: [ angular.fromJson, function (data) {
                if (data && data.forEach) {
                    data.forEach(function (item, idx) {
                        item.index = idx;
                    });
                }
                return data;
            } ]
        }
    });
}]);

services.factory('filterService', function () {
    return {
        searchText: ''
    };
});

services.factory('Auth', [ '$q', '$http', '$window', '$rootScope', '$location', function ($q, $http, $window, $rootScope, $location) {
    function login(user) {
        return $http({
            method: 'POST',
            url: '/auth/login',
            data: user
        });
    }
    function createUser(user) {
        return $http({
            method: 'POST',
            url: '/auth/user',
            data: user
        });
    }
    function logout() {
        var deferred = $q.defer();

        $http({
            method: 'GET',
            url: '/auth/logout',
        }).then(function (res) {
            delete $window.sessionStorage.user;
            delete $rootScope.user;
            deferred.resolve(res);
        }, function (error) { deferred.reject(error); })
        .finally(function () {
            $location.path('/login');
        });
        return deferred.promise;
    }
    function check() {
        var user = $window.sessionStorage.user;
        if (user) {
            $rootScope.user = JSON.parse(user);
            return $rootScope.user;
        }
        return $http.get('/auth/user').then(function (res) {
            if (res.status === 200 && res.data) {
                $rootScope.user = $window.sessionStorage.user = JSON.stringify(res.data);
                return res.data;
            } else {
                throw({ status: 401 });
            }
        });
    }
    return {
        login: login,
        logout: logout,
        check: check,
        createUser: createUser
    };
}]);
