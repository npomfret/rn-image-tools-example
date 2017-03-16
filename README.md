# rn-image-tools-example

Example project for [react-native-image-tools](https://github.com/npomfret/react-native-image-tools).

* Install

```
git clone git@github.com:npomfret/rn-image-tools-example.git
cd rn-image-tools-example
```

## iOS

* Copy the required frameworks to the a `Frameworks` folder at the root of your iOS project (or use this script).

```
#!/usr/bin/env bash

export SOURCE_DIR=~/Downloads/AdobeCreativeSDKDynamicFrameworks/
export TARGET_DIR=RNImageToolsExample/ios/Frameworks

mkdir -p $TARGET_DIR
cp -r $SOURCE_DIR/AdobeCreativeSDKCore.framework $TARGET_DIR
cp -r $SOURCE_DIR/AdobeCreativeSDKImage.framework $TARGET_DIR

```
(NOTE: they **must** be in a directory named _Frameworks_ located at the root of your iOS project)

If you wish to enter your adobe client id, secret key and redirect uri, add them to `componentWillMount` in `app.js`:

## Android

If you wish to enter your adobe client id, secret key and redirect uri, add them to:

    RNImageToolsExample/android/app/src/main/res/values/strings.xml

### Finally...

* Start

```
cd RNImageToolsExample
npm install && react-native start
```
