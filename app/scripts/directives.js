'use strict';

var directives = angular.module('apptrack.directives', [ ]);

directives.directive('cpDatepicker', function() {
    return {
        restrict: 'E',
        require: 'ngModel',
        scope: {
            label: '@',
            dateFormat: '@',
            ngModel: '=',
            prefix: '@',
            closeText: '@'
        },
        template: '<div class="input-group"><label class="sr-only">{{label}}</label><div class="input-group-addon" ng-show="prefix">{{prefix}}</div><input type="text" class="form-control" datepicker-popup="{{dateFormat}}" placeholder="{{label}}" ng-model="ngModel" is-open="opened" close-text="{{closeText}}" /><div class="input-group-btn"><button type="button" class="btn btn-default" ng-click="open($event)"><i class="glyphicon glyphicon-calendar"></i></button></div>',
        link: function(scope) {
            scope.open = function ($event) {
                $event.preventDefault();
                $event.stopPropagation();
                scope.opened = true;
            };
        }
    };
});

directives.directive('cpInput', function() {
    return {
        restrict: 'E',
        require: 'ngModel',
        scope: {
            label: '@',
            ngModel: '=',
            prefix: '@',
            suffix: '@',
            type: '@',
            rows: '@'
        },
        template: '<div class="input-group"><label class="sr-only">{{label}}</label><div class="input-group-addon" ng-show="prefix">{{prefix}}</div><input type="text" class="form-control" placeholder="{{label}}" ng-model="ngModel" /><div class="input-group-addon" ng-show="suffix">{{suffix}}</div></div>'
    };
});
