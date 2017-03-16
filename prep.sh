#!/usr/bin/env bash

export SOURCE_DIR=~/Downloads/AdobeCreativeSDKDynamicFrameworks/
export TARGET_DIR=RNImageToolsExample/ios/Frameworks

mkdir -p $TARGET_DIR
cp -r $SOURCE_DIR/AdobeCreativeSDKCore.framework $TARGET_DIR
cp -r $SOURCE_DIR/AdobeCreativeSDKImage.framework $TARGET_DIR

