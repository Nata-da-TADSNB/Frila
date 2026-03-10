import colors from "@/constants/Colors";
import { Feather } from '@expo/vector-icons';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

function CardServico({ nome, status, mensagemCancelamento }) {
    const isConcluido = status === "Concluído";
    const isCancelado = status === "Cancelado";
    const isEmAndamento = status === "Em Andamento";

    return (
        <View style={styles.card}>
            <View style={styles.cardTop}>
                <View style={styles.avatarContainer}>
                    <View style={styles.avatar}>
                        <Text style={styles.avatarText}>{nome[0]}{nome.split(" ")[1][0]}</Text>
                    </View>
                </View>
            </View>

            <View style={styles.cardBottom}>
                <View style={styles.leftSection}>
                    <Text style={styles.name}>{nome}</Text>
                    <View style={styles.resultContainer}>
                        <Text style={styles.resultLabel}>Resultado</Text>
                    </View>
                    <Text style={[
                        styles.resultStatus,
                        status === "Concluído" && { color: '#4CAF50' },
                        status === "Cancelado" && { color: '#F44336' },
                        status === "Em Andamento" && { color: '#FFC107' },
                    ]}>
                        {status}
                    </Text>

                    <TouchableOpacity
                        style={styles.messageButton}
                        disabled={isCancelado}
                    >
                        <Feather name="mail" size={20} color={colors.marrom} />
                        <Text style={styles.messageButtonText}>Mensagem</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.rightSection}>
                    <TouchableOpacity
                        style={[
                            styles.confirmButton,
                            (isConcluido || isCancelado) && styles.disabledButton
                        ]}
                        disabled={isConcluido || isCancelado}
                    >
                        <Text style={[
                            styles.confirmButtonText,
                            (isConcluido || isCancelado) && styles.disabledButtonText
                        ]}>
                            Confirmar Serviço
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.cancelButton,
                            (isConcluido || isCancelado) && styles.disabledButton
                        ]}
                        disabled={isConcluido || isCancelado}
                    >
                        <Text style={[
                            styles.cancelButtonText,
                            (isConcluido || isCancelado) && styles.disabledButtonText
                        ]}>
                            Cancelar Serviço
                        </Text>
                    </TouchableOpacity>

                    {isEmAndamento && mensagemCancelamento && (
                        <Text style={styles.cancelMessage}>{mensagemCancelamento}</Text>
                    )}
                </View>
            </View>
        </View>
    )
}

export default function Index() {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.nameApp}>FRILA</Text>
                <Text style={styles.subtitle}>Dashboard</Text>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <CardServico nome="João Silva" status="Concluído" />
                <CardServico nome="João Silva" status="Cancelado" />
                <CardServico nome="João Silva" status="Em Andamento" mensagemCancelamento="1 hora pra cancelar" />
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.creme,
    },
    header: {
        paddingTop: 10,
        alignItems: 'center',
    },
    nameApp: {
        fontSize: 90,
        fontFamily: "GotuRegular",
        color: colors.preto,
    },
    subtitle: {
        fontSize: 18,
        color: colors.cinza,
        marginTop: -30,
    },
    content: {
        paddingTop: 30,
        paddingHorizontal: 20,
        gap: 20,
        paddingBottom: 40, 
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
        width: '100%',
    },
    cardTop: {
        flex: 0.45,
        backgroundColor: colors.marrom,
        justifyContent: 'center',
        alignItems: 'center',
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
    },
    avatar: {
        width: '100%',
        height: '100%',
        borderRadius: 55,
        backgroundColor: colors.marromClaro,
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarText: {
        fontSize: 30,
        fontWeight: 'bold',
        color: colors.creme,
    },
    cardBottom: {
        flex: 0.55,
        backgroundColor: colors.creme,
        flexDirection: 'row',
        padding: 20,
    },
    leftSection: {
        flex: 1.2,
        justifyContent: 'flex-start',
        paddingVertical: 10,
    },
    name: {
        fontSize: 28,
        fontWeight: '600',
        color: colors.preto,
        marginBottom: 10,
    },
    resultContainer: {
        marginBottom: 5,
    },
    resultLabel: {
        color: colors.cinza,
        fontSize: 16,
        fontWeight: '500',
    },
    resultStatus: {
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 15,
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
        gap: 8,
    },
    messageButtonText: {
        color: colors.marrom,
        fontSize: 16,
        fontWeight: '600',
    },
    rightSection: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'stretch',
        paddingVertical: 10,
        gap: 12,
    },
    confirmButton: {
        backgroundColor: colors.marrom,
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 12,
        alignItems: 'center',
    },
    confirmButtonText: {
        color: colors.creme,
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
    },
    cancelButton: {
        backgroundColor: 'transparent',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: colors.marrom,
        alignItems: 'center',
    },
    cancelButtonText: {
        color: colors.marrom,
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
    },
    disabledButton: {
        backgroundColor: colors.cinza,
        borderColor: colors.cinza,
    },
    disabledButtonText: {
        color: colors.creme,
    },
    cancelMessage: {
        fontSize: 14,
        color: colors.cinza,
        marginTop: 5,
        textAlign: 'center',
    },
});
