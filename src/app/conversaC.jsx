import colors from "@/constants/Colors";
import { addMensagem, addPedido, getMensagens, updatePropostaStatus } from "@/database/database";
import { DEMO_MODE, processarPagamento } from "@/services/mercadoPago";
import Ionicons from "@expo/vector-icons/build/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
    ActionSheetIOS,
    ActivityIndicator,
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

const AVATAR_MAP = {
    'FOTOFREELANCER1': require('@/assets/img/FOTOFREELANCER1.png'),
    'FOTOFREELANCER': require('@/assets/img/FOTOFREELANCER.png'),
    'MULHER1': require('@/assets/img/MULHER1.jpg'),
    'MULHER2': require('@/assets/img/MULHER2.jpg'),
    'HOMEM2': require('@/assets/img/HOMEM2.jpg'),
    'HOMEM3': require('@/assets/img/HOMEM3.jpg'),
    'HOMEM4': require('@/assets/img/HOMEM4.jpg'),
    'HOMEM5': require('@/assets/img/HOMEM5.jpg'),
    'SUPORTE': require('@/assets/img/SUPORTE.png'),
};
const DEFAULT_AVATAR = require('@/assets/img/FOTOFREELANCER.png');

// ── Bolha de mensagem ──────────────────────────────────────────────────────

const MessageBubble = ({ message, isMe }) => (
    <View style={[styles.messageWrapper, isMe ? styles.myMessageWrapper : styles.otherMessageWrapper]}>
        {message.type === 'image' && message.uri ? (
            <View style={[styles.messageBubble, isMe ? styles.myBubble : styles.otherBubble, styles.imageBubble]}>
                <Image source={{ uri: message.uri }} style={styles.messageImage} />
                <Text style={styles.messageTime}>{message.time}</Text>
            </View>
        ) : message.type === 'text' && message.text ? (
            <View style={[styles.messageBubble, isMe ? styles.myBubble : styles.otherBubble]}>
                <Text style={[styles.messageText, isMe ? styles.myMessageText : styles.otherMessageText]}>
                    {message.text}
                </Text>
                <Text style={styles.messageTime}>{message.time}</Text>
            </View>
        ) : null}
    </View>
);

// ── Bolha de proposta ──────────────────────────────────────────────────────

const ProposalMessage = ({ proposal, onPayPress }) => (
    <View style={[styles.messageWrapper, styles.otherMessageWrapper]}>
        <View style={styles.proposalBubble}>
            <Text style={styles.proposalTitle}>PROPOSTA RECEBIDA</Text>
            <View style={styles.proposalValueRow}>
                <Text style={styles.proposalLabel}>Valor:</Text>
                <View style={styles.proposalValueContainer}>
                    <Ionicons name="cash-outline" size={20} color={colors.marrom} />
                    <Text style={styles.proposalValue}>R${proposal.value},00</Text>
                </View>
            </View>
            <Text style={styles.proposalDescription}>{proposal.description}</Text>

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
                    <Text style={[styles.proposalStatusText, { color: colors.creme }]}>
                        Pagamento confirmado
                    </Text>
                </View>
            )}

            <Text style={styles.proposalTime}>{proposal.time}</Text>
        </View>
    </View>
);

// ── Modal de Pagamento Mercado Pago ────────────────────────────────────────

