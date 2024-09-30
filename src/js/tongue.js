import React from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
} from 'react-native-reanimated';
import {
    Gesture,
    GestureDetector,
} from 'react-native-gesture-handler';

const { height } = Dimensions.get('window');

const TongueModal = () => {
    const modalHeight = height * 0.9; // Modal covers 90% of screen height
    const snapPoints = [0, modalHeight - 100]; // Open and closed positions
    const translateY = useSharedValue(snapPoints[1]); // Start at the closed position

    const panGesture = Gesture.Pan()
        .onStart(() => {
            // Gesture started
        })
        .onUpdate((event) => {
            translateY.value += event.changeY;

            // Limit the modal's movement within snap points
            if (translateY.value < snapPoints[0]) {
                translateY.value = snapPoints[0];
            } else if (translateY.value > snapPoints[1]) {
                translateY.value = snapPoints[1];
            }
        })
        .onEnd((event) => {
            // Determine whether to open or close the modal based on gesture velocity and position
            const shouldOpen =
                translateY.value < (snapPoints[1] - snapPoints[0]) / 2 ||
                event.velocityY < -1000;

            if (shouldOpen) {
                translateY.value = withSpring(snapPoints[0], { damping: 50 }); // Open modal
            } else {
                translateY.value = withSpring(snapPoints[1], { damping: 50 }); // Close modal
            }
        });

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: translateY.value }],
    }));

    return (
        <Animated.View style={[styles.modal, animatedStyle, { height: modalHeight }]}>
            <GestureDetector gesture={panGesture}>
                <Animated.View style={styles.handle} />
            </GestureDetector>
            {/* Modal Content Goes Here */}
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    modal: {
        position: 'absolute',
        bottom: 100, // Adjust to show part of the modal when closed
        left: 0,
        right: 0,
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        overflow: 'hidden',
    },
    handle: {
        width: 40,
        height: 5,
        borderRadius: 2.5,
        backgroundColor: '#ccc',
        alignSelf: 'center',
        marginVertical: 10,
    },
});

export default TongueModal;
