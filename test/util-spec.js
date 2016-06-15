'use strict';

describe('imgurUploader.util', function() {

    var $rootScope, fileReaderUtil, mockFileReader, result;

    var arrayBufferFromStr = function(str) {
        var ab = new ArrayBuffer(str.length);
        var view = new Uint8Array(ab);
        for (var i = 0; i < str.length; ++i) {
            view[i] = str.charCodeAt(i);
        }
        return ab;
    };

    beforeEach(module('imgurUploader.util'));

    beforeEach(inject(function(_$rootScope_, _fileReaderUtil_) {
        $rootScope = _$rootScope_;
        fileReaderUtil = _fileReaderUtil_;

        mockFileReader = {
            addEventListener: jasmine.createSpy('eventListener'),
            readAsArrayBuffer: jasmine.createSpy('readAsArrayBuffer'),
            result: arrayBufferFromStr('foo')
        };
        spyOn(window, 'FileReader').and.returnValue(mockFileReader);
    }));

    it('should read a file and return a base-64 string', function() {
        var file = new Blob(['b64 image']);

        fileReaderUtil(file).then(function(base64Str) {
            result = base64Str;
        });

        // addEventListener('done'), addEventListener('error')
        expect(mockFileReader.addEventListener.calls.count()).toEqual(2);
        expect(mockFileReader.readAsArrayBuffer).toHaveBeenCalledWith(file);

        // call the 'done' event listener
        mockFileReader.addEventListener.calls.argsFor(0)[1]();

        $rootScope.$digest();

        // base-64 of 'foo' which is mockFileReader.result
        expect(result).toEqual('Zm9v');
    });

});
