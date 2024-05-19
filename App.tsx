import React from 'react';
import {
  Dimensions,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import {ScrollList} from './src/ScrollList';

const {width: WINDOW_WIDTH, height: WINDOW_HEIGHT} = Dimensions.get('window');

function App(): React.JSX.Element {
  return (
    <SafeAreaView>
      <StatusBar />
      <ScrollView>
        <View style={styles.root}>
          <View style={styles.container}>
            <ScrollList
              data={[
                {label: 'Item 1', value: 1},
                {label: 'Item 2', value: 2},
                {label: 'Item 3', value: 3},
                {label: 'Item 4', value: 4},
                {label: 'Item 5', value: 5},
                {label: 'Item 6', value: 6},
                {label: 'Item 7', value: 7},
                {label: 'Item 8', value: 8},
                {label: 'Item 9', value: 9},
                {label: 'Item 10', value: 10},
                {label: 'Item 11', value: 11},
                {label: 'Item 12', value: 12},
                {label: 'Item 13', value: 13},
                {label: 'Item 14', value: 14},
                {label: 'Item 15', value: 15},
                {label: 'Item 16', value: 16},
                {label: 'Item 17', value: 17},
                {label: 'Item 18', value: 18},
                {label: 'Item 19', value: 19},
                {label: 'Item 20', value: 20},
              ]}
              centered
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    width: WINDOW_WIDTH,
    height: WINDOW_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  container: {
    width: '100%',
    backgroundColor: 'rgba(0, 0, 255, 0.1)',
    height: 220,
  },
});

export default App;
