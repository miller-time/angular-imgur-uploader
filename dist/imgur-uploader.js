(function() {
    "use strict";
    var app = angular.module("imgurUploader", [ "imgurUploader.util" ]);
    app.provider("imgur", function() {
        var clientId;
        this.$get = [ "$http", "$log", "$q", "fileReaderUtil", function($http, $log, $q, fileReaderUtil) {
            clientId ? $log.debug("[imgur] Using Client ID: " + clientId) : $log.error("[imgur] No Client ID configured!");
            var upload = function(image, title, fileType) {
                return $log.debug("[imgur] Uploading image (title: " + title + ")"), $http.post("https://api.imgur.com/3/image", {
                    image: image,
                    title: title,
                    type: fileType
                }, {
                    headers: {
                        Authorization: "Client-ID " + clientId,
                        Accept: "application/json"
                    }
                });
            }, uploadBase64 = function(image, title) {
                return fileReaderUtil.readBase64Str(image).then(function(base64imageData) {
                    return upload(base64imageData, title, "base64");
                });
            };
            return {
                upload: upload,
                uploadBase64: uploadBase64
            };
        } ], this.setClientId = function(imgurClientId) {
            clientId = imgurClientId;
        };
    });
})(), function() {
    "use strict";
    var app = angular.module("imgurUploader.util", []), arrayBufferToBase64String = function(buffer) {
        for (var binary = "", bytes = new Uint8Array(buffer), i = 0; i < bytes.byteLength; ++i) binary += String.fromCharCode(bytes[i]);
        return btoa(binary);
    };
    app.service("fileReaderUtil", [ "$log", "$q", function($log, $q) {
        this.readBase64Str = function(image) {
            var deferred = $q.defer(), reader = new FileReader();
            return reader.addEventListener("load", function() {
                var arrayBuffer = reader.result;
                $log.debug("[imgur] converting file to base-64...");
                var base64Str = arrayBufferToBase64String(arrayBuffer);
                deferred.resolve(base64Str);
            }), reader.addEventListener("error", function() {
                deferred.reject();
            }), $log.debug("[imgur] reading file..."), reader.readAsArrayBuffer(image), deferred.promise;
        };
    } ]);
}();