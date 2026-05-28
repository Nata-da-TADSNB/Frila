import { Footer } from "@/components/footer";
import colors from "@/constants/Colors";
import { getPedidosByUsuario, updatePedidoStatus } from "@/database/database";
import { Feather } from '@expo/vector-icons';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { Image, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const FOTO_MAP = {
    'FOTOFREELANCER1': require('@/assets/img/FOTOFREELANCER1.png'),
    'FOTOFREELANCER': require('@/assets/img/FOTOFREELANCER.png'),
    'MULHER1': require('@/assets/img/MULHER1.jpg'),
    'MULHER2': require('@/assets/img/MULHER2.jpg'),
    'HOMEM2': require('@/assets/img/HOMEM2.jpg'),
    'HOMEM3': require('@/assets/img/HOMEM3.jpg'),
    'HOMEM4': require('@/assets/img/HOMEM4.jpg'),
    'HOMEM5': require('@/assets/img/HOMEM5.jpg'),
};
const DEFAULT_FOTO = require('@/assets/img/FOTOFREELANCER1.png');

// -------------------- COMPONENTS -------------------- //

function EstrelasAvaliacao({ avaliacao, setAvaliacao }) {
    return (
        <View style={styles.estrelasContainer}>
            {[1, 2, 3, 4, 5].map((estrela) => (
                <TouchableOpacity
                    key={estrela}
                    onPress={() => setAvaliacao(estrela)}
                    activeOpacity={0.7}
                >
                    <Feather
                        name="star"
                        size={40}
                        color={estrela <= avaliacao ? colors.dourado : colors.cinza}
                    />
                </TouchableOpacity>
            ))}
        </View>
    );
}

function PopupConfirmarPedido({ visible, onClose, onConfirm }) {
    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.popupOverlay}>
                <View style={styles.popupContainer}>
                    <View style={styles.popupIconContainer}>
                        <Feather name="check-circle" size={50} color={colors.marrom} />
                    </View>

                    <Text style={styles.popupTitle}>CONFIRMAR PEDIDO</Text>

                    <Text style={styles.popupMessage}>
                        Você gostaria de confirmar a entrega do serviço?
                    </Text>

                    <View style={styles.popupButtonsContainer}>
                        <TouchableOpacity
                            style={[styles.popupButton, styles.popupCancelButton]}
                            onPress={onClose}
                        >
                            <Text style={styles.popupCancelButtonText}>Cancelar</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.popupButton, styles.popupConfirmButton]}
                            onPress={onConfirm}
                        >
                            <Text style={styles.popupConfirmButtonText}>Confirmar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

function PopupAvaliacao({ visible, onClose, onAvaliar }) {
    const [avaliacao, setAvaliacao] = useState(0);

    const handleAvaliar = () => {
        if (avaliacao > 0) {
            onAvaliar(avaliacao);
            setAvaliacao(0);
        }
    };

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.popupOverlay}>
                <View style={styles.popupContainer}>
                    <View style={styles.popupIconContainer}>
                        <Feather name="star" size={50} color={colors.marrom} />
                    </View>

                    <Text style={styles.popupTitle}>FAÇA SUA AVALIAÇÃO DO SERVIÇO</Text>

                    <EstrelasAvaliacao avaliacao={avaliacao} setAvaliacao={setAvaliacao} />

                    <Text style={styles.popupMessage}>
                        Sua opinião é importante! Faça sua avaliação.
                    </Text>

                    <View style={styles.popupButtonsContainer}>
                        <TouchableOpacity
                            style={[styles.popupButton, styles.popupCancelButton]}
                            onPress={() => {
                                setAvaliacao(0);
                                onClose();
                            }}
                        >
                            <Text style={styles.popupCancelButtonText}>Cancelar</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[
                                styles.popupButton,
                                styles.popupConfirmButton,
                                avaliacao === 0 && styles.popupDisabledButton
                            ]}
                            onPress={handleAvaliar}
                            disabled={avaliacao === 0}
                        >
                            <Text style={[
                                styles.popupConfirmButtonText,
                                avaliacao === 0 && styles.popupDisabledButtonText
                            ]}>
                                Avaliar
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

