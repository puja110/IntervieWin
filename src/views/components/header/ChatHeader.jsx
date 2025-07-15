import React from 'react';
import {
  View,
  StyleSheet,
  Platform,
  StatusBar,
  TouchableOpacity,
  Text,
} from 'react-native';
import {useDispatch} from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import {clearChat} from '../../../redux/reducers/chatSlice';

const BudgetBotHeader = ({currentChatId}) => {
  const dispatch = useDispatch();

  const onClearChats = () => {
    dispatch(clearChat({chatId: currentChatId}));
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerTop}>
        <Text style={styles.headerTitle}>IntervieWin</Text>
        <TouchableOpacity onPress={onClearChats}>
          <Icon name="close" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 40,
  },
  headerTop: {
    backgroundColor: 'green',
    paddingHorizontal: 20,
    height: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  tabRow: {
    flexDirection: 'row',
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },
  inactiveTextStyle: {
    color: '#000000',
    alignSelf: 'center',
    padding: 13,
  },
  activeTextStyle: {
    color: '#2a6be4',
    alignSelf: 'center',
    padding: 13,
    fontWeight: 'bold',
    fontSize: 14,
  },
  inactiveTabStyle: {
    flex: 1,
  },
  activeTabStyle: {
    flex: 1,
    backgroundColor: '#ffffff',
    zIndex: 1,
    elevation: 1,
    padding: 5,
  },
});

export default BudgetBotHeader;
