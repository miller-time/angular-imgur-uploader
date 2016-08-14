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

describe('imgurUploaderFileInput directive', function() {

    var $rootScope,
        element,
        imgur,
        uploaderApi;

    beforeEach(module('imgurUploader', function(imgurProvider) {
        imgurProvider.setClientId('testClientId');
    }));

    beforeEach(inject(function($compile, _$rootScope_, _imgur_) {
        $rootScope = _$rootScope_;
        imgur = _imgur_;

        $rootScope.testConfig = {
            onReady: jasmine.createSpy('onReady').and.callFake(function(api) {
                uploaderApi = api;
            })
        };

        element = angular.element(
            '<imgur-uploader-file-input ' +
                'uploader-config="testConfig">' +
            '</imgur-uploader-file-input>'
        );

        $compile(element)($rootScope);
        $rootScope.$digest();
    }));

    it('should have one input element', function() {
        expect(element.find('input').length).toBe(1);
    });

    it('should call the onReady function and pass its api', function() {
        expect($rootScope.testConfig.onReady).toHaveBeenCalled();
        expect(typeof(uploaderApi.getFile)).toEqual('function');
        expect(typeof(uploaderApi.submit)).toEqual('function');
    });

    it('should use the imgur service to submit uploads', function() {
        spyOn(element.isolateScope(), 'getFile').and.returnValue('foo');
        spyOn(imgur, 'uploadBase64');

        uploaderApi.submit('bar');

        expect(imgur.uploadBase64).toHaveBeenCalledWith('foo', 'bar');
    });

});

describe('imgurUploaderForm directive', function() {

    var $rootScope,
        element;

    beforeEach(module('imgurUploader', function(imgurProvider) {
        imgurProvider.setClientId('testClientId');
    }));

    beforeEach(inject(function($compile, _$rootScope_) {
        $rootScope = _$rootScope_;

        $rootScope.onSubmit = function(uploadPromise) {
            $rootScope.submitPromise = uploadPromise;
        };

        element = angular.element(
            '<imgur-uploader-form ' +
                'on-submit="onSubmit(uploadPromise)">' +
            '</imgur-uploader-form>'
        );

        $compile(element)($rootScope);
        $rootScope.$digest();
    }));

    it('should link up to the uploader api', function() {
        expect(element.isolateScope().uploaderApi).toBeDefined();
    });

    it('should upload via the api and trigger its onSubmit method', function() {
        spyOn(element.isolateScope().uploaderApi, 'getFile').and.returnValue('foo');
        spyOn(element.isolateScope().uploaderApi, 'submit').and.returnValue('submitPromise');
        spyOn(element.isolateScope(), 'onSubmit');

        element.isolateScope().form.description = 'bar';

        element.isolateScope().upload();

        expect(element.isolateScope().uploaderApi.submit).toHaveBeenCalledWith('bar');
        expect(element.isolateScope().onSubmit).toHaveBeenCalledWith({uploadPromise: 'submitPromise'});
    });

});
