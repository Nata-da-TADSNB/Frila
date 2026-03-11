import colors from "@/constants/Colors";
import { Feather } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Image, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

// -------------------- TYPES -------------------- //

type EstrelasAvaliacaoProps = {
    avaliacao: number;
    setAvaliacao: (nota: number) => void;
};

type PopupConfirmarPedidoProps = {
    visible: boolean;
    onClose: () => void;
    onConfirm: () => void;
    nomeServico?: string;
};

type PopupAvaliacaoProps = {
    visible: boolean;
    onClose: () => void;
    onAvaliar: (nota: number) => void;
    nomeComprador?: string;
};

type PopupCancelarPedidoProps = {
    visible: boolean;
    onClose: () => void;
    onConfirm: () => void;
    nomeServico?: string;
};

type CardServicoProps = {
    nome: string;
    status: string;
    mensagemCancelamento?: string;
    foto: any;
    onConfirmarPress: () => void;
    onCancelarPress: () => void;
};

// -------------------- COMPONENTS -------------------- //

function EstrelasAvaliacao({ avaliacao, setAvaliacao }: EstrelasAvaliacaoProps) {
    return (
        <View style={styles.estrelasContainer}>
            {[1, 2, 3, 4, 5].map((estrela) => (
                <TouchableOpacity
                    key={estrela}
                    onPress={() => setAvaliacao(estrela)}
                    activeOpacity={0.7}
                >
                    <Feather
                        name={"star"}
                        size={40}
                        color={estrela <= avaliacao ? colors.dourado : colors.cinza}
                    />
                </TouchableOpacity>
            ))}
        </View>
    );
}

function PopupConfirmarPedido({ visible, onClose, onConfirm }: PopupConfirmarPedidoProps) {
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

function PopupAvaliacao({ visible, onClose, onAvaliar }: PopupAvaliacaoProps) {
    const [avaliacao, setAvaliacao] = useState<number>(0);

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

                    <Text style={styles.popupTitle}>FAÇA SUA AVALIAÇÃO DO COMPRADOR</Text>

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

function PopupCancelarPedido({ visible, onClose, onConfirm }: PopupCancelarPedidoProps) {
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

function CardServico({
    nome,
    status,
    mensagemCancelamento,
    foto,
    onConfirmarPress,
    onCancelarPress
}: CardServicoProps) {

    const isConcluido = status === "Concluído";
    const isCancelado = status === "Cancelado";
    const isEmAndamento = status === "Em Andamento";

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

                    <Text
                        style={[
                            styles.resultStatus,
                            status === "Concluído" && { color: '#4CAF50' },
                            status === "Cancelado" && { color: '#F44336' },
                            status === "Em Andamento" && { color: '#FFC107' },
                        ]}
                    >
                        {status}
                    </Text>

                    <TouchableOpacity
                        style={[
                            styles.messageButton,
                            isCancelado && styles.messageButtonDisabled
                        ]}
                        disabled={isCancelado}
                    >
                        <Feather
                            name="mail"
                            size={20}
                            color={isCancelado ? colors.cinza : colors.marrom}
                        />
                        <Text
                            style={[
                                styles.messageButtonText,
                                isCancelado && styles.messageButtonTextDisabled
                            ]}
                        >
                            Mensagem
                        </Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.rightSection}>
                    <TouchableOpacity
                        style={[
                            styles.confirmButton,
                            (isConcluido || isCancelado) && styles.disabledButton
                        ]}
                        disabled={isConcluido || isCancelado}
                        onPress={onConfirmarPress}
                    >
                        <Text
                            style={[
                                styles.confirmButtonText,
                                (isConcluido || isCancelado) && styles.disabledButtonText
                            ]}
                        >
                            Confirmar
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.cancelButton,
                            (isConcluido || isCancelado) && styles.disabledButton
                        ]}
                        disabled={isConcluido || isCancelado}
                        onPress={onCancelarPress}
                    >
                        <Text
                            style={[
                                styles.cancelButtonText,
                                (isConcluido || isCancelado) && styles.disabledButtonText
                            ]}
                        >
                            Cancelar
                        </Text>
                    </TouchableOpacity>

                    {isEmAndamento && mensagemCancelamento && (
                        <Text style={styles.cancelMessage}>{mensagemCancelamento}</Text>
                    )}
                </View>
            </View>
        </View>
    );
}