function ModalPagamentoMP({ visible, onClose, proposta, contactName, onSucesso }) {
    const [status, setStatus] = useState('idle'); // idle | loading | success

    const handlePagar = async () => {
        setStatus('loading');
        try {
            const resultado = await processarPagamento(
                proposta?.value ?? 0,
                `Serviço Frila — ${contactName}`
            );
            setStatus('success');
            setTimeout(() => {
                setStatus('idle');
                onSucesso(resultado);
            }, 2000);
        } catch (error) {
            setStatus('idle');
            Alert.alert(
                'Falha no pagamento',
                error.message || 'Não foi possível processar o pagamento. Tente novamente.'
            );
        }
    };

    const handleClose = () => {
        if (status === 'loading') return;
        setStatus('idle');
        onClose();
    };

    return (
        <Modal visible={visible} transparent animationType="slide" onRequestClose={handleClose}>
            <View style={mpStyles.overlay}>
                <View style={mpStyles.sheet}>

                    {/* Cabeçalho MP */}
                    <View style={mpStyles.header}>
                        <View style={mpStyles.mpBadge}>
                            <Text style={mpStyles.mpBadgeText}>Mercado</Text>
                            <Text style={[mpStyles.mpBadgeText, { color: '#00bcff' }]}>Pago</Text>
                        </View>
                        {DEMO_MODE && (
                            <View style={mpStyles.demoBadge}>
                                <Text style={mpStyles.demoBadgeText}>SANDBOX</Text>
                            </View>
                        )}
                        {status === 'idle' && (
                            <TouchableOpacity onPress={handleClose} style={mpStyles.closeButton}>
                                <Ionicons name="close" size={22} color={colors.cinza} />
                            </TouchableOpacity>
                        )}
                    </View>

                    {status === 'success' ? (
                        /* ── Tela de sucesso ── */
                        <View style={mpStyles.successContainer}>
                            <View style={mpStyles.successIcon}>
                                <Ionicons name="checkmark-circle" size={72} color="#00a650" />
                            </View>
                            <Text style={mpStyles.successTitle}>Pagamento aprovado!</Text>
                            <Text style={mpStyles.successSub}>
                                Seu pedido foi criado com sucesso.
                            </Text>
                        </View>
                    ) : (
                        /* ── Resumo do pagamento ── */
                        <>
                            <Text style={mpStyles.sectionLabel}>Você está pagando</Text>

                            <View style={mpStyles.amountBox}>
                                <Text style={mpStyles.currency}>R$</Text>
                                <Text style={mpStyles.amount}>{proposta?.value ?? 0}</Text>
                                <Text style={mpStyles.cents}>,00</Text>
                            </View>

                            <Text style={mpStyles.serviceLabel}>
                                Serviço: {contactName}
                            </Text>

                            {/* Cartão de teste */}
                            <View style={mpStyles.cardBox}>
                                <Ionicons name="card-outline" size={28} color={colors.marrom} />
                                <View style={mpStyles.cardInfo}>
                                    <Text style={mpStyles.cardBrand}>Mastercard  •••• 0604</Text>
                                    <Text style={mpStyles.cardHolder}>
                                        {DEMO_MODE ? 'Cartão de teste (sandbox)' : 'Titular: APRO'}
                                    </Text>
                                </View>
                                <View style={mpStyles.cardCheck}>
                                    <Ionicons name="checkmark-circle" size={20} color="#00a650" />
                                </View>
                            </View>

                            {DEMO_MODE && (
                                <View style={mpStyles.demoInfo}>
                                    <Ionicons name="information-circle-outline" size={16} color={colors.cinza} />
                                    <Text style={mpStyles.demoInfoText}>
                                        Modo demo ativo — configure credenciais reais no .env para usar o sandbox MP.
                                    </Text>
                                </View>
                            )}

                            <TouchableOpacity
                                style={[mpStyles.payBtn, status === 'loading' && mpStyles.payBtnDisabled]}
                                onPress={handlePagar}
                                disabled={status === 'loading'}
                            >
                                {status === 'loading' ? (
                                    <ActivityIndicator color={colors.creme} />
                                ) : (
                                    <>
                                        <Ionicons name="lock-closed-outline" size={18} color={colors.creme} />
                                        <Text style={mpStyles.payBtnText}>CONFIRMAR PAGAMENTO</Text>
                                    </>
                                )}
                            </TouchableOpacity>

                            <TouchableOpacity onPress={handleClose} disabled={status === 'loading'}>
                                <Text style={mpStyles.cancelText}>Cancelar</Text>
                            </TouchableOpacity>
                        </>
                    )}
                </View>
            </View>
        </Modal>
    );
}

// ── Tela principal ─────────────────────────────────────────────────────────

