"use strict";

import React, {Component} from "react";
import {AppRegistry, StyleSheet, Text, View, Button, Image, Dimensions} from "react-native";
import RNImageTools from "react-native-image-tools";

const _width = Dimensions.get('window').width;

export default class RNImageToolsExample extends Component {
  constructor(props) {
    super(props);

    this._openGallery = this._openGallery.bind(this);
    this._openEditor = this._openEditor.bind(this);

    this.state = {
      originalImageUri: null,
      editedImageUri: null
    }
  }

  componentDidMount() {
    // this is the auth mechanism for iOS only,
    // for android these values need to come from your MainApplication.java, in this example app we chose to reference them from strings.xml
    RNImageTools.authorize(
      "client-id-here",
      "client-secret-here",
      "client-redirect-here"
    );
  }

  async _openGallery() {
    try {
      const uri = await RNImageTools.selectImage({});
      console.log("chosen uri", uri);
      this.setState({originalImageUri: uri, editedImageUri: null});
    } catch (e) {
      console.log("cancelled", e);
    }
  }

  async _openEditor() {
    try {
      const uri = await RNImageTools.openEditor(this.state.originalImageUri);
      console.log("edited uri", uri);
      this.setState({editedImageUri: uri});
    } catch (e) {
      console.log("cancelled", e);
    }
  }

  render() {
    return (
      <View style={styles.container}>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
    paddingTop: 30,
    paddingHorizontal: 8
  },
  welcome: {
    fontSize: 14,
    textAlign: 'center',
    margin: 10,
  }
});
