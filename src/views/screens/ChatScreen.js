// ChatScreen.js

import React, {useState} from 'react';
import {
  View,
  TextInput,
  Text,
  Button,
  StyleSheet,
  ScrollView,
} from 'react-native';
import {callLlamaHF as callLlama3} from './llamaService';

const ChatScreen = () => {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');

  const handleSend = async () => {
    setResponse('Typing...');
    const res = await callLlama3(input);
    console.log('resresres: ', res);
    setResponse(res);
  };
  return (
    <View style={styles.container}>
      <ScrollView style={styles.chatBox}>
        <Text>User: {input}</Text>
        <Text>Bot: {response}</Text>
      </ScrollView>
      <TextInput
        placeholder="Ask something..."
        style={styles.input}
        value={input}
        onChangeText={setInput}
      />
      <Button title="Send" onPress={handleSend} />
    </View>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  container: {flex: 1, padding: 16},
  input: {borderColor: '#ccc', borderWidth: 1, marginVertical: 10, padding: 8},
  chatBox: {flex: 1, marginBottom: 10},
});
