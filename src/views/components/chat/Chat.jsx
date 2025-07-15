import React, {useMemo, useEffect, useRef} from 'react';
import {View, Text, Dimensions, Animated, Easing} from 'react-native';
import useKeyboardOffsetHeight from '../../../helpers/useKeyboardOffsetHeight';
import getMessageHeightOffset from '../../../helpers/getMessageHeightOffset';
import {FlashList} from '@shopify/flash-list';
import MessageBubble from '../bubble/MessageBubble';
import EmptyComponent from '../empty/EmptyComponent';
import Ionicons from 'react-native-vector-icons/Ionicons';

const windowHeight = Dimensions.get('window').height;

const Chat = ({isTyping, messages, heightOfMessageBox}) => {
  const keyBoardOffsetHeight = useKeyboardOffsetHeight();
  const micPulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(micPulse, {
          toValue: 1.2,
          duration: 600,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(micPulse, {
          toValue: 1,
          duration: 600,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);
  const calculatedHeight = useMemo(() => {
    return (
      windowHeight * 0.76 -
      keyBoardOffsetHeight * 0.95 -
      getMessageHeightOffset(heightOfMessageBox, windowHeight)
    );
  }, [windowHeight, keyBoardOffsetHeight, heightOfMessageBox]);

  const renderMessageBubble = ({item}) => {
    return <MessageBubble message={item} />;
  };
  return (
    <View
      style={{
        height: calculatedHeight,
        paddingBottom: 0,
      }}>
      {messages?.length == 0 ? (
        // <EmptyComponent isTyping={isTyping} />
        // <View style={{flex: 1, justifyContent: 'center'}}>
        //   <Text style={{alignSelf: 'center'}}>
        //     Practice with Interviewin...
        //   </Text>
        // </View>
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <View style={{marginBottom: 20}}>
            <Text
              style={{fontSize: 18, fontWeight: '600', textAlign: 'center'}}>
              Practice speaking out loud{'\n'}with your AI Interviewer
            </Text>
            <Text
              style={{
                fontSize: 14,
                textAlign: 'center',
                marginTop: 8,
                color: '#555',
              }}>
              Tap the mic and start your mock interview
            </Text>
          </View>
          {/* <View
            style={{
              backgroundColor: '#22c063',
              borderRadius: 100,
              padding: 25,
              elevation: 5,
            }}>
            <Text style={{fontSize: 50, color: 'white'}}>🎤</Text>
          </View> */}
          {/* <View
            style={{
              backgroundColor: '#22c063',
              borderRadius: 100,
              padding: 25,
              elevation: 5,
            }}>
            <Ionicons name="mic-circle" size={70} color="white" />
          </View> */}
          <Animated.View
            style={{
              backgroundColor: '#22c063',
              borderRadius: 100,
              padding: 15,
              elevation: 5,
              transform: [{scale: micPulse}],
            }}>
            <Ionicons name="mic-circle" size={70} color="white" />
          </Animated.View>
        </View>
      ) : (
        <FlashList
          indicatorStyle="black"
          data={[...messages].reverse()}
          inverted
          estimatedItemSize={40}
          renderItem={renderMessageBubble}
        />
      )}
    </View>
  );
};

export default Chat;
