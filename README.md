Angular Imgur Uploader
======================

Upload images to imgur easily!

[![Build Status](https://travis-ci.org/miller-time/angular-image-uploader.svg?branch=master)](https://travis-ci.org/miller-time/angular-image-uploader)

<img src="http://benschwarz.github.io/bower-badges/badge@2x.png?pkgname=angular-imgur-uploader" width="130" height="30">

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

See [examples](examples/README.md) page.

### Development

First time setup:

```
$ npm install
$ bower install
$ grunt
```

This will install the project dependencies and start `grunt watch`, which automatically
rebuilds (in the "dist" directory) and runs tests as you make edits.
