'use strict';

describe('imgurUploader imgur service', function() {

    var $httpBackend,
        $q,
        $rootScope,
        fileReaderUtil,
        imgur;

    beforeEach(module('imgurUploader', function(imgurProvider) {
        imgurProvider.setClientId('testClientId');
    }));

    beforeEach(inject(function(_$httpBackend_, _$q_, _$rootScope_, _fileReaderUtil_, _imgur_) {
        $httpBackend = _$httpBackend_;
        $q = _$q_;
        $rootScope = _$rootScope_;
        fileReaderUtil = _fileReaderUtil_;
        imgur = _imgur_;
    }));

    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    it('should upload an image to imgur via HTTP POST request', function() {
        var image = {
            description: 'test image',
            fileType: 'png',
            data: '0111001'
        };

        $httpBackend.expectPOST(
            'https://api.imgur.com/3/image',
            {
                image: image.data,
                title: image.description,
                type: image.fileType
            },
            {
                'Authorization': 'Client-ID testClientId',
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=utf-8'
            }
        ).respond(200);

        imgur.upload(image.data, image.description, image.fileType);

        // manually trigger digest cycle to invoke HTTP promise
        $rootScope.$digest();

        // flush mock HTTP request
        $httpBackend.flush();
    });

    it('should utilize the fileReaderUtil to upload a base64 image', function() {
        var image = {
            description: 'test b64 image',
            data: '111011'
        };

        $httpBackend.expectPOST(
            'https://api.imgur.com/3/image',
            {
                image: 'b64 data',
                title: image.description,
                type: 'base64'
            },
            {
                'Authorization': 'Client-ID testClientId',
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=utf-8'
            }
        ).respond(200);

        spyOn(fileReaderUtil, 'readBase64Str').and.callFake(function() {
            return $q.when('b64 data');
        });

        imgur.uploadBase64(image.data, image.description);

        // manually trigger digest cycle to invoke HTTP promise
        $rootScope.$digest();

        // flush mock HTTP request
        $httpBackend.flush();
    });

});
