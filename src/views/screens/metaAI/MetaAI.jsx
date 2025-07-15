import React, {useState} from 'react';
import {StyleSheet, ImageBackground, View} from 'react-native';
import WABG from '../../../assets/w_bg.png';
import BudgetBotHeader from '../../components/header/ChatHeader';
import {useDispatch, useSelector} from 'react-redux';
import {
  changeCurrentChatId,
  selectChats,
  selectCurrentChatId,
} from '../../../redux/reducers/chatSlice';
import SendButton from '../../components/button/SendButton';
import Chat from '../../components/chat/Chat';

const MetaAI = () => {
  const dispatch = useDispatch();
  const chats = useSelector(selectChats);
  const currentChatId = useSelector(selectCurrentChatId);
  const [isTyping, setIsTyping] = useState(false);
  const [heightOfMessageBox, setHeightOfMessageBox] = useState(0);

  const setCurrentChatId = id => {
    dispatch(changeCurrentChatId({chatId: id}));
  };

  return (
    <View style={styles.container}>
      <BudgetBotHeader
        chats={chats}
        currentChatId={currentChatId}
        setCurrentChatId={id => setCurrentChatId(id)}
      />

      <Chat
        isTyping={isTyping}
        heightOfMessageBox={heightOfMessageBox}
        messages={chats?.find(chat => chat.id == currentChatId)?.messages || []}
      />

      <View style={styles.contentContainer}>
        <SendButton
          isTyping={isTyping}
          setHeightOfMessageBox={setHeightOfMessageBox}
          heightOfMessageBox={heightOfMessageBox}
          setIsTyping={setIsTyping}
          currentChatId={currentChatId}
          setCurrentChatId={id => setCurrentChatId(id)}
          length={
            chats?.find(chat => chat.id == currentChatId)?.messages?.length ||
            [].length
          }
          messages={
            chats?.find(chat => chat.id == currentChatId)?.messages || []
          }
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
});

export default MetaAI;