export default function ChatComprador() {
    const router = useRouter();
    const {
        contactId = '1',
        contactName = 'Contato',
        contactPhotoId = '',
        userType = 'usuario',
    } = useLocalSearchParams();

    const [userId, setUserId] = useState(null);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [showPayModal, setShowPayModal] = useState(false);
    const [selectedProposalId, setSelectedProposalId] = useState(null);
    const scrollViewRef = useRef(null);

    useEffect(() => {
        async function init() {
            const id = await AsyncStorage.getItem('userId');
            if (!id) return;
            setUserId(Number(id));
            const msgs = await getMensagens(Number(id), contactId, userType);
            setMessages(msgs);
        }
        init();
    }, []);

    const getCurrentTime = () => {
        const now = new Date();
        return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    };

    const handleSendMessage = async () => {
        if (!message.trim() || !userId) return;
        const time = getCurrentTime();
        const id = await addMensagem(userId, contactId, userType, true, 'text', { conteudo: message.trim() }, time);
        setMessages(prev => [...prev, { id, text: message.trim(), time, isMe: true, type: 'text' }]);
        setMessage('');
        setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);
    };

    const handleAttachPress = () => {
        if (Platform.OS === 'ios') {
            ActionSheetIOS.showActionSheetWithOptions(
                { options: ['Cancelar', 'Tirar Foto', 'Escolher da Galeria'], cancelButtonIndex: 0 },
                (i) => { if (i === 1) openCamera(); else if (i === 2) openImagePicker(); }
            );
        } else {
            Alert.alert('Anexar Foto', 'Escolha uma opção', [
                { text: 'Cancelar', style: 'cancel' },
                { text: 'Tirar Foto', onPress: openCamera },
                { text: 'Escolher da Galeria', onPress: openImagePicker },
            ]);
        }
    };

    const openCamera = async () => {
        try {
            const { status } = await ImagePicker.requestCameraPermissionsAsync();
            if (status !== 'granted') { Alert.alert('Permissão necessária', 'Precisamos de acesso à câmera.'); return; }
            const result = await ImagePicker.launchCameraAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true, quality: 0.8 });
            if (!result.canceled && result.assets?.[0]) await sendImage(result.assets[0].uri);
        } catch { Alert.alert('Erro', 'Não foi possível abrir a câmera.'); }
    };

    const openImagePicker = async () => {
        try {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') { Alert.alert('Permissão necessária', 'Precisamos de acesso à galeria.'); return; }
            const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true, quality: 0.8 });
            if (!result.canceled && result.assets?.[0]) await sendImage(result.assets[0].uri);
        } catch { Alert.alert('Erro', 'Não foi possível acessar a galeria.'); }
    };

    const sendImage = async (uri) => {
        if (!userId) return;
        const time = getCurrentTime();
        const id = await addMensagem(userId, contactId, userType, true, 'image', { uri }, time);
        setMessages(prev => [...prev, { id, type: 'image', uri, time, isMe: true }]);
        setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);
    };

    const handlePayPress = (messageId) => {
        setSelectedProposalId(messageId);
        setShowPayModal(true);
    };

    const handlePagamentoSucesso = async (resultado) => {
        setShowPayModal(false);

        // Marca proposta como aceita no banco
        await updatePropostaStatus(selectedProposalId, 'accepted');

        // Cria pedido na tela de Pedidos
        await addPedido(
            userId,
            contactName,
            contactPhotoId || 'FOTOFREELANCER1',
            'Em Andamento'
        );

        // Atualiza estado local da proposta
        setMessages(prev =>
            prev.map(msg =>
                msg.id === selectedProposalId && msg.type === 'proposal'
                    ? { ...msg, proposal: { ...msg.proposal, status: 'accepted' } }
                    : msg
            )
        );

        setSelectedProposalId(null);

        Alert.alert(
            'Pagamento confirmado!',
            `ID do pagamento: ${resultado.id}\n\nSeu pedido foi criado e pode ser acompanhado em Pedidos.`,
            [
                { text: 'Ver Pedidos', onPress: () => router.push('/pedidos') },
                { text: 'Continuar', style: 'cancel' },
            ]
        );
    };

    const selectedProposal = messages.find(m => m.id === selectedProposalId && m.type === 'proposal')?.proposal;
    const contactAvatar = AVATAR_MAP[contactPhotoId] ?? DEFAULT_AVATAR;

    return (
        <View style={{ flex: 1, backgroundColor: colors.creme }}>
            {/* Cabeçalho */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={colors.marrom} />
                </TouchableOpacity>
                <View style={styles.headerInfo}>
                    <Image source={contactAvatar} style={styles.headerAvatar} />
                    <View style={styles.headerText}>
                        <Text style={styles.headerName}>{contactName}</Text>
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
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
            >
                <ScrollView
                    ref={scrollViewRef}
                    style={styles.messagesContainer}
                    contentContainerStyle={styles.messagesContent}
                    showsVerticalScrollIndicator={false}
                    onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
                >
                    {messages.length === 0 && (
                        <Text style={styles.emptyChat}>Nenhuma mensagem ainda. Diga olá!</Text>
                    )}
                    {messages.map((msg) => (
                        msg.type === 'proposal' && msg.proposal ? (
                            <ProposalMessage
                                key={msg.id}
                                proposal={msg.proposal}
                                onPayPress={() => handlePayPress(msg.id)}
                            />
                        ) : (
                            <MessageBubble key={msg.id} message={msg} isMe={msg.isMe} />
                        )
                    ))}
                </ScrollView>

                {/* Input */}
                <View style={styles.inputArea}>
                    <TouchableOpacity style={styles.attachButton} onPress={handleAttachPress}>
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
                        style={[styles.sendButton, !message.trim() && styles.sendButtonDisabled]}
                        onPress={handleSendMessage}
                        disabled={!message.trim()}
                    >
                        <Ionicons name="send" size={20} color={message.trim() ? colors.creme : colors.cinza} />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>

            {/* Modal de Pagamento MP */}
            <ModalPagamentoMP
                visible={showPayModal}
                onClose={() => setShowPayModal(false)}
                proposta={selectedProposal}
                contactName={contactName}
                onSucesso={handlePagamentoSucesso}
            />
        </View>
    );
}

