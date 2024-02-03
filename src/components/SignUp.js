import React, {useEffect, useState} from 'react';
import account from '../../config';
import {
  SafeAreaView,
  StyleSheet,
  View,
  TextInput,
  Button,
  Text,
  Alert,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import {v4 as uuidv4} from 'uuid';
import 'react-native-get-random-values';
import axios from 'axios';

function SignUp(props) {
  const uniqueId = uuidv4();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(async () => {
    let loggedIn = await AsyncStorage.getItem('loggedIn');

    if (loggedIn === 'true') {
      props.navigation.navigate('Dashboard');
    }
  }, []);

  const addUserToDb = async response => {
    try {
      await axios.post('http://localhost:3000/users', {
        name: response?.name,
        email: response?.email,
        shoppingList: [],
      });
      props.navigation.navigate('SignIn');
    } catch (error) {
      console.log('error', error);
    }
  };

  function handleSubmit() {
    account.create(uniqueId, email, password, name).then(
      function (response) {
        if (response.status) {
          addUserToDb(response);
        }
      },
      function (error) {
        Alert.alert(error.message);
      },
    );
  }

  function handleSubmitSingIn() {
    props.navigation.navigate('SignIn');
  }

  return (
    <View style={styles.centerContainer}>
      <View>
        <Text>Sign Up</Text>
      </View>
      <TextInput
        style={styles.input}
        placeholder="Name"
        autoCapitalize={false}
        onChangeText={nameText => setName(nameText)}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        autoCapitalize={false}
        onChangeText={nameEmail => setEmail(nameEmail)}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        autoCapitalize={false}
        secureTextEntry={true}
        onChangeText={namePassword => setPassword(namePassword)}
      />
      <Button title="Sign Up" onPress={() => handleSubmit()} />
      <Button title="Sign In" onPress={() => handleSubmitSingIn()} />
    </View>
  );
}

const styles = StyleSheet.create({
  centerContainer: {
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    margin: 10,
    width: 300,
  },
});

export default SignUp;