function PopupCancelarPedido({ visible, onClose, onConfirm }) {
    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.popupOverlay}>
                <View style={styles.popupContainer}>
                    <View style={styles.popupIconContainer}>
                        <Feather name="x-circle" size={50} color={colors.marrom} />
                    </View>

                    <Text style={styles.popupTitle}>CANCELAR PEDIDO</Text>

                    <Text style={styles.popupMessage}>
                        Você gostaria de cancelar a entrega?
                    </Text>

                    <View style={styles.popupButtonsContainer}>
                        <TouchableOpacity
                            style={[styles.popupButton, styles.popupCancelButton]}
                            onPress={onClose}
                        >
                            <Text style={styles.popupCancelButtonText}>Cancelar</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.popupButton, styles.popupConfirmButton]}
                            onPress={onConfirm}
                        >
                            <Text style={styles.popupConfirmButtonText}>Confirmar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

function PopupReembolso({ visible, onClose, onCancel, onSuporte }) {
    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.popupOverlay}>
                <View style={styles.popupContainer}>
                    <View style={styles.popupIconContainer}>
                        <Feather name="alert-circle" size={50} color={colors.marrom} />
                    </View>

                    <Text style={[styles.popupReembolsoTitle, { color: colors.marrom }]}>REEMBOLSO</Text>

                    <Text style={[styles.popupReembolsoSubtitle, { color: colors.marrom }]}>PROBLEMA COM PEDIDO?</Text>

                    <Text style={styles.popupReembolsoMessage}>
                        Solicito, por gentileza, que entre em contato com o suporte e informe detalhadamente o ocorrido.
                    </Text>

                    <View style={styles.popupButtonsContainer}>
                        <TouchableOpacity
                            style={[styles.popupButton, styles.popupReembolsoCancelButton]}
                            onPress={() => {
                                onCancel();
                                onClose();
                            }}
                        >
                            <Text style={styles.popupReembolsoCancelButtonText}>Cancelar</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.popupButton, styles.popupReembolsoSuporteButton]}
                            onPress={() => {
                                onSuporte();
                                onClose();
                            }}
                        >
                            <Text style={styles.popupReembolsoSuporteButtonText}>Suporte</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

