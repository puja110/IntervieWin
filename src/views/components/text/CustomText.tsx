import React from 'react';
import {Text, TextStyle} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';

// Define types for props
interface CustomTextProps {
  children: React.ReactNode;
  size?: number;
  color?: string;
  opacity?: number;
  fontWeight?:
    | 'normal'
    | 'bold'
    | '100'
    | '200'
    | '300'
    | '400'
    | '500'
    | '600'
    | '700'
    | '800'
    | '900';
  style?: TextStyle;
}

const CustomText: React.FC<CustomTextProps> = ({
  children,
  size = RFValue(12),
  color = 'white',
  opacity = 1,
  fontWeight = 'normal',
  style,
  ...props
}) => {
  return (
    <Text
      style={{fontSize: size, color, opacity, fontWeight, ...style}}
      {...props}>
      {children}
    </Text>
  );
};

export default CustomText;
