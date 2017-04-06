"use strict";

import React, {Component} from "react";
import {NativeModules, NativeEventEmitter, AppRegistry, StyleSheet, Text, View, Button, Image, Dimensions, CameraRoll, Platform, TextInput, StatusBar, ScrollView, TouchableOpacity} from "react-native";
import RNImageTools from "react-native-image-tools";

const myModuleEvt = new NativeEventEmitter(NativeModules.RNImageTools);
myModuleEvt.addListener('photoLibraryImage', (data) => console.log("photoLibraryImage", data));

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
      quality: "70",
      sampleImages: []
    }
  }

  async componentDidMount() {
    if (Platform === 'ios') {//android implemention to follow
      const hasPermission = await RNImageTools.checkImageLibraryPermission();
      if (!hasPermission) {
        await RNImageTools.requestImageLibraryPermission();
      }
    }

    RNImageTools.loadThumbnails();

    // this is the auth mechanism for iOS only,
    // for android these values need to come from your MainApplication.java, in this example app we chose to reference them from strings.xml
    RNImageTools.authorize(
      "client-id-here",
      "client-secret-here",
      "client-redirect-here"
    );

    const sampleImages = await RNImageToolsExample.sampleImages();

    let originalImageUri = sampleImages[0];
    if (!originalImageUri) {
      originalImageUri = "https://exposingtheinvisible.org/ckeditor_assets/pictures/32/content_example_ibiza.jpg";//some image that has metadata
    }

    //originalImageUri = "assets-library://asset/asset.JPG?id=04A39A57-6015-4175-B193-2C61A0F89394&ext=JPG";

    this.setState({
      originalImageUri: originalImageUri,
      selectedImage: originalImageUri,
      editedImageUri: null,
      sampleImages: sampleImages
    });
  }

  componentDidUpdate() {
    console.log("state", this.state);
  }

  static async sampleImages() {
    const fetchParams = {
      first: 5,
      groupTypes: "SavedPhotos",
      assetType: "Photos"
    };

    if (Platform.OS === "android") {
      // not supported in android
      delete fetchParams.groupTypes;
    }

    const photos = await CameraRoll.getPhotos(fetchParams);

    return photos.edges.map((asset) => asset.node.image.uri);
  }

  async _openGallery() {
    try {
      const selected = await RNImageTools.selectImage({});

      console.log("chosen image", selected);

      const uri = selected.uri;

      this.setState({
        originalImageUri: uri,
        editedImageUri: null,
        selectedImage: uri
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
        this.setState({
          editedImageUri: uri,
          selectedImage: uri
        });
      }
    } catch (e) {
      console.warn("error", e);
    }
  }

  render(map) {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <StatusBar hidden={true}/>

        <Text style={styles.welcome}>
          react-native image tools example
        </Text>

        <View style={{marginVertical: 2}}>
          <View style={{flexDirection: 'row', justifyContent: 'center', marginVertical: 2}}>
            <View style={{flexDirection: 'row'}}>
              {
                this.state.sampleImages.map((uri) => <TouchableOpacity onPress={() => this.setState({originalImageUri: uri})}>
                    <Image style={{width: _width / 8, height: _width / 8, marginHorizontal: 2}} source={{uri: uri}}/>
                  </TouchableOpacity>
                )
              }
            </View>
            <Button
              onPress={this._openGallery}
              title="..."
              color="#841584"
            />
          </View>
          <View style={{flex: 1, marginRight: 2}}>
            <TextInputField label="input image" value={this.state.originalImageUri} onChangeText={(value) => this.setState({originalImageUri: value})}/>
          </View>
        </View>

        {
          this.state.originalImageUri ? <View>
              <View style={{marginVertical: 4, flexDirection: 'row', justifyContent: 'center'}}>
                <TouchableOpacity onPress={() => this.setState({selectedImage: this.state.originalImageUri})}>
                  <View style={{borderWidth: 1, borderRadius: 4, borderColor: 'green', overflow: 'hidden'}}>
                    <Image style={{width: _width / 2, height: _width / 2}} source={{uri: this.state.originalImageUri}}/>
                  </View>
                </TouchableOpacity>
              </View>
            </View> : null
        }

        <View style={{flexDirection: 'row'}}>
          <View style={{marginVertical: 4, flex: 1}}>
            <TextInputField label="output quality" value={this.state.quality.toString()} onChangeText={(value) => this.setState({quality: value})}/>
            <TextInputField label="output format" value={this.state.outputFormat} onChangeText={(value) => this.setState({outputFormat: value})}/>
          </View>
        </View>

        {
          this.state.originalImageUri ? <View style={{flexDirection: 'row', justifyContent: 'center'}}>
              <View style={{marginVertical: 4}}>
                <Button
                  onPress={this._openEditor}
                  title="edit image"
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

  componentWillUpdate(nextProps, nextState) {
    console.log("metadata", nextState.metadata);
  }

  async _update() {
    const imageUri = this.props.image;
    if (!imageUri) {
      return;
    }

    Image.getSize(imageUri, (width, height) => {
      this.setState({width, height})
    }, (err) => {
      console.warn("failed to get image size", err);
    });

    try {
      const metadata = await RNImageTools.imageMetadata(imageUri);
      this.setState({metadata});
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

      const valueAsText = !!value ? JSON.stringify(value) : "";

      const id = parent + "_" + key;

      arr.push(
        <View key={id} style={{flexDirection: 'row'}}>
          <Text style={{fontSize: 8, color: "#d1d2cd", fontWeight: isObject ? "600" : "200"}}>{key}</Text>
          {
            isObject ? this._format(value, id) : <Text key={key} style={{fontSize: 8, color: "#d1d2cd"}}>: {valueAsText}</Text>
          }
        </View>
      );
    }
    return <View style={{padding: 4}}>{arr}</View>;
  }

  render() {
    return <View style={{flex: 1, backgroundColor: '#666666'}}>
      <View style={{padding: 4}}>
        <Text style={{fontSize: 14, color: "#d1d2cd"}}>Image metadata</Text>
        <Text ellipsizeMode="middle" numberOfLines={1} style={{fontSize: 8, color: "#d1d2cd"}}>uri: {this.props.image}</Text>
        <Text style={{fontSize: 8, color: "#d1d2cd"}}>dimensions: {this.state.width}x{this.state.height}</Text>
        {this._format(this.state.metadata, 'root')}
      </View>
    </View>
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#e4ffe2',
    padding: 2
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