function CardServico({
    nome,
    status,
    mensagemCancelamento,
    motivoReembolso,
    foto,
    onConfirmarPress,
    onCancelarPress,
    onReembolsoPress,
    mostrarReembolso = false
}) {

    const isConcluido = status === "Concluído";
    const isCancelado = status === "Cancelado";
    const isEmAndamento = status === "Em Andamento";
    const isReembolso = status === "Reembolso";

    const getStatusColor = () => {
        if (status === "Concluído") return '#4CAF50';
        if (status === "Cancelado") return '#F44336';
        if (status === "Em Andamento") return '#FFC107';
        if (status === "Reembolso") return '#FF9800';
        return colors.cinza;
    };

    const getStatusText = () => {
        if (status === "Reembolso") return "Em Reembolso";
        return status;
    };

    const allButtonsDisabled = isConcluido || isCancelado || isReembolso;

    return (
        <View style={styles.card}>
            <View style={styles.cardTop}>
                <View style={styles.avatarContainer}>
                    <Image source={foto} style={styles.avatar} />
                </View>
            </View>

            <View style={styles.cardBottom}>
                <View style={styles.leftSection}>
                    <Text style={styles.name}>{nome}</Text>

                    <View style={styles.resultContainer}>
                        <Text style={styles.resultLabel}>Resultado</Text>
                    </View>

                    <Text style={[styles.resultStatus, { color: getStatusColor() }]}>
                        {getStatusText()}
                    </Text>

                    {isEmAndamento && mensagemCancelamento && (
                        <Text style={styles.tempoRestante}>{mensagemCancelamento}</Text>
                    )}

                    {isReembolso && motivoReembolso && (
                        <Text style={styles.motivoReembolso}>{motivoReembolso}</Text>
                    )}

                    <TouchableOpacity
                        style={[
                            styles.messageButton,
                            allButtonsDisabled && styles.messageButtonDisabled
                        ]}
                        disabled={allButtonsDisabled}
                    >
                        <Feather
                            name="mail"
                            size={20}
                            color={allButtonsDisabled ? colors.cinza : colors.marrom}
                        />
                        <Text
                            style={[
                                styles.messageButtonText,
                                allButtonsDisabled && styles.messageButtonTextDisabled
                            ]}
                        >
                            Mensagem
                        </Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.rightSection}>
                    {isConcluido ? (
                        <View style={styles.statusContainer}>
                            <Feather name="check-circle" size={24} color="#4CAF50" />
                            <Text style={[styles.statusText, { color: '#4CAF50' }]}>Concluído</Text>
                        </View>
                    ) : isCancelado ? (
                        <View style={styles.statusContainer}>
                            <Feather name="x-circle" size={24} color="#F44336" />
                            <Text style={[styles.statusText, { color: '#F44336' }]}>Cancelado</Text>
                        </View>
                    ) : isReembolso ? (
                        <View style={styles.statusContainer}>
                            <Feather name="clock" size={24} color="#FF9800" />
                            <Text style={[styles.statusText, { color: '#FF9800' }]}>Reembolso</Text>
                        </View>
                    ) : mostrarReembolso ? (
                        <>
                            <TouchableOpacity
                                style={styles.confirmButton}
                                onPress={onConfirmarPress}
                            >
                                <Text style={styles.confirmButtonText}>Confirmar</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.reembolsoButton}
                                onPress={onReembolsoPress}
                            >
                                <Text style={styles.reembolsoButtonText}>Reembolso</Text>
                            </TouchableOpacity>
                        </>
                    ) : (
                        <>
                            <TouchableOpacity
                                style={styles.confirmButton}
                                onPress={onConfirmarPress}
                            >
                                <Text style={styles.confirmButtonText}>Confirmar</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.cancelButton}
                                onPress={onCancelarPress}
                            >
                                <Text style={styles.cancelButtonText}>Cancelar</Text>
                            </TouchableOpacity>
                        </>
                    )}
                </View>
            </View>
        </View>
    );
}

