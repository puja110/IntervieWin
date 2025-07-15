// import React, {useEffect} from 'react';
// import {Text, View, PermissionsAndroid, Platform} from 'react-native';
// import {PorcupineManager} from '@picovoice/porcupine-react-native';
// console.log('PorcupineManager init:', PorcupineManager);
// const accessKey = 'Z+4tSN/yLaqxctCgBeNNNJYfUM2Tw5WXucWwJQinMqpAwrN1I1Yf+A=='; // Get this from Picovoice Console

// const VoiceListener = () => {
//   useEffect(() => {
//     const initPorcupine = async () => {
//       if (Platform.OS === 'android') {
//         const granted = await PermissionsAndroid.request(
//           PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
//         );
//         if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
//           console.warn('Microphone permission not granted');
//           return;
//         }
//       }

//       try {
//         const manager = await PorcupineManager.fromKeywordPaths(
//           accessKey,
//           // ['hey_assistbot_android.ppn'],
//           ['Jarvis_en_android_v3_0_0.ppn'],
//           keywordIndex => {
//             console.log('Wake word detected at index:', keywordIndex);
//           },
//         );
//         await manager.start();
//         console.log('🎤 Wake word listener started');
//       } catch (e) {
//         console.error('🔥 Porcupine startup failed:', e);
//       }

//       return () => {
//         porcupineManager?.stop();
//         porcupineManager?.delete();
//       };
//     };

//     initPorcupine();
//   }, []);

//   return (
//     <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
//       <Text>Say "Hey Jarvis" to test wake word</Text>
//     </View>
//   );
// };

// export default VoiceListener;
