import React from 'react';
import { Svg, Circle, G } from 'react-native-svg';

const Spinner = ({ size = 100, color = '#000' }) => (
    <Svg width={size} height={size} viewBox="0 0 100 100">
        <G rotation="-90" origin="50,50">
            <Circle
                cx="50"
                cy="50"
                r="45"
                stroke={color}
                strokeWidth="10"
                fill="none"
                strokeLinecap="round"
                strokeDasharray="283"
                strokeDashoffset="0"
            />
        </G>
    </Svg>
);

export default Spinner;