export default function Index() {
    const router = useRouter();
    const [pedidos, setPedidos] = useState([]);
    const [popupConfirmarVisible, setPopupConfirmarVisible] = useState(false);
    const [popupAvaliacaoVisible, setPopupAvaliacaoVisible] = useState(false);
    const [popupCancelarVisible, setPopupCancelarVisible] = useState(false);
    const [popupReembolsoVisible, setPopupReembolsoVisible] = useState(false);
    const [servicoSelecionado, setServicoSelecionado] = useState(null);

    const carregarPedidos = useCallback(async () => {
        const userId = await AsyncStorage.getItem('userId');
        if (!userId) return;
        const rows = await getPedidosByUsuario(Number(userId));
        setPedidos(rows);
    }, []);

    useFocusEffect(useCallback(() => { carregarPedidos(); }, [carregarPedidos]));

    const handleConfirmarPress = (pedido) => { setServicoSelecionado(pedido); setPopupConfirmarVisible(true); };
    const handleCancelarPress = (pedido) => { setServicoSelecionado(pedido); setPopupCancelarVisible(true); };
    const handleReembolsoPress = (pedido) => { setServicoSelecionado(pedido); setPopupReembolsoVisible(true); };

    const handleConfirmarPedido = async () => {
        if (servicoSelecionado) {
            await updatePedidoStatus(servicoSelecionado.id_pedido, 'Concluído');
            await carregarPedidos();
        }
        setPopupConfirmarVisible(false);
        setTimeout(() => setPopupAvaliacaoVisible(true), 300);
    };

    const handleAvaliar = (nota) => {
        setPopupAvaliacaoVisible(false);
        setServicoSelecionado(null);
    };

    const handleCancelarPedido = async () => {
        if (servicoSelecionado) {
            await updatePedidoStatus(servicoSelecionado.id_pedido, 'Cancelado');
            await carregarPedidos();
        }
        setPopupCancelarVisible(false);
        setServicoSelecionado(null);
    };

    const handleSuporte = () => {
        setServicoSelecionado(null);
        router.push('/suporte');
    };

    return (
        <View style={{ flex: 1, backgroundColor: colors.creme }}>
            <ScrollView
                style={styles.container}
                contentContainerStyle={[styles.content, { paddingBottom: 100 }]}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.header}>
                    <Text style={styles.title}>Pedidos</Text>
                </View>

                {pedidos.length === 0 && (
                    <Text style={styles.emptyText}>Você ainda não tem pedidos.</Text>
                )}

                {pedidos.map((pedido) => (
                    <CardServico
                        key={pedido.id_pedido}
                        nome={pedido.nome_contato}
                        status={pedido.status}
                        mensagemCancelamento={pedido.mensagem_cancelamento}
                        motivoReembolso={pedido.motivo_reembolso}
                        foto={FOTO_MAP[pedido.foto_id] ?? DEFAULT_FOTO}
                        mostrarReembolso={pedido.mostrar_reembolso === 1}
                        onConfirmarPress={() => handleConfirmarPress(pedido)}
                        onCancelarPress={() => handleCancelarPress(pedido)}
                        onReembolsoPress={() => handleReembolsoPress(pedido)}
                    />
                ))}

                <PopupConfirmarPedido
                    visible={popupConfirmarVisible}
                    onClose={() => { setPopupConfirmarVisible(false); setServicoSelecionado(null); }}
                    onConfirm={handleConfirmarPedido}
                />

                <PopupAvaliacao
                    visible={popupAvaliacaoVisible}
                    onClose={() => { setPopupAvaliacaoVisible(false); setServicoSelecionado(null); }}
                    onAvaliar={handleAvaliar}
                />

                <PopupCancelarPedido
                    visible={popupCancelarVisible}
                    onClose={() => { setPopupCancelarVisible(false); setServicoSelecionado(null); }}
                    onConfirm={handleCancelarPedido}
                />

                <PopupReembolso
                    visible={popupReembolsoVisible}
                    onClose={() => { setPopupReembolsoVisible(false); setServicoSelecionado(null); }}
                    onCancel={() => setServicoSelecionado(null)}
                    onSuporte={handleSuporte}
                />
            </ScrollView>

            <Footer />
        </View>
    );
}

// -------------------- STYLES -------------------- //

