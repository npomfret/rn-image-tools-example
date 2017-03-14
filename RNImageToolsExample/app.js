"use strict";

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View
} from 'react-native';

export default class RNImageToolsExample extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          react-native image tools example
        </Text>
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
