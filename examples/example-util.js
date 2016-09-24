var exampleApp = angular.module('exampleApp', ['ui.bootstrap', 'imgurUploader'])
    .config(function($controllerProvider, imgurProvider) {
        imgurProvider.setClientId('8fa733024dad604');

        exampleApp.controllerProvider = $controllerProvider;
    })
    .filter('bytes', function() {
        return function(bytes, precision) {
            if (isNaN(parseFloat(bytes)) || !isFinite(bytes)) return '-';
            if (typeof precision === 'undefined') precision = 1;
            var units = ['bytes', 'kB', 'MB', 'GB', 'TB', 'PB'],
                number = Math.floor(Math.log(bytes) / Math.log(1024));
            return (bytes / Math.pow(1024, Math.floor(number))).toFixed(precision) +  ' ' + units[number];
        }
    })
    .directive('example', function() {
        return {
            restrict: 'EA',
            scope: {
                config: '='
            },
            controller: function($scope, $http, $sce, $timeout, $window) {
                $scope.config.template = '/examples/' + $scope.config.id + '/' + $scope.config.id + '.html';
                $scope.config.script = '/examples/' + $scope.config.id + '/' + $scope.config.id + '.js';

                $http.get($scope.config.template, {cache: true}).then(function(response) {
                    $scope.config.html = $sce.trustAsHtml(response.data);
                    $timeout($window.Prism.highlightAll, 100);
                });
                $http.get($scope.config.script, {cache: true}).then(function(response) {
                    $scope.config.js = $sce.trustAsHtml(response.data);
                    $timeout($window.Prism.highlightAll, 100);
                });
            },
            template: '<div class="well">' +
                    '<h1>{{config.title}}</h1>' +
                '</div>' +
                '<div ng-include="config.template" class="row" style="margin-bottom:15px"></div>' +
                '<div class="row">' +
                    '<uib-tabset>' +
                        '<uib-tab heading="HTML">' +
                            '<pre>' +
                                '<code class="language-markup" ng-bind="config.html">{{config.html}}</code>' +
                            '</pre>' +
                        '</uib-tab>' +
                        '<uib-tab heading="JS">' +
                            '<pre>' +
                                '<code class="language-javascript" ng-bind-html="config.js"></code>' +
                            '</pre>' +
                        '</uib-tab>' +
                    '</uib-tabset>' +
                '</div>'
        };
    });
