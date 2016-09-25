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
                $scope.config.includes = $scope.config.includes || {};

                if ($scope.config.includes.app) {
                    $http.get('/examples/' + $scope.config.includes.app, {cache: true}).then(function(response) {
                        $scope.config.appContents = $sce.trustAsHtml(response.data);
                        $timeout($window.Prism.highlightAll, 100);
                    });
                }
                if ($scope.config.includes.template) {
                    $http.get('/examples/' + $scope.config.includes.template, {cache: true}).then(function(response) {
                        $scope.config.templateContents = $sce.trustAsHtml(response.data);
                        $timeout($window.Prism.highlightAll, 100);
                    });
                }
            },
            template: '<div class="well">' +
                    '<h1>{{config.title}}</h1>' +
                '</div>' +
                '<div ng-include="config.includes.template" class="row" style="margin-bottom:15px"></div>' +
                '<div class="row">' +
                    '<uib-tabset>' +
                        '<uib-tab heading="HTML">' +
                            '<pre>' +
                                '<code class="language-markup" ng-bind="config.templateContents"></code>' +
                            '</pre>' +
                        '</uib-tab>' +
                        '<uib-tab heading="JS">' +
                            '<pre>' +
                                '<code class="language-javascript" ng-bind-html="config.appContents"></code>' +
                            '</pre>' +
                        '</uib-tab>' +
                    '</uib-tabset>' +
                '</div>'
        };
    });
