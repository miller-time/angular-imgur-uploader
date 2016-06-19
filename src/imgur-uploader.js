(function() {

    'use strict';

    var app = angular.module('imgurUploader', ['imgurUploader.util']);

    app.provider('imgur', function ImgurProvider() {
        var clientId;

        this.$get = function($http, $log, $q, fileReaderUtil) {
            if (clientId) {
                $log.debug('[imgur] Using Client ID: ' + clientId);
            } else {
                $log.error('[imgur] No Client ID configured!');
            }

            var upload = function(image, title, fileType) {
                $log.debug('[imgur] Uploading image (title: ' + title + ')');

                return $http.post(
                    'https://api.imgur.com/3/image',
                    {
                        image: image,
                        title: title,
                        type: fileType
                    },
                    {
                        headers: {
                            Authorization: 'Client-ID ' + clientId,
                            Accept: 'application/json'
                        }
                    }
                );
            };

            var uploadBase64 = function(image, title) {
                return fileReaderUtil.readBase64Str(image).then(function(base64imageData) {
                    return upload(base64imageData, title, 'base64');
                });
            };

            return {
                upload: upload,
                uploadBase64: uploadBase64
            };
        };

        this.setClientId = function(imgurClientId) {
            clientId = imgurClientId;
        };
    });

    app.directive('imgurUploaderFileInput', function() {
        return {
            restrict: 'EA',
            scope: {
                inputClass: '@',
                uploaderConfig: '='
            },
            controller: function($scope, imgur) {
                $scope.submit = function(description) {
                    return imgur.uploadBase64($scope.getFile(), description);
                };
            },
            link: function(scope, element) {
                scope.getFile = function() {
                    return element.find('input')[0].files && element.find('input')[0].files[0];
                }

                if (scope.uploaderConfig.onReady && typeof(scope.uploaderConfig.onReady) === 'function') {
                    scope.uploaderConfig.onReady({
                        getFile: scope.getFile,
                        submit: scope.submit
                    });
                }
            },
            template: '<input type="file" ng-class="inputClass">'
        }
    });

    app.directive('imgurUploaderForm', function() {
        return {
            restrict: 'EA',
            scope: {
                formClass: '@',
                inputClass: '@',
                inputContainerClass: '@',
                submitClass: '@',
                descriptionLabel: '@',
                imageLabel: '@',
                submitLabel: '@',
                onSubmit: '&'
            },
            controller: function($scope, imgur) {
                $scope.formClass = $scope.formClass || '';
                $scope.inputClass = $scope.inputClass || '';
                $scope.inputContainerClass = $scope.inputContainerClass || '';
                $scope.descriptionLabel = angular.isDefined($scope.descriptionLabel) ? $scope.descriptionLabel : 'Description';
                $scope.imageLabel = angular.isDefined($scope.imageLabel) ? $scope.imageLabel : 'Image';
                $scope.submitLabel = $scope.submitLabel || 'Upload';

                $scope.form = {description: ''};

                $scope.uploaderConfig = {
                    onReady: function(uploaderApi) {
                        $scope.uploaderApi = uploaderApi;
                    }
                };

                $scope.upload = function() {
                    if ($scope.uploaderApi && $scope.uploaderApi.getFile()) {
                        var uploadPromise = $scope.uploaderApi.submit($scope.form.description);
                        if ($scope.onSubmit) {
                            $scope.onSubmit({uploadPromise: uploadPromise});
                        }
                    }
                };
            },
            template: '<form ng-class="formClass">' +
                    '<div ng-class="inputContainerClass">' +
                        '<label>{{descriptionLabel}}</label>' +
                        '<input type="text" ng-model="form.description" ng-class="inputClass">' +
                    '</div>' +
                    '<div ng-class="inputContainerClass">' +
                        '<label>{{imageLabel}}</label>' +
                        '<imgur-uploader-file-input input-class="{{inputClass}}" ' +
                            'uploader-config="uploaderConfig">' +
                        '</imgur-uploader-file-input>' +
                    '</div>' +
                    '<button ng-class="submitClass" ng-click="upload()">' +
                        '{{submitLabel}}' +
                    '</button>' +
                '</form>'
        };
    });

})();
