import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Platform,
  TextInput,
  Animated,
  TouchableOpacity,
} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import useKeyboardOffsetHeight from '../../../helpers/useKeyboardOffsetHeight';
import {useDispatch, useSelector} from 'react-redux';
import {
  addAssistantMessage,
  addMessage,
  createNewChat,
  markMessageAsRead,
  selectChats,
  selectCurrentChatId,
  updateAssistantMessage,
  updateChatSummary,
} from '../../../redux/reducers/chatSlice';
import Icon from 'react-native-vector-icons/Ionicons';
import uuid from 'react-native-uuid';
import axios from 'axios';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import RNFS from 'react-native-fs';

const windowHeight = Dimensions.get('window').height;

const SendButton = ({
  isTyping,
  setIsTyping,
  setCurrentChatId,
  length,
  setHeightOfMessageBox,
  messages,
}) => {
  const dispatch = useDispatch();
  const chats = useSelector(selectChats);
  const currentChatId = useSelector(selectCurrentChatId);
  const animationValue = useRef(new Animated.Value(0)).current;
  const TextInputRef = useRef(null);
  const [message, setMessage] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [recordedFilePath, setRecordedFilePath] = useState(null);

  const micAnimation = useRef(new Animated.Value(1)).current;
  const audioRecorderPlayer = useRef(new AudioRecorderPlayer()).current;

  const keyboardOffsetHeight = useKeyboardOffsetHeight();

  const handleTextChange = text => {
    setIsTyping(!!text);
    setMessage(text);
  };

  const handleContentSizeChange = event => {
    setHeightOfMessageBox(event.nativeEvent.contentSize.height);
  };

  const startMicAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(micAnimation, {
          toValue: 1.4,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(micAnimation, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  };

  const stopMicAnimation = () => {
    setIsTyping(true);

    micAnimation.stopAnimation(() => {
      micAnimation.setValue(1);
    });
  };

  const handleMicPress = async () => {
    if (isListening) {
      setIsListening(false);
      stopMicAnimation();
      console.log('Stopped listening...');
      const result = await audioRecorderPlayer.stopRecorder();
      // console.log('Audio recorded at:', result);
      // transcribeAudio(result);

      if (recordedFilePath) {
        console.log('Audio recorded at:', recordedFilePath);
        transcribeAudio(recordedFilePath);
      } else {
        console.warn('No valid recorded file path');
      }
    } else {
      const path = await audioRecorderPlayer.startRecorder();
      console.log('Recording started at:', path);
      setRecordedFilePath(path);
      setIsListening(true);
      startMicAnimation();
      console.log('Listening...');
    }
  };

  const transcribeAudio = async filePath => {
    try {
      console.log('[transcribeAudio] Original filePath:', filePath);

      const uri = filePath.startsWith('file://')
        ? filePath
        : `file://${filePath}`;

      const exists = await RNFS.exists(uri.replace('file://', ''));
      console.log('File exists?', exists);

      const formData = new FormData();
      formData.append('file', {
        uri,
        type: 'audio/mp4',
        name: 'sound.mp4',
      });

      console.log('FormData object:', formData);

      console.log('[transcribeAudio] Uploading file:', uri);

      const res = await axios.post(
        'http://10.0.0.102:8000/transcribe',
        formData,
        {
          headers: {'Content-Type': 'multipart/form-data'},
        },
      );

      console.log('[transcribeAudio] API responded:', res.data);
      const transcribedText = res.data.text;
      console.log('Transcribed:', transcribedText);
      setMessage(transcribedText);
    } catch (err) {
      console.error('[transcribeAudio] API error:', err.message);
      if (err.response) {
        console.log('[transcribeAudio] Server response:', err.response.data);
      }
    }
  };

  const fetchResponse = async (mes, selectedChatId) => {
    console.log('input message: ', mes.content);
    const id = length + 2;

    dispatch(
      addAssistantMessage({
        chatId: selectedChatId,
        message: {
          content: 'Thinking...',
          time: mes.time,
          role: 'assistant',
          id,
          isLoading: true,
        },
      }),
    );

    try {
      const messagesForGroq = [
        {role: 'system', content: 'You are a helpful assistant.'},
        ...messages,
        mes,
      ];

      const res = await axios.post('http://10.0.0.102:8000/chat', {
        messages: messagesForGroq,
      });

      const reply = res.data.reply;

      dispatch(
        updateAssistantMessage({
          chatId: selectedChatId,
          message: {
            content: reply,
            time: new Date().toString(),
            role: 'assistant',
            id,
            isLoading: false,
          },
          messageId: id,
        }),
      );
    } catch (error) {
      console.error('Groq Chat Error:', error.response?.data || error.message);
      dispatch(
        updateAssistantMessage({
          chatId: selectedChatId,
          message: {
            content: 'Oops! Something went wrong.',
            time: new Date().toString(),
            role: 'assistant',
            id,
            isLoading: false,
          },
          messageId: id,
        }),
      );
    }
  };

  const identifyImageApi = prompt => {
    const imageRegex = /\b(generate\s*image|imagine)\b/i;
    return imageRegex.test(prompt);
  };

  const addChat = async newId => {
    const selectedChatId = newId || currentChatId;
    const messageId = length + 1;

    if (length === 0 && message.trim().length > 0) {
      await dispatch(
        updateChatSummary({
          chatId: selectedChatId,
          summary: message?.trim().slice(0, 40),
        }),
      );
    }

    await dispatch(
      addMessage({
        chatId: selectedChatId,
        message: {
          content: message,
          time: new Date().toISOString(),
          role: 'user',
          id: messageId,
          isMessageRead: false,
          isLoading: false,
        },
      }),
    );

    setMessage('');
    TextInputRef.current.blur();
    setIsTyping(false);

    const promptForAssistant = {
      content: message,
      time: new Date().toString(),
      role: 'user',
      id: messageId,
      isMessageRead: false,
    };

    if (!identifyImageApi(message)) {
      fetchResponse(promptForAssistant, selectedChatId);
    }

    dispatch(
      markMessageAsRead({
        chatId: selectedChatId,
        messageId: messageId,
      }),
    );
  };

  useEffect(() => {
    Animated.timing(animationValue, {
      toValue: isTyping ? 1 : 0,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, [isTyping]);

  const sendButtonStyle = {
    opacity: animationValue,
    transform: [
      {
        scale: animationValue.interpolate({
          inputRange: [0, 1],
          outputRange: [0.5, 1],
        }),
      },
    ],
  };

  const sendIcon = <Icon name="send-sharp" size={RFValue(20)} color="white" />;

  return (
    <View
      style={[
        styles.container,
        {
          bottom:
            Platform.OS === 'android'
              ? windowHeight * 0.02
              : Math.max(keyboardOffsetHeight, windowHeight * 0.02),
        },
      ]}>
      <View style={styles.subContainer}>
        <View
          style={[styles.inputContainer, {width: isTyping ? '87%' : '100%'}]}>
          <TextInput
            editable
            ref={TextInputRef}
            multiline
            value={message}
            style={styles.textInput}
            placeholder="How can I help you today?"
            onChangeText={handleTextChange}
            onContentSizeChange={handleContentSizeChange}
          />
          <Animated.View style={{transform: [{scale: micAnimation}]}}>
            <TouchableOpacity
              onPress={handleMicPress}
              style={styles.micIconWrapper}>
              <Icon name="mic-outline" size={RFValue(20)} color="gray" />
            </TouchableOpacity>
          </Animated.View>
        </View>
        {isTyping && (
          <Animated.View style={[styles.sendButtonWrapper, sendButtonStyle]}>
            <TouchableOpacity
              style={styles.sendButton}
              onPress={async () => {
                const chatIndex = chats.findIndex(
                  chat => chat.id == currentChatId,
                );
                if (chatIndex !== -1) {
                  await addChat(currentChatId);
                } else {
                  const newId = uuid.v4();
                  setCurrentChatId(newId);
                  await dispatch(
                    createNewChat({
                      chatId: newId,
                      messages: [],
                      summary: 'New Chat',
                    }),
                  );
                  addChat(newId);
                }
              }}>
              {sendIcon}
            </TouchableOpacity>
          </Animated.View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    minHeight: windowHeight * 0.09,
    paddingHorizontal: '1%',
    padding: 10,
    Position: 'absolute',
    left: 0,
    right: 0,
    width: '98%',
    alignContent: 'center',
  },
  subContainer: {
    flex: 1,
    flexDirection: 'row',
    width: '100%',
  },
  inputContainer: {
    maxHeight: windowHeight * 0.2,
    margin: '1%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: '1%',
    borderRadius: 20,
    borderColor: '#000000',
    borderWidth: 0.5,
  },
  textInput: {
    flex: 1,
    padding: 10,
    marginHorizontal: '2%',
    fontSize: RFValue(13),
    color: 'black',
  },
  sendButtonWrapper: {
    position: 'absolute',
    right: 0,
    bottom: 6,
    width: '11%',
    justifyContent: 'center',
    alignContent: 'center',
  },
  sendButton: {
    backgroundColor: '#22c063',
    borderRadius: 42,
    height: 42,
    width: 42,
    justifyContent: 'center',
    alignItems: 'center',
  },
  micIconWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
});

export default SendButton;
