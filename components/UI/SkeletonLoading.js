import React from 'react'
import { StyleSheet, View } from 'react-native';

const SkeletonLoader = () => {
    return (
      <View style={styles.skeletonItemWrapper}>
        <View style={styles.skeletonImage} />
        <View style={styles.skeletonContentWrapper}>
          <View style={[styles.skeletonText, { width: '80%', marginBottom: 6 }]} />
          <View style={[styles.skeletonText, { width: '60%' }]} />
        </View>
      </View>
    );
  };

  const styles = StyleSheet.create({
    skeletonItemWrapper: {
      flexDirection: "row",
      paddingHorizontal: 16,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderColor: "#ddd",
    },
    skeletonImage: {
      width: 50,
      height: 50,
      marginRight: 16,
      backgroundColor: '#eee', 
    },
    skeletonContentWrapper: {
      flex: 1,
      justifyContent: "space-around",
    },
    skeletonText: {
      backgroundColor: '#eee',
      height: 16,
      borderRadius: 8,
    },
  });

  export default SkeletonLoader;