// ── Estilos do chat ────────────────────────────────────────────────────────

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        paddingHorizontal: 15, paddingVertical: 12,
        backgroundColor: colors.bege, borderBottomWidth: 1, borderBottomColor: colors.marromClaro,
    },
    backButton: { padding: 5 },
    headerInfo: { flexDirection: 'row', alignItems: 'center', flex: 1, marginLeft: 10 },
    headerAvatar: { width: 40, height: 40, borderRadius: 20, marginRight: 10 },
    headerText: { justifyContent: 'center' },
    headerName: { fontSize: 16, fontFamily: 'KohoMedium', color: colors.marrom, marginBottom: 2 },
    headerRating: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    headerRatingText: { fontSize: 14, fontFamily: 'KohoRegular', color: colors.cinza },
    supportButton: { padding: 5 },
    messagesContainer: { flex: 1, paddingHorizontal: 15 },
    messagesContent: { paddingVertical: 20, gap: 15 },
    emptyChat: { textAlign: 'center', color: colors.cinza, fontFamily: 'KohoRegular', fontSize: 14, marginTop: 40 },
    messageWrapper: { width: '100%', marginBottom: 5 },
    myMessageWrapper: { alignItems: 'flex-end' },
    otherMessageWrapper: { alignItems: 'flex-start' },
    messageBubble: { maxWidth: '75%', padding: 12, borderRadius: 15 },
    myBubble: { backgroundColor: colors.marromClaro, borderBottomRightRadius: 5 },
    otherBubble: { backgroundColor: colors.bege, borderBottomLeftRadius: 5 },
    imageBubble: { padding: 5, backgroundColor: 'transparent' },
    messageText: { fontSize: 14, fontFamily: 'KohoRegular', marginBottom: 4, lineHeight: 18 },
    myMessageText: { color: colors.creme },
    otherMessageText: { color: colors.preto },
    messageTime: { fontSize: 10, fontFamily: 'KohoLight', color: colors.cinza, alignSelf: 'flex-end', marginTop: 4 },
    messageImage: { width: 200, height: 200, borderRadius: 10, marginBottom: 4 },
    proposalBubble: { maxWidth: '85%', padding: 15, borderRadius: 15, backgroundColor: colors.bege, borderWidth: 1, borderColor: colors.marromClaro },
    proposalTitle: { fontSize: 14, fontFamily: 'KohoBold', color: colors.marrom, marginBottom: 10 },
    proposalValueRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
    proposalLabel: { fontSize: 14, fontFamily: 'KohoRegular', color: colors.cinza },
    proposalValueContainer: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    proposalValue: { fontSize: 18, fontFamily: 'KohoBold', color: colors.marrom },
    proposalDescription: { fontSize: 13, fontFamily: 'KohoLight', color: colors.cinza, marginBottom: 15, lineHeight: 18 },
    payButton: { backgroundColor: colors.marrom, paddingVertical: 12, paddingHorizontal: 20, borderRadius: 8, alignItems: 'center', marginBottom: 8, flexDirection: 'row', justifyContent: 'center', gap: 8 },
    payButtonText: { color: colors.creme, fontSize: 14, fontFamily: 'KohoBold' },
    proposalStatus: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 5, alignSelf: 'flex-start', marginBottom: 10, flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: colors.bege },
    proposalStatusAccepted: { backgroundColor: '#00a650' },
    proposalStatusText: { color: colors.dourado, fontSize: 12, fontFamily: 'KohoMedium' },
    proposalTime: { fontSize: 10, fontFamily: 'KohoLight', color: colors.cinza, alignSelf: 'flex-end' },
    inputArea: { flexDirection: 'row', alignItems: 'flex-end', paddingHorizontal: 10, paddingVertical: 8, backgroundColor: colors.bege, borderTopWidth: 1, borderTopColor: colors.marromClaro, gap: 8 },
    attachButton: { padding: 8, justifyContent: 'center', alignItems: 'center' },
    inputContainer: { flex: 1, backgroundColor: colors.creme, borderRadius: 20, paddingHorizontal: 15, paddingVertical: 8, maxHeight: 100, minHeight: 40 },
    input: { fontFamily: 'KohoRegular', fontSize: 14, color: colors.preto, padding: 0, margin: 0 },
    sendButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.marrom, justifyContent: 'center', alignItems: 'center' },
    sendButtonDisabled: { backgroundColor: colors.marromClaro },
});