const styles = StyleSheet.create({
    container: {
        flex: 1
    },

    header: {
        paddingTop: 60,
        paddingBottom: 20,
        alignItems: 'center'
    },

    title: {
        fontSize: 32,
        color: colors.preto,
        fontWeight: '600'
    },

    emptyText: {
        textAlign: 'center',
        color: colors.cinza,
        fontSize: 16,
        marginTop: 40,
    },

    content: {
        paddingHorizontal: 20,
        gap: 20,
    },

    card: {
        height: 400,
        borderRadius: 20,
        overflow: 'hidden',
        backgroundColor: colors.marromClaro,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
        elevation: 8,
        width: '100%'
    },

    cardTop: {
        flex: 0.45,
        backgroundColor: colors.marrom,
        justifyContent: 'center',
        alignItems: 'center'
    },

    avatarContainer: {
        width: 90,
        height: 90,
        borderRadius: 55,
        backgroundColor: colors.bege,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 4,
        borderColor: colors.dourado,
        overflow: 'hidden'
    },

    avatar: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover'
    },

    cardBottom: {
        flex: 0.55,
        backgroundColor: colors.creme,
        flexDirection: 'row',
        padding: 20
    },

    leftSection: {
        flex: 1.2,
        justifyContent: 'flex-start',
        paddingVertical: 10
    },

    name: {
        fontSize: 28,
        fontWeight: '600',
        color: colors.preto,
        marginBottom: 10
    },

    resultContainer: { marginBottom: 5 },

    resultLabel: {
        color: colors.cinza,
        fontSize: 16,
        fontWeight: '500'
    },

    resultStatus: {
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 5
    },

    tempoRestante: {
        fontSize: 14,
        color: colors.marrom,
        marginBottom: 15
    },

    motivoReembolso: {
        fontSize: 14,
        color: '#8b6b4f',
        marginBottom: 15,
        fontStyle: 'italic'
    },

    messageButton: {
        backgroundColor: colors.bege,
        paddingHorizontal: 30,
        paddingVertical: 10,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: colors.marrom,
        alignSelf: 'flex-start',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8
    },

    messageButtonDisabled: {
        backgroundColor: '#E0E0E0',
        borderColor: colors.cinza
    },

    messageButtonText: {
        color: colors.marrom,
        fontSize: 16,
        fontWeight: '600'
    },

    messageButtonTextDisabled: { color: colors.cinza },

    rightSection: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'stretch',
        paddingVertical: 35,
        gap: 12
    },

    confirmButton: {
        backgroundColor: colors.marrom,
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 12,
        alignItems: 'center'
    },

    confirmButtonText: {
        color: colors.creme,
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center'
    },

    cancelButton: {
        backgroundColor: 'transparent',
        borderRadius: 12,
        borderWidth: 2,
        borderColor: colors.marrom,
        paddingHorizontal: 20,
        paddingVertical: 12,
        alignItems: 'center'
    },

    cancelButtonText: {
        color: colors.marrom,
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center'
    },

    reembolsoButton: {
        backgroundColor: 'transparent',
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#C6A76A',
        paddingHorizontal: 20,
        paddingVertical: 12,
        alignItems: 'center'
    },

    reembolsoButtonText: {
        color: '#C6A76A',
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center'
    },

    statusContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        height: '100%'
    },

    statusText: {
        fontSize: 14,
        fontWeight: '600',
        textAlign: 'center'
    },

    popupOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center'
    },

    popupContainer: {
        width: '85%',
        backgroundColor: colors.creme,
        borderRadius: 20,
        padding: 24,
        alignItems: 'center'
    },

    popupIconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: colors.bege,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16
    },

    popupTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: colors.marrom,
        marginBottom: 12,
        textAlign: 'center'
    },

    popupReembolsoTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 8,
        textAlign: 'center'
    },

    popupReembolsoSubtitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 16,
        textAlign: 'center'
    },

    popupMessage: {
        fontSize: 16,
        color: colors.preto,
        textAlign: 'center',
        marginBottom: 24
    },

    popupReembolsoMessage: {
        fontSize: 16,
        color: colors.preto,
        textAlign: 'center',
        marginBottom: 24,
        lineHeight: 22,
        paddingHorizontal: 10
    },

    popupButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        gap: 12
    },

    popupButton: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 25,
        alignItems: 'center'
    },

    popupCancelButton: {
        backgroundColor: 'transparent',
        borderRadius: 12,
        borderWidth: 2,
        borderColor: colors.marrom,
        paddingHorizontal: 20,
        paddingVertical: 12,
        alignItems: 'center'
    },

    popupCancelButtonText: {
        color: colors.marrom,
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center'
    },

    popupConfirmButton: {
        backgroundColor: colors.marrom,
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 12,
        alignItems: 'center'
    },

    popupConfirmButtonText: {
        color: colors.creme,
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center'
    },

    popupReembolsoCancelButton: {
        backgroundColor: 'transparent',
        borderRadius: 12,
        borderWidth: 2,
        borderColor: colors.marrom,
        paddingHorizontal: 20,
        paddingVertical: 12,
        alignItems: 'center'
    },

    popupReembolsoCancelButtonText: {
        color: colors.marrom,
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center'
    },

    popupReembolsoSuporteButton: {
        backgroundColor: colors.marrom,
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 12,
        alignItems: 'center'
    },

    popupReembolsoSuporteButtonText: {
        color: colors.creme,
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center'
    },

    popupDisabledButton: {
        backgroundColor: '#E0E0E0',
        borderColor: colors.cinza,
        borderWidth: 2
    },

    popupDisabledButtonText: { color: colors.cinza },

    estrelasContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 20,
        gap: 8
    }
});