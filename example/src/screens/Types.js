import React from 'react';
import {
    View,
    FlatList,
    Text,
    TextInput,
    StyleSheet,
    Alert,
    Keyboard,
    TouchableNativeFeedback,
} from 'react-native';
import moment from 'moment';
import Navigator from 'react-native-navigation/src/Navigation';

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    list: {
        transform: [{ scaleY: -1 }],
    },
    inputContainer: {
        paddingHorizontal: 8,
        paddingVertical: 8,
        height: 100,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    messageInput: {
        fontSize: 16,
        backgroundColor: '#64A640',
        flex: 1,
        paddingHorizontal: 5,
        borderRadius: 2,
        paddingVertical: 0,
    },
    sendButton: {
        height: 30,
        width: 80,
        marginLeft: 10,
        bottom: 0,
    },
    sendButtonTitle: {
        marginTop: -1,
        fontSize: 15,
    },
    messageRow: {
        flexDirection: 'row',
        padding: 16,
        minHeight: 50,
        transform: [{ scaleY: -1 }],
        borderBottomWidth: 1,
    },
    userText: {
        flex: 1,
        fontWeight: '600',
        paddingBottom: 10,
    },
    messageText: {

    },
    timestamp: {

    },
});

export default class Types extends React.Component {
    props: {
        navigator: Navigator,
    };

    _keyboardDidShow = () => {
        this._updateTabs('hidden');
    };

    _keyboardDidHide = () => {
        this._updateTabs('shown');
    };

    _updateTabs = (value) => {
        if (this.props.navigator) {
            this.props.navigator.toggleTabs({
                to: value,
                animated: false,
            });
        }
    };

    _renderRow = (data) => {
        const item = data.item;
        const rowColor = item.userType === 'Admin' ? '#fff7e6' : '#e6eeff';
        const userType = item.userType === 'Admin' ? 'Operations' : 'You';
        const date = moment(item.timestamp).format('MMM D, h:mm A');

        return (
            <View
                key={item.id}
                style={[styles.messageRow, { backgroundColor: rowColor }]}
                shouldComponentUpdate={false}>
                <View
                    style={{
                        flexDirection: 'column',
                        flex: 1,
                    }}>
                    <View
                        style={{
                            flexDirection: 'row',
                            flex: 1,
                        }}>
                        <Text style={styles.userText}>{userType}</Text>
                        <Text style={styles.timestamp}>{date}</Text>
                    </View>
                    <Text style={styles.messageText}>{item.message}</Text>
                </View>
            </View>
        );
    };

    constructor(props) {
        super(props);

        this.minCommentInputHeight = 70;

        this.state = {
            chatMessages: [],
            commentInputHeight: this.minCommentInputHeight,
            isLoading: false,
            commentText: '',
        };
    }

    componentWillMount() {
        Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
        Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
    }

    componentWillUnmount() {
        Keyboard.removeListener('keyboardDidShow', this._keyboardDidShow);
        Keyboard.removeListener('keyboardDidHide', this._keyboardDidHide);
    }

    render() {
        return (
            <View
                style={styles.container}
                behavior={'padding'}
                keyboardVerticalOffset={64}>
                <FlatList
                    data={this.state.chatMessages
                        .sort((a, b) => a.timestamp - b.timestamp)
                        .reverse()}
                    renderItem={this._renderRow}
                    keyExtractor={(item) => item.id}
                    style={styles.list}
                />
                <View style={styles.inputContainer}>
                    <TextInput
                        style={[
                            styles.messageInput,
                            { height: this.state.commentInputHeight },
                        ]}
                        placeholder={'Tap here to bring up software keyboard on Android. Then dismiss keyboard. Tab bar is at top, not bottom.'}
                        autoFocus={false}
                        onChangeText={(commentText) => this.setState({ commentText })}
                        onChange={(e) => {
                            this.setState({
                                commentInputHeight: Math.min(
                                    Math.max(
                                        this.minCommentInputHeight,
                                        e.nativeEvent.contentSize.height,
                                    ),
                                    120,
                                ),
                            });
                        }}
                        underlineColorAndroid={'transparent'}
                        returnKeyType={'done'}
                        multiline
                        blurOnSubmit
                        value={this.state.commentText}
                        onFocus={() => {
                            this._updateTabs('hidden');
                        }}
                    />
                    {/*<TouchableNativeFeedback
                        style={styles.sendButton}
                        title="Send"
                        isLoading={this.state.isLoading}
                        titleStyle={styles.sendButtonTitle}
                        onPress={() => this._sendMessage()}
                    />*/}
                </View>
            </View>
        );
    }
}
