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

})();
