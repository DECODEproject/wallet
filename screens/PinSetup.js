/*
 * DECODE App – A mobile app to control your personal data
 * Copyright (C) 2019 – Thoughtworks Ltd.
 * Copyright (C) 2019 – DRIBIA Data Research S.L.
 *
 * DECODE App is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * DECODE App is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * email: ula@dribia.com
 */

import React from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { SecureStore } from 'expo';
import PropTypes from 'prop-types';
import { Image, TextInput, View, Text, KeyboardAvoidingView, ScrollView } from 'react-native';
import Button from '../application/components/Button/Button';
import { changeText1, changeText2, storePin } from '../application/redux/actions/pinSetup';
import styles from './styles';
import i18n from '../i18n';

const decodeLogo = require('../assets/images/decode-logo-pin.png');

class PinSetup extends React.Component {

  render() {
    return (
      <KeyboardAvoidingView
        behavior="position"
      >
        <ScrollView keyboardShouldPersistTaps="handled">
          <View style={styles.pinContainer}>
            <Image
              style={styles.pinLogo}
              source={decodeLogo}
            />

            <Text style={styles.pinTitle}>
              {this.props.t('title')}
            </Text>
            <Text style={styles.pinSubtitle}>
              {this.props.t('subtitle')}
            </Text>

            <View style={{ height: 90 }}>
              <Text style={styles.pinInputLabel}>
                {this.props.t('labelPin1')}
              </Text>
              <TextInput
                style={styles.pinPassword}
                placeholder={this.props.t('placeholderPin1')}
                keyboardType="numeric"
                secureTextEntry
                underlineColorAndroid="transparent"
                value={this.props.pin1}
                onChangeText={pin => this.props.changeText1(pin)}
              />

              {!this.props.validPinFormat &&
              <Text style={styles.pinError}>
                { this.props.t('errorPin1') }
              </Text>}
            </View>
            <View style={{ height: 90 }}>
              <Text style={styles.pinInputLabel}>
                {this.props.t('labelPin2')}
              </Text>
              <TextInput
                style={styles.pinPassword}
                placeholder={this.props.t('placeholderPin2')}
                keyboardType="numeric"
                secureTextEntry
                underlineColorAndroid="transparent"
                value={this.props.pin2}
                onChangeText={pin => this.props.changeText2(pin)}
                onSubmitEditing={() => this.props.storePin(this.props.pin1)}
              />
              {!this.props.validPinEqual &&
              <Text style={styles.pinError}>
                {this.props.t('errorPin2')}
              </Text>}
            </View>
            <View style={{ marginHorizontal: '10%' }}>
              <Text style={{ color: '#C74A12' }}>
                { this.props.t('pinWarning') }
              </Text>
            </View>
            <View style={{ flexDirection: 'row' }}>
              <Button
                name={this.props.t('button')}
                onPress={() => this.props.storePin(this.props.pin1)}
                style={styles.pinButton}
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }
}


PinSetup.propTypes = {
  pin1: PropTypes.string.isRequired,
  pin2: PropTypes.string.isRequired,
  validPinFormat: PropTypes.bool.isRequired,
  validPinEqual: PropTypes.bool.isRequired,
  changeText1: PropTypes.func.isRequired,
  changeText2: PropTypes.func.isRequired,
  storePin: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  pin1: state.pinSetup.pin1,
  pin2: state.pinSetup.pin2,
  validPinFormat: state.pinSetup.validFormat,
  validPinEqual: state.pinSetup.validEqual,
});

const mapDispatchToProps = dispatch => ({
  changeText1: pin => dispatch(changeText1(pin)),
  changeText2: pin => dispatch(changeText2(pin)),
  storePin: pin => dispatch(storePin(SecureStore.setItemAsync, pin)),
});

export default translate('pinSetup', { i18n })(connect(mapStateToProps, mapDispatchToProps)(PinSetup));
