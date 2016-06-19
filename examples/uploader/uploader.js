angular.module('exampleApp')
    .controller('UploaderExampleCtrl', function($scope, imgur) {
        $scope.mode = {upload: true};
        $scope.image = {description: ''};

        $scope.uploadImage = function() {
            var file = document.getElementById('image').files[0];
            imgur.uploadBase64(file, $scope.image.description).then(function(response) {
                $scope.mode.upload = false;
                $scope.image.description = '';
                $scope.imageLink = response.data.data.link;
            });
        };
    });
