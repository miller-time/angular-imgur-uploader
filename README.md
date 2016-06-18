Angular Imgur Uploader
======================

Upload images to imgur easily!


### Installation

* add script to your page

```html
<script src="bower_components/angular-imgur-uploader/dist/imgur-uploader.min.js"></script>
```

* inject `imgurUploader` module as a dependency

```javascript
app = angular.module('myApp', ['imgurUploader']);
```

* configure `imgurProvider` with your Client ID

```javascript
app.config(function(imgurProvider) {
    imgurProvider.setClientId('myClientID');
});
```

### Usage

#### `imgur` service

Upload a file object (*it is converted to base-64 first; useful for file inputs in forms*)

```javascript
app.run(function(imgur) {
    imgur.uploadBase64(myImage, imageTitle);
});
```

Upload any file type

```javascript
app.run(function(imgur) {
    imgur.upload(myImage, imageTitle, fileType);
});
```

### Development

First time setup:

```
$ npm install
$ bower install
$ grunt
```

This will install the project dependencies and start `grunt watch`, which automatically
rebuilds (in the "dist" directory) and runs tests as you make edits.
