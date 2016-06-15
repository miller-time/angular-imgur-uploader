(function() {

    'use strict';

    var app = angular.module('imgurUploader.util', []);

    var arrayBufferToBase64String = function(buffer) {
        var binary = '';
        var bytes = new Uint8Array(buffer);
        for (var i = 0; i < bytes.byteLength; ++i) {
            binary += String.fromCharCode(bytes[i]);
        }
        return btoa(binary);
    };

    app.factory('fileReaderUtil', function($log, $q) {
        return function(image) {
            var deferred = $q.defer();

            var reader = new FileReader();

            reader.addEventListener('load', function() {
                var arrayBuffer = reader.result;
                $log.debug('[imgur] converting file to base-64...');
                var base64Str = arrayBufferToBase64String(arrayBuffer);
                deferred.resolve(base64Str);
            });

            reader.addEventListener('error', function() {
                deferred.reject();
            });

            $log.debug('[imgur] reading file...');
            reader.readAsArrayBuffer(image);
            return deferred.promise;
        };
    });

})();