export default function Index() {

    const [popupConfirmarVisible, setPopupConfirmarVisible] = useState<boolean>(false);
    const [popupAvaliacaoVisible, setPopupAvaliacaoVisible] = useState<boolean>(false);
    const [popupCancelarVisible, setPopupCancelarVisible] = useState<boolean>(false);

    const [servicoSelecionado, setServicoSelecionado] = useState<{ nome: string } | null>(null);

    const handleConfirmarPress = (servico: { nome: string }) => {
        setServicoSelecionado(servico);
        setPopupConfirmarVisible(true);
    };

    const handleCancelarPress = (servico: { nome: string }) => {
        setServicoSelecionado(servico);
        setPopupCancelarVisible(true);
    };

    const handleConfirmarPedido = () => {
        setPopupConfirmarVisible(false);

        setTimeout(() => {
            setPopupAvaliacaoVisible(true);
        }, 300);
    };

    const handleAvaliar = (nota: number) => {
        console.log(`Avaliação do comprador ${servicoSelecionado?.nome}: ${nota} estrelas`);
        setPopupAvaliacaoVisible(false);
        setServicoSelecionado(null);
    };

    const handleCancelarPedido = () => {
        console.log(`Pedido cancelado para ${servicoSelecionado?.nome}`);
        setPopupCancelarVisible(false);
        setServicoSelecionado(null);
    };

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
        >

            <View style={styles.header}>
                <Text style={styles.nameApp}>FRILA</Text>
                <Text style={styles.subtitle}>Dashboard</Text>
            </View>

            <CardServico
                nome="João Silva"
                status="Em Andamento"
                mensagemCancelamento="1 hora pra cancelar"
                foto={require('@/assets/img/FOTOFREELANCER.png')}
                onConfirmarPress={() => handleConfirmarPress({ nome: "João Silva" })}
                onCancelarPress={() => handleCancelarPress({ nome: "João Silva" })}
            />

            <CardServico
                nome="Maria Santos"
                status="Concluído"
                foto={require('@/assets/img/FOTOFREELANCER.png')}
                onConfirmarPress={() => handleConfirmarPress({ nome: "Maria Santos" })}
                onCancelarPress={() => handleCancelarPress({ nome: "Maria Santos" })}
            />

            <CardServico
                nome="Pedro Oliveira"
                status="Cancelado"
                mensagemCancelamento="1 hora pra cancelar"
                foto={require('@/assets/img/FOTOFREELANCER.png')}
                onConfirmarPress={() => handleConfirmarPress({ nome: "Pedro Oliveira" })}
                onCancelarPress={() => handleCancelarPress({ nome: "Pedro Oliveira" })}
            />

            <PopupConfirmarPedido
                visible={popupConfirmarVisible}
                onClose={() => {
                    setPopupConfirmarVisible(false);
                    setServicoSelecionado(null);
                }}
                onConfirm={handleConfirmarPedido}
                nomeServico={servicoSelecionado?.nome}
            />

            <PopupAvaliacao
                visible={popupAvaliacaoVisible}
                onClose={() => {
                    setPopupAvaliacaoVisible(false);
                    setServicoSelecionado(null);
                }}
                onAvaliar={handleAvaliar}
                nomeComprador={servicoSelecionado?.nome}
            />

            <PopupCancelarPedido
                visible={popupCancelarVisible}
                onClose={() => {
                    setPopupCancelarVisible(false);
                    setServicoSelecionado(null);
                }}
                onConfirm={handleCancelarPedido}
                nomeServico={servicoSelecionado?.nome}
            />

        </ScrollView>
    );
}

// -------------------- STYLES -------------------- //

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.creme },

    header: {
        paddingTop: 40,
        paddingBottom: 20,
        alignItems: 'center'
    },

    nameApp: {
        fontSize: 90,
        fontFamily: "GotuRegular",
        color: colors.preto
    },

    subtitle: {
        fontSize: 18,
        color: colors.cinza,
        marginTop: -30
    },

    content: {
        paddingHorizontal: 20,
        gap: 20,
        paddingBottom: 40
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
        marginBottom: 15
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
        justifyContent: 'flex-start',
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

    disabledButton: {
        backgroundColor: '#E0E0E0',
        borderColor: colors.cinza,
        borderWidth: 2
    },

    disabledButtonText: { color: colors.cinza },

    cancelMessage: {
        fontSize: 14,
        color: colors.cinza,
        marginTop: -2,
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

    popupMessage: {
        fontSize: 16,
        color: colors.preto,
        textAlign: 'center',
        marginBottom: 24
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