// ── Estilos do modal MP ────────────────────────────────────────────────────

const mpStyles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    sheet: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingHorizontal: 24,
        paddingBottom: 40,
        paddingTop: 20,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
    },
    mpBadge: {
        flexDirection: 'row',
        gap: 2,
        flex: 1,
    },
    mpBadgeText: {
        fontSize: 20,
        fontWeight: '700',
        color: '#009ee3',
        letterSpacing: -0.5,
    },
    demoBadge: {
        backgroundColor: '#fff3cd',
        borderRadius: 6,
        paddingHorizontal: 8,
        paddingVertical: 3,
        marginRight: 8,
    },
    demoBadgeText: {
        fontSize: 11,
        fontWeight: '700',
        color: '#856404',
    },
    closeButton: {
        padding: 4,
    },
    sectionLabel: {
        fontSize: 13,
        color: '#888',
        marginBottom: 6,
        textAlign: 'center',
    },
    amountBox: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'center',
        marginBottom: 4,
    },
    currency: {
        fontSize: 22,
        fontWeight: '600',
        color: '#333',
        marginBottom: 6,
        marginRight: 2,
    },
    amount: {
        fontSize: 52,
        fontWeight: '700',
        color: '#333',
        lineHeight: 58,
    },
    cents: {
        fontSize: 22,
        fontWeight: '600',
        color: '#333',
        marginBottom: 6,
    },
    serviceLabel: {
        fontSize: 13,
        color: '#888',
        textAlign: 'center',
        marginBottom: 24,
    },
    cardBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        gap: 12,
    },
    cardInfo: {
        flex: 1,
    },
    cardBrand: {
        fontSize: 15,
        fontWeight: '600',
        color: '#333',
    },
    cardHolder: {
        fontSize: 12,
        color: '#888',
        marginTop: 2,
    },
    cardCheck: {},
    demoInfo: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 6,
        backgroundColor: '#f0f4ff',
        borderRadius: 8,
        padding: 10,
        marginBottom: 16,
    },
    demoInfoText: {
        fontSize: 12,
        color: '#555',
        flex: 1,
        lineHeight: 17,
    },
    payBtn: {
        backgroundColor: '#009ee3',
        borderRadius: 8,
        paddingVertical: 16,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 8,
        marginBottom: 12,
    },
    payBtnDisabled: {
        backgroundColor: '#7fcff4',
    },
    payBtnText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    cancelText: {
        textAlign: 'center',
        color: '#888',
        fontSize: 15,
        paddingVertical: 8,
    },
    successContainer: {
        alignItems: 'center',
        paddingVertical: 32,
    },
    successIcon: {
        marginBottom: 16,
    },
    successTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#00a650',
        marginBottom: 8,
    },
    successSub: {
        fontSize: 15,
        color: '#666',
        textAlign: 'center',
    },
});
