"use strict";

import React, {Component} from "react";
import {AppRegistry, StyleSheet, Text, View, Button, Image, Dimensions, CameraRoll, Platform, TextInput, StatusBar, ScrollView, TouchableOpacity} from "react-native";
import RNImageTools from "react-native-image-tools";

const _width = Dimensions.get('window').width;

export default class RNImageToolsExample extends Component {
  constructor(props) {
    super(props);

    this._openGallery = this._openGallery.bind(this);
    this._openEditor = this._openEditor.bind(this);

    this.state = {
      selectedImage: null,
      originalImageUri: null,
      editedImageUri: null,
      outputFormat: 'JPEG',
      quality: "70"
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

    let originalImageUri = await RNImageToolsExample.pickAnImageFromPhotos();
    if (!originalImageUri) {
      originalImageUri = "https://exposingtheinvisible.org/ckeditor_assets/pictures/32/content_example_ibiza.jpg";//some image that has metadata
    }

    this.setState({
      originalImageUri: originalImageUri,
      selectedImage: originalImageUri,
      editedImageUri: null
    });
  }

  static async pickAnImageFromPhotos() {
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

    const assets = photos.edges;

    if (assets.length > 0) {
      return assets[0].node.image.uri;
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
        preserveMetadata: true,
        saveTo: 'photos'
      });

      console.log("edited uri", uri);

      if (!uri) {
        console.log("editing cancelled");
      } else {
        this.setState({editedImageUri: uri});
      }
    } catch (e) {
      console.warn("error", e);
    }
  }

  render() {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <StatusBar hidden={true}/>

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
                <TouchableOpacity onPress={() => this.setState({selectedImage: this.state.originalImageUri})}>
                  <View style={{borderWidth: 1, borderRadius: 4, borderColor: 'blue'}}>
                    <Image style={{width: _width / 2, height: _width / 2}} source={{uri: this.state.originalImageUri}}/>
                  </View>
                </TouchableOpacity>
              </View>
            </View> : null
        }

        <View style={{flexDirection: 'row'}}>
          <View style={{marginVertical: 4, flex: 1}}>
            <TextInputField label="input image" value={this.state.originalImageUri} onChangeText={(value) => this.setState({originalImageUri: value})}/>
            <TextInputField label="output quality" value={this.state.quality.toString()} onChangeText={(value) => this.setState({quality: value})}/>
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
              <TouchableOpacity onPress={() => this.setState({selectedImage: this.state.editedImageUri})}>
                <View style={{borderWidth: 1, borderRadius: 4, borderColor: 'blue'}}>
                  <Image style={{width: _width / 2, height: _width / 2}} source={{uri: this.state.editedImageUri}}/>
                </View>
              </TouchableOpacity>
            </View> : null
        }

        <MetadataView image={this.state.selectedImage}/>
      </ScrollView>
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

class MetadataView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      metadata: {}
    }
  }

  componentDidMount() {
    this._update();
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.image !== prevProps.image) {
      this._update();
    }
  }

  async _update() {
    const imageUri = this.props.image;
    if (!imageUri) {
      return;
    }

    try {
      const metadata = await RNImageTools.imageMetadata(imageUri);
      this.setState({metadata});
      console.log("metadata", metadata);
    } catch (e) {
      console.log("failed to get image metadata", e);
    }
  }

  _format(metadata, parent) {
    const arr = [];
    for (let key in metadata) {
      const value = metadata[key];
      const type = typeof value;
      const isArray = (value instanceof Array);
      const isObject = type === 'object' && !isArray;

      arr.push(
        <View key={parent + "_" + key} style={{flexDirection: 'row'}}>
          <Text style={{fontSize: 10, color: "#d1d2cd"}}>{key}</Text>
          {
            isObject ? this._format(value, key) : <Text key={key} style={{fontSize: 10, color: "#d1d2cd"}}>: {JSON.stringify(value)}</Text>
          }
        </View>
      );
    }
    return <View style={{padding: 4}}>{arr}</View>;
  }

  render() {
    return <View style={{flex: 1, backgroundColor: '#666666'}}>
      <Text>Image metadata</Text>
      {this._format(this.state.metadata, 'root')}
    </View>
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#e4ffe2',
    padding: 8
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
