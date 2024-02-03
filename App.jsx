import * as React from 'react';
import AppMainStack from './src/stack/MainStack';
import {Provider} from 'react-redux';
import store from './src/components/redux/store';
import {SafeAreaView} from 'react-native';
function App() {
  return (
    <Provider store={store}>
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: 'white',
        }}>
        <AppMainStack />
      </SafeAreaView>
    </Provider>
  );
}

export default App;
