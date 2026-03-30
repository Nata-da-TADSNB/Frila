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

const FreelancerProposalMessage = ({ proposal, isMe }) => (
    <View style={[styles.messageWrapper, isMe ? styles.myMessageWrapper : styles.otherMessageWrapper]}>
        <View style={[styles.proposalBubble, isMe && styles.myProposalBubble]}>
            <Text style={[styles.proposalTitle, isMe && styles.myProposalTitle]}>MINHA PROPOSTA</Text>

            <View style={styles.proposalValueRow}>
                <Text style={[styles.proposalLabel, isMe && styles.myProposalText]}>Valor:</Text>
                <View style={styles.proposalValueContainer}>
                    <Ionicons
                        name="cash-outline"
                        size={20}
                        color={isMe ? colors.creme : colors.marrom}
                    />
                    <Text style={[styles.proposalValue, isMe && styles.myProposalValue]}>
                        R${proposal.value},00
                    </Text>
                </View>
            </View>

            <Text style={[styles.proposalDescription, isMe && styles.myProposalText]}>
                {proposal.description}
            </Text>

            {proposal.status === 'pending' && (
                <View style={styles.proposalStatus}>
                    <Ionicons name="time-outline" size={16} color={colors.creme} />
                    <Text style={styles.proposalStatusText}>Aguardando pagamento</Text>
                </View>
            )}
            {proposal.status === 'accepted' && (
                <View style={[styles.proposalStatus, styles.proposalStatusAccepted]}>
                    <Ionicons name="checkmark-circle-outline" size={16} color={colors.creme} />
                    <Text style={styles.proposalStatusText}>Proposta aceita</Text>
                </View>
            )}

            <Text style={styles.proposalTime}>{proposal.time}</Text>
        </View>
    </View>
);

