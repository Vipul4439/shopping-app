import React, {useState} from 'react';
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

function SingIn(props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function handleSubmit() {
    const user = account.createEmailSession(email, password);
    user.then(
      async function (response) {
        await AsyncStorage.setItem('loggedIn', 'true');
        await AsyncStorage.setItem('email', email);
        setEmail('');
        setPassword('');
        props.navigation.navigate('Dashboard');
      },

      function (error) {
        Alert.alert(error.message);
      },
    );
  }

  const handleSubmitSignUp = () => {
    props.navigation.navigate('SignUp');
  };

  return (
    <View style={styles.centerContainer}>
      <View>
        <Text>Login</Text>
      </View>
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
      <Button title="Sign In" onPress={() => handleSubmit()} />
      <Button title="Sign Up" onPress={() => handleSubmitSignUp()} />
    </View>
  );
}

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
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

export default SingIn;