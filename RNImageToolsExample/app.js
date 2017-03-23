"use strict";

import React, {Component} from "react";
import {AppRegistry, StyleSheet, Text, View, Button, Image, Dimensions, CameraRoll, Platform, TextInput, StatusBar} from "react-native";
import RNImageTools from "react-native-image-tools";

const _width = Dimensions.get('window').width;

export default class RNImageToolsExample extends Component {
  constructor(props) {
    super(props);

    this._openGallery = this._openGallery.bind(this);
    this._openEditor = this._openEditor.bind(this);

    this.state = {
      originalImageUri: null,
      editedImageUri: null,
      outputFormat: 'JPEG',
      quality: "80"
    }
  }

  async componentDidMount() {
    // this is the auth mechanism for iOS only,
    // for android these values need to come from your MainApplication.java, in this example app we chose to reference them from strings.xml
    RNImageTools.authorize(
      "client-id-here",
      "client-secret-here",
      "client-redirect-here"
    );

    const fetchParams = {
      first: 1,
      groupTypes: "SavedPhotos",
      assetType: "Photos"
    };

    if (Platform.OS === "android") {
      // not supported in android
      delete fetchParams.groupTypes;
    }

    const photos = await CameraRoll.getPhotos(fetchParams);
    console.log("photos", photos);

    const assets = photos.edges;

    if (assets.length > 0) {
      this.setState({
        originalImageUri: assets[0].node.image.uri,
        editedImageUri: null
      });
    }
  }

  async _openGallery() {
    try {
      const uri = await RNImageTools.selectImage({});

      console.log("chosen uri", uri);

      this.setState({
        originalImageUri: uri,
        editedImageUri: null
      });
    } catch (e) {
      console.log("cancelled", e);
    }
  }

  async _openEditor() {
    try {
      const uri = await RNImageTools.openEditor({
        imageUri: this.state.originalImageUri,
        outputFormat: this.state.outputFormat,
        quality: parseInt(this.state.quality, 10),
        preserveMetadata: true
      });

      console.log("edited uri", uri);

      this.setState({editedImageUri: uri});
    } catch (e) {
      console.warn("error", e);
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar hidden={true} />

        <Text style={styles.welcome}>
          react-native image tools example
        </Text>

        <View style={{marginVertical: 4}}>
          <Button
            onPress={this._openGallery}
            title="select image"
            color="#841584"
          />
        </View>

        {
          this.state.originalImageUri ? <View>
              <View style={{marginVertical: 4, flexDirection: 'row', justifyContent: 'center'}}>
                <View style={{borderWidth: 1, borderRadius: 4, borderColor: 'blue'}}>
                  <Image style={{width: _width / 2, height: _width / 2}} source={{uri: this.state.originalImageUri}}/>
                </View>
              </View>
            </View> : null
        }

        <View style={{flexDirection: 'row'}}>
          <View style={{marginVertical: 4, flex: 1}}>
            <TextInputField label="input image" value={this.state.originalImageUri} onChangeText={(value) => this.setState({originalImageUri: value})}/>
            <TextInputField label="output quality" value={this.state.quality.toString()} onChangeText={(value) => this.setState({quality: value})} />
            <TextInputField label="output format" value={this.state.outputFormat} onChangeText={(value) => this.setState({outputFormat: value})}/>
          </View>
        </View>

        {
          this.state.originalImageUri ? <View>
              <View style={{marginVertical: 4}}>
                <Button
                  onPress={this._openEditor}
                  title="open editor"
                  color="#841584"
                />
              </View>
            </View> : null
        }

        {
          this.state.editedImageUri ? <View style={{marginVertical: 4, flexDirection: 'row', justifyContent: 'center'}}>
              <View style={{borderWidth: 1, borderRadius: 4, borderColor: 'blue'}}>
                <Image style={{width: _width / 2, height: _width / 2}} source={{uri: this.state.editedImageUri}}/>
              </View>
            </View> : null
        }
      </View>
    );
  }
}

class TextInputField extends Component {
  render() {
    return <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 4}}>
      <Text style={{marginRight: 4, fontSize: 10}}>{this.props.label}</Text>
      <View style={[styles.textContainer]}>
        <TextInput underlineColorAndroid="transparent" style={styles.textInput} {...this.props} />
      </View>
    </View>
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e4ffe2',
    paddingHorizontal: 8
  },
  welcome: {
    fontSize: 14,
    textAlign: 'center',
    margin: 10,
  },
  textContainer: {
    borderWidth: 1,
    borderRadius: 4,
    overflow: 'hidden',
    backgroundColor: "#666666",
    flex: 1
  },
  textInput: {
    color: "#d1d2cd",
    paddingTop: 0,
    paddingLeft: 2,
    paddingRight: 0,
    paddingBottom: 0,
    fontSize: 16,
    height: 24,
  }
});