export default function ChatFreelancer() {
    const router = useRouter();
    const [message, setMessage] = useState("");
    const [showProposalModal, setShowProposalModal] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [proposalValue, setProposalValue] = useState("");
    const [proposalDescription, setProposalDescription] = useState("");
    const [messages, setMessages] = useState([
        {
            id: 1,
            text: "Olá, estou interessado no seu serviço",
            time: "10:30",
            isMe: false,
            type: "text"
        },
        {
            id: 2,
            text: "Ótimo! Podemos conversar sobre os detalhes?",
            time: "10:31",
            isMe: true,
            type: "text"
        }
    ]);
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

    const handleSendProposal = () => {
        if (proposalValue && proposalDescription) {
            setShowProposalModal(false);
            setShowConfirmModal(true);
        } else {
            Alert.alert("Atenção", "Preencha o valor e a descrição da proposta");
        }
    };

    const handleConfirmProposal = () => {
        const value = parseFloat(proposalValue);

        const newProposal = {
            id: messages.length + 1,
            type: "proposal",
            proposal: {
                value: value,
                description: proposalDescription,
                time: getCurrentTime(),
                status: 'pending'
            },
            isMe: true,
            time: getCurrentTime()
        };

        setMessages(prevMessages => [...prevMessages, newProposal]);
        setShowConfirmModal(false);
        setProposalValue("");
        setProposalDescription("");

        setTimeout(() => {
            scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 100);

        Alert.alert("Sucesso", "Proposta enviada com sucesso!");
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

    const calculateDiscountedValue = () => {
        const value = parseFloat(proposalValue) || 0;
        return (value * 0.9).toFixed(2);
    };

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
                        <Text style={styles.headerName}>João Cliente</Text>
                        <View style={styles.headerRating}>
                            <Ionicons name="star" size={14} color={colors.dourado} />
                            <Text style={styles.headerRatingText}>4.8</Text>
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
                            <FreelancerProposalMessage
                                key={msg.id}
                                proposal={msg.proposal}
                                isMe={msg.isMe}
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
                        style={styles.proposalButton}
                        onPress={() => setShowProposalModal(true)}
                    >
                        <Ionicons name="cash-outline" size={20} color={colors.creme} />
                    </TouchableOpacity>

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
                    visible={showProposalModal}
                    transparent
                    animationType="fade"
                    onRequestClose={() => setShowProposalModal(false)}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.proposalModal}>
                            <View style={styles.modalHeader}>
                                <Ionicons name="cash-outline" size={32} color={colors.marrom} />
                                <Text style={styles.proposalModalTitle}>ENVIAR PROPOSTA</Text>
                            </View>

                            <Text style={styles.proposalModalSubtitle}>
                                Você deseja enviar o valor da proposta? coloque o valor abaixo:
                            </Text>

                            <View style={styles.valueInputContainer}>
                                <Ionicons name="cash-outline" size={24} color={colors.marrom} />
                                <TextInput
                                    style={styles.valueInput}
                                    placeholder="100,00"
                                    placeholderTextColor={colors.cinza}
                                    value={proposalValue}
                                    onChangeText={setProposalValue}
                                    keyboardType="numeric"
                                />
                            </View>

                            <TextInput
                                style={styles.descriptionInput}
                                placeholder="Descreva sua proposta..."
                                placeholderTextColor={colors.cinza}
                                value={proposalDescription}
                                onChangeText={setProposalDescription}
                                multiline
                                numberOfLines={3}
                            />

                            {proposalValue ? (
                                <View style={styles.discountContainer}>
                                    <Text style={styles.discountText}>
                                        Valor total a receber:
                                    </Text>
                                    <View style={styles.discountRow}>
                                        <Text style={styles.originalValue}>R${proposalValue}</Text>
                                        <Text style={styles.discountPercentage}>-10%</Text>
                                    </View>
                                    <View style={styles.discountedValueContainer}>
                                        <Ionicons name="cash-outline" size={28} color={colors.marrom} />
                                        <Text style={styles.discountedValue}>
                                            R${calculateDiscountedValue()}
                                        </Text>
                                    </View>
                                </View>
                            ) : null}

                            <View style={styles.modalActions}>
                                <TouchableOpacity
                                    style={styles.cancelButton}
                                    onPress={() => {
                                        setShowProposalModal(false);
                                        setProposalValue("");
                                        setProposalDescription("");
                                    }}
                                >
                                    <Text style={styles.cancelButtonText}>Cancelar</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.confirmButton}
                                    onPress={handleSendProposal}
                                >
                                    <Ionicons name="send-outline" size={18} color={colors.creme} />
                                    <Text style={styles.confirmButtonText}>ENVIAR</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>

                <Modal
                    visible={showConfirmModal}
                    transparent
                    animationType="fade"
                    onRequestClose={() => setShowConfirmModal(false)}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.confirmationModal}>
                            <View style={styles.modalHeader}>
                                <Ionicons name="alert-circle-outline" size={32} color={colors.marrom} />
                                <Text style={styles.confirmationTitle}>CONFIRMAÇÃO</Text>
                            </View>

                            <View style={styles.confirmationValueContainer}>
                                <Ionicons name="cash-outline" size={24} color={colors.marrom} />
                                <Text style={styles.confirmationValue}>
                                    R${proposalValue},00
                                </Text>
                            </View>

                            <Text style={styles.confirmationText}>
                                confirmo o valor para prosseguir com o envio da proposta.
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
                                    onPress={handleConfirmProposal}
                                >
                                    <Ionicons name="checkmark-outline" size={18} color={colors.creme} />
                                    <Text style={styles.confirmButtonText}>CONFIRMAR</Text>
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
    myProposalBubble: {
        backgroundColor: colors.marromClaro,
        borderColor: colors.marrom,
    },
    proposalTitle: {
        fontSize: 14,
        fontFamily: 'KohoBold',
        color: colors.marrom,
        marginBottom: 10,
    },
    myProposalTitle: {
        color: colors.creme,
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
    myProposalValue: {
        color: colors.creme,
    },
    myProposalText: {
        color: colors.creme,
    },
    proposalDescription: {
        fontSize: 13,
        fontFamily: 'KohoLight',
        color: colors.cinza,
        marginBottom: 15,
        lineHeight: 18,
    },
    proposalStatus: {
        backgroundColor: colors.dourado,
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 5,
        alignSelf: 'flex-start',
        marginBottom: 10,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    proposalStatusAccepted: {
        backgroundColor: colors.verde,
    },
    proposalStatusText: {
        color: colors.creme,
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
    proposalButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: colors.marrom,
        justifyContent: 'center',
        alignItems: 'center',
    },
    sendButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: colors.marrom,
        justifyContent: 'center',
        alignItems: 'center',
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
    proposalModal: {
        width: '85%',
        backgroundColor: colors.creme,
        borderRadius: 15,
        padding: 25,
    },
    proposalModalTitle: {
        fontSize: 18,
        fontFamily: 'KohoBold',
        color: colors.marrom,
        textAlign: 'center',
        marginTop: 8,
    },
    proposalModalSubtitle: {
        fontSize: 14,
        fontFamily: 'KohoRegular',
        color: colors.cinza,
        textAlign: 'center',
        marginBottom: 20,
    },
    valueInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.marromClaro,
        borderRadius: 8,
        paddingHorizontal: 15,
        marginBottom: 15,
        gap: 10,
    },
    valueInput: {
        flex: 1,
        fontSize: 18,
        fontFamily: 'KohoBold',
        color: colors.preto,
        paddingVertical: 12,
    },
    descriptionInput: {
        borderWidth: 1,
        borderColor: colors.marromClaro,
        borderRadius: 8,
        padding: 15,
        fontSize: 14,
        fontFamily: 'KohoRegular',
        color: colors.preto,
        textAlignVertical: 'top',
        marginBottom: 20,
        minHeight: 80,
    },
    discountContainer: {
        backgroundColor: colors.bege,
        padding: 15,
        borderRadius: 8,
        marginBottom: 20,
        alignItems: 'center',
    },
    discountText: {
        fontSize: 14,
        fontFamily: 'KohoRegular',
        color: colors.cinza,
        marginBottom: 10,
    },
    discountRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 10,
    },
    originalValue: {
        fontSize: 16,
        fontFamily: 'KohoRegular',
        color: colors.cinza,
        textDecorationLine: 'line-through',
    },
    discountPercentage: {
        fontSize: 16,
        fontFamily: 'KohoBold',
        color: colors.marrom,
    },
    discountedValueContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    discountedValue: {
        fontSize: 24,
        fontFamily: 'KohoBold',
        color: colors.marrom,
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