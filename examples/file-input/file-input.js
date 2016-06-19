angular.module('exampleApp')
    .controller('FileInputExampleCtrl', function($scope) {
        $scope.mode = {upload: true};
        $scope.image = {};

        $scope.uploaderConfig = {
            onReady: function(uploaderApi) {
                $scope.uploaderApi = uploaderApi;
            }
        };

        $scope.getFileInfo = function() {
            if ($scope.uploaderApi) {
                $scope.mode.upload = false;
                $scope.image.fileInfo = $scope.uploaderApi.getFile();
            }
        };
    });
