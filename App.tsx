/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import type {PropsWithChildren} from 'react';
// import Canvas, {CanvasRenderingContext2D as RNCRC2D} from 'react-native-canvas';
import {
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    useColorScheme,
    View,
} from 'react-native';
import WebView from "react-native-webview";

import {
    Colors,
} from 'react-native/Libraries/NewAppScreen';

type SectionProps = PropsWithChildren<{
    title: string;
}>;

function Section({children, title}: SectionProps): React.JSX.Element {
    const isDarkMode = useColorScheme() === 'dark';
    return (
        <View style={styles.sectionContainer}>
            <Text
                style={[
                    styles.sectionTitle,
                    {
                        color: isDarkMode ? Colors.white : Colors.black,
                    },
                ]}>
                {title}
            </Text>
            <Text
                style={[
                    styles.sectionDescription,
                    {
                        color: isDarkMode ? Colors.light : Colors.dark,
                    },
                ]}>
                {children}
            </Text>
        </View>
    );
}


// noinspection HtmlRequiredLangAttribute
const HTML = (id: string = crypto.randomUUID()) => `
    <!DOCTYPE html>
    <html>
    <head>
        <title>Canvas</title>
    </head>
    <body>
    <canvas id="${id}"></canvas>
    <script>
        window.canvas = document.getElementById('${id}');
    </script>
    </body>
    </html>
`;

function App(): React.JSX.Element {

    const isDarkMode = useColorScheme() === 'dark';

    const backgroundStyle = {
        backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    };

    return (
        <SafeAreaView style={backgroundStyle}>
            <StatusBar
                barStyle={isDarkMode ? 'light-content' : 'dark-content'}
                backgroundColor={backgroundStyle.backgroundColor}
            />
            <View
                style={{
                    backgroundColor: isDarkMode ? Colors.black : Colors.white,
                    width: '100%',
                    height: '100%',
                }}>
                <WebView
                    style={{flex: 1, height: '100%', width: '100%', backgroundColor: '#222222'}}
                    ref={() => {
                        console.log('webview')
                    }}
                    source={{uri: 'https://richardtmiles.github.io/GameDefense/#'}}
                    mixedContentMode="always"
                    scalesPageToFit={true}

                />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    sectionContainer: {
        marginTop: 32,
        paddingHorizontal: 24,
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: '600',
    },
    sectionDescription: {
        marginTop: 8,
        fontSize: 18,
        fontWeight: '400',
    },
    highlight: {
        fontWeight: '700',
    },
    canvas: {
        width: '100%',
        height: '100%',
        borderWidth: 1,
        borderBlockColor: 'black',
        borderStyle: 'solid',
    },
});

export default App;
