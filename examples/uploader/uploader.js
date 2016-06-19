angular.module('exampleApp')
    .controller('UploaderExampleCtrl', function($scope) {
        $scope.mode = {upload: true};

        $scope.onSubmit = function(uploadPromise) {
            if (uploadPromise) {
                uploadPromise.then(function(response) {
                    $scope.mode.upload = false;
                    $scope.imageLink = response.data.data.link;
                });
            }
        };
    });
