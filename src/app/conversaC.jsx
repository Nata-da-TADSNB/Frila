import colors from "@/constants/Colors";
import Ionicons from "@expo/vector-icons/build/Ionicons";
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import {
    ActionSheetIOS,
    Alert,
    Image,
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

const MessageBubble = ({ message, isMe }) => (
    <View style={[
        styles.messageWrapper,
        isMe ? styles.myMessageWrapper : styles.otherMessageWrapper
    ]}>
        {message.type === 'image' && message.uri ? (
            <View style={[
                styles.messageBubble,
                isMe ? styles.myBubble : styles.otherBubble,
                styles.imageBubble
            ]}>
                <Image source={{ uri: message.uri }} style={styles.messageImage} />
                <Text style={styles.messageTime}>{message.time}</Text>
            </View>
        ) : message.type === 'text' && message.text ? (
            <View style={[
                styles.messageBubble,
                isMe ? styles.myBubble : styles.otherBubble
            ]}>
                <Text style={[
                    styles.messageText,
                    isMe ? styles.myMessageText : styles.otherMessageText
                ]}>
                    {message.text}
                </Text>
                <Text style={styles.messageTime}>{message.time}</Text>
            </View>
        ) : null}
    </View>
);

const ProposalMessage = ({ proposal, onPayPress }) => (
    <View style={[styles.messageWrapper, styles.otherMessageWrapper]}>
        <View style={[styles.proposalBubble]}>
            <Text style={styles.proposalTitle}>PROPOSTA RECEBIDA</Text>

            <View style={styles.proposalValueRow}>
                <Text style={styles.proposalLabel}>Valor:</Text>
                <View style={styles.proposalValueContainer}>
                    <Ionicons name="cash-outline" size={20} color={colors.marrom} />
                    <Text style={styles.proposalValue}>R${proposal.value},00</Text>
                </View>
            </View>

            <Text style={styles.proposalDescription}>
                {proposal.description}
            </Text>

            {proposal.status === 'pending' && (
                <>
                    <TouchableOpacity style={styles.payButton} onPress={onPayPress}>
                        <Ionicons name="card-outline" size={18} color={colors.creme} />
                        <Text style={styles.payButtonText}>PAGAR</Text>
                    </TouchableOpacity>
                    <View style={styles.proposalStatus}>
                        <Ionicons name="time-outline" size={16} color={colors.dourado} />
                        <Text style={styles.proposalStatusText}>Aguardando pagamento</Text>
                    </View>
                </>
            )}
            {proposal.status === 'accepted' && (
                <View style={[styles.proposalStatus, styles.proposalStatusAccepted]}>
                    <Ionicons name="checkmark-circle-outline" size={16} color={colors.creme} />
                    <Text style={styles.proposalStatusText}>Pagamento confirmado</Text>
                </View>
            )}

            <Text style={styles.proposalTime}>{proposal.time}</Text>
        </View>
    </View>
);

export default function ChatComprador() {
    const router = useRouter();
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([
        {
            id: 1,
            text: "Olá, tudo bem?",
            time: "10:30",
            isMe: false,
            type: "text"
        },
        {
            id: 2,
            text: "Tudo ótimo! Como posso ajudar?",
            time: "10:31",
            isMe: true,
            type: "text"
        },
        {
            id: 3,
            type: "proposal",
            proposal: {
                value: 100,
                description: "Se estiver de acordo com o valor apresentado, realiza o pagamento da respectiva alíquota do total abaixo.",
                time: "10:32",
                status: 'pending'
            },
            isMe: false,
            time: "10:32"
        }
    ]);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [selectedProposalId, setSelectedProposalId] = useState(null);
    const scrollViewRef = useRef(null);

    const getCurrentTime = () => {
        const now = new Date();
        return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    };

    const handleSendMessage = () => {
        if (message.trim()) {
            const newMessage = {
                id: messages.length + 1,
                text: message.trim(),
                time: getCurrentTime(),
                isMe: true,
                type: "text"
            };
            setMessages(prevMessages => [...prevMessages, newMessage]);
            setMessage("");

            setTimeout(() => {
                scrollViewRef.current?.scrollToEnd({ animated: true });
            }, 100);
        }
    };

    const handleAttachPress = () => {
        if (Platform.OS === 'ios') {
            ActionSheetIOS.showActionSheetWithOptions(
                {
                    options: ['Cancelar', 'Tirar Foto', 'Escolher da Galeria'],
                    cancelButtonIndex: 0,
                },
                (buttonIndex) => {
                    if (buttonIndex === 1) {
                        openCamera();
                    } else if (buttonIndex === 2) {
                        openImagePicker();
                    }
                }
            );
        } else {
            Alert.alert(
                'Anexar Foto',
                'Escolha uma opção',
                [
                    { text: 'Cancelar', style: 'cancel' },
                    { text: 'Tirar Foto', onPress: openCamera },
                    { text: 'Escolher da Galeria', onPress: openImagePicker },
                ]
            );
        }
    };

    const openCamera = async () => {
        try {
            const { status } = await ImagePicker.requestCameraPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permissão necessária', 'Precisamos de acesso à câmera para tirar fotos.');
                return;
            }

            const result = await ImagePicker.launchCameraAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                quality: 0.8,
                base64: false,
            });

            if (!result.canceled && result.assets && result.assets[0]) {
                const newMessage = {
                    id: messages.length + 1,
                    type: "image",
                    uri: result.assets[0].uri,
                    time: getCurrentTime(),
                    isMe: true
                };
                setMessages(prevMessages => [...prevMessages, newMessage]);
                setTimeout(() => {
                    scrollViewRef.current?.scrollToEnd({ animated: true });
                }, 100);
            }
        } catch (error) {
            console.log('Erro ao abrir câmera:', error);
            Alert.alert('Erro', 'Não foi possível abrir a câmera.');
        }
    };

    const openImagePicker = async () => {
        try {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permissão necessária', 'Precisamos de acesso à galeria para selecionar imagens.');
                return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                quality: 0.8,
                base64: false,
            });

            if (!result.canceled && result.assets && result.assets[0]) {
                const newMessage = {
                    id: messages.length + 1,
                    type: "image",
                    uri: result.assets[0].uri,
                    time: getCurrentTime(),
                    isMe: true
                };
                setMessages(prevMessages => [...prevMessages, newMessage]);
                setTimeout(() => {
                    scrollViewRef.current?.scrollToEnd({ animated: true });
                }, 100);
            }
        } catch (error) {
            console.log('Erro ao abrir galeria:', error);
            Alert.alert('Erro', 'Não foi possível acessar a galeria.');
        }
    };

    const handlePayPress = (messageId) => {
        setSelectedProposalId(messageId);
        setShowConfirmModal(true);
    };

    const handleConfirmPayment = () => {
        setMessages(prevMessages =>
            prevMessages.map(msg => {
                if (msg.id === selectedProposalId && msg.type === 'proposal') {
                    return {
                        ...msg,
                        proposal: {
                            ...msg.proposal,
                            status: 'accepted'
                        }
                    };
                }
                return msg;
            })
        );

        setShowConfirmModal(false);
        Alert.alert("Sucesso", "Pagamento realizado com sucesso!");
    };

    const selectedProposal = messages.find(msg => msg.id === selectedProposalId && msg.type === 'proposal')?.proposal;

    return (
        <View style={{ flex: 1, backgroundColor: colors.creme }}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={colors.marrom} />
                </TouchableOpacity>

                <View style={styles.headerInfo}>
                    <Image
                        source={require("@/assets/img/FOTOFREELANCER.png")}
                        style={styles.headerAvatar}
                    />
                    <View style={styles.headerText}>
                        <Text style={styles.headerName}>Marlon Caio</Text>
                        <View style={styles.headerRating}>
                            <Ionicons name="star" size={14} color={colors.dourado} />
                            <Text style={styles.headerRatingText}>4.5</Text>
                        </View>
                    </View>
                </View>

                <TouchableOpacity style={styles.supportButton}>
                    <Ionicons name="headset-outline" size={24} color={colors.marrom} />
                </TouchableOpacity>
            </View>

            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
            >
                <ScrollView
                    ref={scrollViewRef}
                    style={styles.messagesContainer}
                    contentContainerStyle={styles.messagesContent}
                    showsVerticalScrollIndicator={false}
                    onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
                >
                    {messages.map((msg) => (
                        msg.type === "proposal" && msg.proposal ? (
                            <ProposalMessage
                                key={msg.id}
                                proposal={msg.proposal}
                                onPayPress={() => handlePayPress(msg.id)}
                            />
                        ) : (
                            <MessageBubble
                                key={msg.id}
                                message={msg}
                                isMe={msg.isMe}
                            />
                        )
                    ))}
                </ScrollView>

                <View style={styles.inputArea}>
                    <TouchableOpacity
                        style={styles.attachButton}
                        onPress={handleAttachPress}
                    >
                        <Ionicons name="camera-outline" size={24} color={colors.marrom} />
                    </TouchableOpacity>

                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="Mensagem"
                            placeholderTextColor={colors.cinza}
                            value={message}
                            onChangeText={setMessage}
                            multiline
                            maxLength={500}
                            onSubmitEditing={handleSendMessage}
                        />
                    </View>

                    <TouchableOpacity
                        style={[
                            styles.sendButton,
                            !message.trim() && styles.sendButtonDisabled
                        ]}
                        onPress={handleSendMessage}
                        disabled={!message.trim()}
                    >
                        <Ionicons
                            name="send"
                            size={20}
                            color={message.trim() ? colors.creme : colors.cinza}
                        />
                    </TouchableOpacity>
                </View>

                <Modal
                    visible={showConfirmModal}
                    transparent
                    animationType="fade"
                    onRequestClose={() => setShowConfirmModal(false)}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.confirmationModal}>
                            <View style={styles.modalHeader}>
                                <Ionicons name="card-outline" size={32} color={colors.marrom} />
                                <Text style={styles.confirmationTitle}>CONFIRMAÇÃO DE PAGAMENTO</Text>
                            </View>

                            <View style={styles.confirmationValueContainer}>
                                <Ionicons name="cash-outline" size={24} color={colors.marrom} />
                                <Text style={styles.confirmationValue}>
                                    R${selectedProposal?.value || '100'},00
                                </Text>
                            </View>

                            <Text style={styles.confirmationText}>
                                Confirmar o pagamento deste valor para o freelancer?
                            </Text>

                            <View style={styles.modalActions}>
                                <TouchableOpacity
                                    style={styles.cancelButton}
                                    onPress={() => setShowConfirmModal(false)}
                                >
                                    <Text style={styles.cancelButtonText}>Cancelar</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.confirmButton}
                                    onPress={handleConfirmPayment}
                                >
                                    <Ionicons name="checkmark-outline" size={18} color={colors.creme} />
                                    <Text style={styles.confirmButtonText}>PAGAR</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        paddingVertical: 12,
        backgroundColor: colors.bege,
        borderBottomWidth: 1,
        borderBottomColor: colors.marromClaro,
    },
    backButton: {
        padding: 5,
    },
    headerInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        marginLeft: 10,
    },
    headerAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
    },
    headerText: {
        justifyContent: 'center',
    },
    headerName: {
        fontSize: 16,
        fontFamily: 'KohoMedium',
        color: colors.marrom,
        marginBottom: 2,
    },
    headerRating: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    headerRatingText: {
        fontSize: 14,
        fontFamily: 'KohoRegular',
        color: colors.cinza,
    },
    supportButton: {
        padding: 5,
    },
    messagesContainer: {
        flex: 1,
        paddingHorizontal: 15,
    },
    messagesContent: {
        paddingVertical: 20,
        gap: 15,
    },
    messageWrapper: {
        width: '100%',
        marginBottom: 5,
    },
    myMessageWrapper: {
        alignItems: 'flex-end',
    },
    otherMessageWrapper: {
        alignItems: 'flex-start',
    },
    messageBubble: {
        maxWidth: '75%',
        padding: 12,
        borderRadius: 15,
    },
    myBubble: {
        backgroundColor: colors.marromClaro,
        borderBottomRightRadius: 5,
    },
    otherBubble: {
        backgroundColor: colors.bege,
        borderBottomLeftRadius: 5,
    },
    imageBubble: {
        padding: 5,
        backgroundColor: 'transparent',
    },
    messageText: {
        fontSize: 14,
        fontFamily: 'KohoRegular',
        marginBottom: 4,
        lineHeight: 18,
    },
    myMessageText: {
        color: colors.creme,
    },
    otherMessageText: {
        color: colors.preto,
    },
    messageTime: {
        fontSize: 10,
        fontFamily: 'KohoLight',
        color: colors.cinza,
        alignSelf: 'flex-end',
        marginTop: 4,
    },
    messageImage: {
        width: 200,
        height: 200,
        borderRadius: 10,
        marginBottom: 4,
    },
    proposalBubble: {
        maxWidth: '85%',
        padding: 15,
        borderRadius: 15,
        backgroundColor: colors.bege,
        borderWidth: 1,
        borderColor: colors.marromClaro,
    },
    proposalTitle: {
        fontSize: 14,
        fontFamily: 'KohoBold',
        color: colors.marrom,
        marginBottom: 10,
    },
    proposalValueRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 10,
    },
    proposalLabel: {
        fontSize: 14,
        fontFamily: 'KohoRegular',
        color: colors.cinza,
    },
    proposalValueContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    proposalValue: {
        fontSize: 18,
        fontFamily: 'KohoBold',
        color: colors.marrom,
    },
    proposalDescription: {
        fontSize: 13,
        fontFamily: 'KohoLight',
        color: colors.cinza,
        marginBottom: 15,
        lineHeight: 18,
    },
    payButton: {
        backgroundColor: colors.marrom,
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 8,
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 8,
    },
    payButtonText: {
        color: colors.creme,
        fontSize: 14,
        fontFamily: 'KohoBold',
    },
    proposalStatus: {
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 5,
        alignSelf: 'flex-start',
        marginBottom: 10,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: colors.bege,
    },
    proposalStatusAccepted: {
        backgroundColor: colors.verde,
    },
    proposalStatusText: {
        color: colors.dourado,
        fontSize: 12,
        fontFamily: 'KohoMedium',
    },
    proposalTime: {
        fontSize: 10,
        fontFamily: 'KohoLight',
        color: colors.cinza,
        alignSelf: 'flex-end',
    },
    inputArea: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        paddingHorizontal: 10,
        paddingVertical: 8,
        backgroundColor: colors.bege,
        borderTopWidth: 1,
        borderTopColor: colors.marromClaro,
        gap: 8,
    },
    attachButton: {
        padding: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    inputContainer: {
        flex: 1,
        backgroundColor: colors.creme,
        borderRadius: 20,
        paddingHorizontal: 15,
        paddingVertical: 8,
        maxHeight: 100,
        minHeight: 40,
    },
    input: {
        fontFamily: 'KohoRegular',
        fontSize: 14,
        color: colors.preto,
        padding: 0,
        margin: 0,
    },
    sendButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: colors.marrom,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 0,
    },
    sendButtonDisabled: {
        backgroundColor: colors.marromClaro,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalHeader: {
        alignItems: 'center',
        marginBottom: 15,
    },
    confirmationModal: {
        width: '85%',
        backgroundColor: colors.creme,
        borderRadius: 15,
        padding: 25,
    },
    confirmationTitle: {
        fontSize: 18,
        fontFamily: 'KohoBold',
        color: colors.marrom,
        textAlign: 'center',
        marginTop: 8,
        marginBottom: 15,
    },
    confirmationValueContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        marginBottom: 15,
    },
    confirmationValue: {
        fontSize: 24,
        fontFamily: 'KohoBold',
        color: colors.marrom,
    },
    confirmationText: {
        fontSize: 14,
        fontFamily: 'KohoRegular',
        color: colors.cinza,
        textAlign: 'center',
        marginBottom: 25,
        lineHeight: 20,
    },
    modalActions: {
        flexDirection: 'row',
        gap: 12,
    },
    cancelButton: {
        flex: 1,
        padding: 14,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: colors.marromClaro,
        alignItems: 'center',
    },
    cancelButtonText: {
        color: colors.cinza,
        fontSize: 14,
        fontFamily: 'KohoMedium',
    },
    confirmButton: {
        flex: 1,
        backgroundColor: colors.marrom,
        padding: 14,
        borderRadius: 8,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 8,
    },
    confirmButtonText: {
        color: colors.creme,
        fontSize: 14,
        fontFamily: 'KohoBold',
    },
});