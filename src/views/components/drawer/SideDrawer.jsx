import {View, StyleSheet, TouchableOpacity, FlatList} from 'react-native';
import React from 'react';
import Modal from 'react-native-modal';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Image} from 'react-native-elements';
import CustomText from '../text/CustomText';
import Icon from 'react-native-vector-icons/Ionicons';
import {RFValue} from 'react-native-responsive-fontsize';
import {useDispatch} from 'react-redux';
import uuid from 'react-native-uuid';
import {
  clearAllChats,
  createNewChat,
  deleteChat,
} from '../../../redux/reducers/chatSlice';

const SideDrawer = ({
  setCurrentChatId,
  chats,
  onPressHide,
  visible,
  currentChatId,
}) => {
  const dispatch = useDispatch();

  const addNewChat = async () => {
    dispatch(
      createNewChat({
        chatId: uuid.v4(),
        messages: [],
        summary: 'New Chat',
      }),
    );
  };
  const onClearAllChat = async () => {
    dispatch(clearAllChats());
  };

  const deleteAChat = async id => {
    dispatch(deleteChat({chatId: id}));
  };
  const renderChats = ({item}) => {
    return (
      <TouchableOpacity
        onPress={() => {
          setCurrentChatId(item.id);
          onPressHide();
        }}
        style={[
          styles.chatBtn,
          {
            backgroundColor: currentChatId == item.id ? '#041e49' : '#131314',
          },
        ]}>
        <CustomText
          numberOfLines={1}
          style={{width: '70%'}}
          size={RFValue(11)}
          fontWeight="500">
          {item.summary}
        </CustomText>

        <TouchableOpacity
          onPress={() => {
            deleteAChat(item.id);
          }}
          style={styles.trashIcon}>
          <Icon color="white" size={RFValue(12)} name="trash-outline" />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      style={styles.bottomModalView}
      isVisible={visible}
      backdropColor="black"
      backdropOpacity={0.5}
      onBackdropPress={onPressHide}
      onBackButtonPress={onPressHide}
      animationIn="slideInLeft"
      animationOut="slideOutLeft">
      <SafeAreaView>
        <View style={styles.modalContainer}>
          <View style={{height: '100%', width: '100%'}}>
            <View style={styles.header}>
              <View style={styles.flexRow}>
                <Image
                  source={require('../../../assets/logo_t.png')}
                  style={{height: 30, width: 30}}
                />
                <CustomText size={RFValue(14)} opacity={0.8} fontWeight="600">
                  All Chats
                </CustomText>
              </View>
              <TouchableOpacity onPress={onPressHide}>
                <Icon
                  name="close-circle-outline"
                  size={RFValue(18)}
                  color="#ccc"
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.newChat} onPress={addNewChat}>
              <CustomText size={RFValue(10)}>Add new chat</CustomText>
            </TouchableOpacity>

            <CustomText style={{margin: 10, fontsize: RFValue(12)}}>
              Recent
            </CustomText>

            <View style={{height: '60%'}}>
              <FlatList
                data={[...chats].reverse()}
                renderItem={renderChats}
                key={item => item.id}
                keyExtractor={item => item.id}
                contentContainerStyle={{
                  paddingHorizontal: 5,
                  paddingVertical: 10,
                }}
              />
            </View>

            <TouchableOpacity
              style={styles.clearAllChats}
              onPress={onClearAllChat}>
              <CustomText fontWeight="500" size={RFValue(10)}>
                Clear All Chats
              </CustomText>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  bottomModalView: {
    justifyContent: 'flex-end',
    width: '70%',
    margin: 10,
  },
  modalContainer: {
    backgroundColor: '#171717',
    borderRadius: 20,
    overflow: 'hidden',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderColor: 'grey',
  },
  flexRow: {
    gap: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  newChat: {
    backgroundColor: '#272a2c',
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
    width: '60%',
    margin: 10,
    alignSelf: 'center',
  },
  clearAllChats: {
    backgroundColor: '#ef4444',
    padding: 10,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 20,
  },
  chatBtn: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 8,
  },
  trashIcon: {
    padding: 5,
    backdropColor: 'white',
    borderRadius: 20,
  },
});

export default SideDrawer;
