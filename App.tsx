// App.tsx
import React from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';
import MetaAI from './src/views/screens/metaAI/MetaAI'; // adjust path if necessary
import {Provider} from 'react-redux';
import {store} from './src/redux/store';
import ChatScreen from './src/views/screens/ChatScreen';
// import VoiceListener from './src/views/screens/VoiceListener';
// import {PorcupineManager} from '@picovoice/porcupine-react-native';
// console.log('PorcupineManager init:', PorcupineManager);

const App = () => {
  console.log('Hellooooo');

  return (
    <Provider store={store}>
      <SafeAreaView style={styles.container}>
        <MetaAI />
        {/* <ChatScreen /> */}
        {/* <VoiceListener /> */}
      </SafeAreaView>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
