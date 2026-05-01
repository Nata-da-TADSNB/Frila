import { Footer } from "@/components/footerFreelancer";
import colors from "@/constants/Colors";
import { deleteServico, getAllServicos, initDatabase } from "@/database/database";
import { Feather } from '@expo/vector-icons';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from 'react';
import {
    Alert,
    Image,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";

// -------------------- COMPONENTS -------------------- //

function PopupExcluirServico({ visible, onClose, onConfirm, nomeServico }) {
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
                        <Feather name="trash-2" size={50} color={colors.marrom} />
                    </View>

                    <Text style={styles.popupTitle}>EXCLUIR SERVIÇO</Text>

                    <Text style={styles.popupMessage}>
                        Tem certeza que deseja excluir o serviço "{nomeServico}"?
                        Esta ação não poderá ser desfeita.
                    </Text>

                    <View style={styles.popupButtonsContainer}>
                        <TouchableOpacity
                            style={[styles.popupButton, styles.popupCancelButton]}
                            onPress={onClose}
                        >
                            <Text style={styles.popupCancelButtonText}>CANCELAR</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.popupButton, styles.popupConfirmButton]}
                            onPress={onConfirm}
                        >
                            <Text style={styles.popupConfirmButtonText}>EXCLUIR</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

function CardMeuServico({ servico, onExcluir, onEditar }) {
    const getTipoIcon = () => {
        switch (servico.tipo) {
            case 'digital': return 'monitor';
            case 'presencial': return 'map-pin';
            case 'delivery': return 'truck';
            default: return 'briefcase';
        }
    };

    const getTipoLabel = () => {
        switch (servico.tipo) {
            case 'digital': return 'Remoto';
            case 'presencial': return 'Presencial';
            case 'delivery': return 'Delivery';
            default: return '';
        }
    };

    const formatarValor = (valor) => {
        return valor.toLocaleString('pt-BR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    };

    return (
        <View style={styles.card}>
            <View style={styles.tipoBadge}>
                <Feather name={getTipoIcon()} size={14} color="#FFFFFF" />
                <Text style={styles.tipoBadgeText}>{getTipoLabel()}</Text>
            </View>

            <View style={styles.acoesBotoes}>
                <TouchableOpacity
                    style={styles.editarButton}
                    onPress={() => onEditar(servico.id)}
                >
                    <Feather name="edit-2" size={18} color="#8B6B4F" />
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.excluirButton}
                    onPress={() => onExcluir(servico.id)}
                >
                    <Feather name="trash-2" size={22} color="#8B6B4F" />
                </TouchableOpacity>
            </View>

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.fotosScroll}
            >
                {servico.fotos.map((foto, index) => (
                    <Image
                        key={index}
                        source={{ uri: foto }}
                        style={styles.fotoServico}
                    />
                ))}
                {servico.fotos.length === 0 && (
                    <View style={styles.semFotoContainer}>
                        <Feather name="image" size={40} color={colors.cinza} />
                        <Text style={styles.semFotoTexto}>Sem fotos</Text>
                    </View>
                )}
            </ScrollView>

            <View style={styles.cardBody}>
                <Text style={styles.servicoNome}>{servico.nome}</Text>
                <Text style={styles.servicoDescricao} numberOfLines={2}>
                    {servico.descricao}
                </Text>

                {servico.endereco && (
                    <View style={styles.enderecoInfo}>
                        <Feather name="map-pin" size={14} color={colors.cinza} />
                        <Text style={styles.enderecoTexto} numberOfLines={1}>
                            {servico.endereco}
                        </Text>
                    </View>
                )}

                <View style={styles.valorContainer}>
                    <Text style={styles.valorLabel}>Valor médio:</Text>
                    <Text style={styles.valorTexto}>R$ {formatarValor(servico.valor)}</Text>
                </View>
            </View>
        </View>
    );
}

// -------------------- MAIN COMPONENT -------------------- //

export default function MeusServicos() {
    const router = useRouter();
    const [servicos, setServicos] = useState([]);
    const [popupExcluirVisible, setPopupExcluirVisible] = useState(false);
    const [servicoSelecionado, setServicoSelecionado] = useState(null);

    const carregarServicos = useCallback(async () => {
        try {
            await initDatabase();
            const userId = await AsyncStorage.getItem('userId');
            const idPrestador = userId ? Number(userId) : 1;
            const rows = await getAllServicos(idPrestador);

            const mapped = rows.map(row => ({
                id: row.id_servico,
                nome: row.titulo,
                descricao: row.descricao || '',
                endereco: row.endereco !== 'Remoto/Digital' ? row.endereco : null,
                tipo: !row.endereco || row.endereco === 'Remoto/Digital' ? 'digital' : 'presencial',
                valor: row.preco,
                fotos: row.imagem ? [row.imagem] : [],
            }));

            setServicos(mapped);
        } catch (error) {
            console.error('Erro ao carregar serviços:', error);
            Alert.alert('Erro', 'Não foi possível carregar os serviços.');
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            carregarServicos();
        }, [carregarServicos])
    );

    const handleExcluir = (id) => {
        const servico = servicos.find(s => s.id === id);
        if (servico) {
            setServicoSelecionado(servico);
            setPopupExcluirVisible(true);
        }
    };

    const confirmarExclusao = async () => {
        if (!servicoSelecionado) return;
        try {
            await deleteServico(servicoSelecionado.id);
            setPopupExcluirVisible(false);
            setServicoSelecionado(null);
            Alert.alert('Sucesso', 'Serviço excluído com sucesso!');
            await carregarServicos();
        } catch (error) {
            console.error('Erro ao excluir serviço:', error);
            Alert.alert('Erro', 'Não foi possível excluir o serviço.');
        }
    };

    const handleEditar = (id) => {
        router.push({ pathname: '/cadastrarServico', params: { servicoId: id } });
    };

    return (
        <View style={{ flex: 1, backgroundColor: colors.creme }}>
            <ScrollView
                style={styles.container}
                contentContainerStyle={[styles.content, { paddingBottom: 100 }]}
                showsVerticalScrollIndicator={false}
            >
                <Text style={styles.titulo}>MEUS SERVIÇOS</Text>

                {servicos.length === 0 ? (
                    <View style={styles.emptyState}>
                        <Feather name="briefcase" size={80} color={colors.cinza} />
                        <Text style={styles.emptyStateTitle}>Nenhum serviço criado</Text>
                        <Text style={styles.emptyStateText}>
                            Você ainda não tem nenhum serviço cadastrado.
                        </Text>
                    </View>
                ) : (
                    servicos.map(servico => (
                        <CardMeuServico
                            key={servico.id}
                            servico={servico}
                            onExcluir={handleExcluir}
                            onEditar={handleEditar}
                        />
                    ))
                )}
            </ScrollView>

            <Footer />

            <PopupExcluirServico
                visible={popupExcluirVisible}
                onClose={() => {
                    setPopupExcluirVisible(false);
                    setServicoSelecionado(null);
                }}
                onConfirm={confirmarExclusao}
                nomeServico={servicoSelecionado?.nome || ''}
            />
        </View>
    );
}

// -------------------- STYLES -------------------- //

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        paddingHorizontal: 20,
        paddingTop: 40,
        paddingBottom: 40,
    },
    titulo: {
        fontSize: 25,
        fontWeight: 'bold',
        color: colors.preto,
        textAlign: 'center',
        marginBottom: 30,
    },
    card: {
        backgroundColor: colors.creme,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: colors.marromClaro,
        marginBottom: 20,
        overflow: 'hidden',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 3,
        position: 'relative',
    },
    tipoBadge: {
        position: 'absolute',
        top: 10,
        left: 10,
        zIndex: 10,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.cinza,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 15,
        gap: 4,
        elevation: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    tipoBadgeText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: '600',
    },
    acoesBotoes: {
        position: 'absolute',
        top: 10,
        right: 10,
        zIndex: 10,
        flexDirection: 'row',
        gap: 8,
    },
    editarButton: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    excluirButton: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    fotosScroll: {
        paddingHorizontal: 15,
        paddingVertical: 15,
        backgroundColor: colors.bege,
    },
    fotoServico: {
        width: 100,
        height: 100,
        borderRadius: 10,
        marginRight: 10,
        borderWidth: 1,
        borderColor: colors.marromClaro,
    },
    semFotoContainer: {
        width: 100,
        height: 100,
        borderRadius: 10,
        backgroundColor: colors.creme,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.marromClaro,
        borderStyle: 'dashed',
    },
    semFotoTexto: {
        fontSize: 12,
        color: colors.cinza,
        marginTop: 4,
    },
    cardBody: {
        padding: 15,
    },
    servicoNome: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.preto,
        marginBottom: 5,
    },
    servicoDescricao: {
        fontSize: 14,
        color: colors.cinza,
        lineHeight: 20,
        marginBottom: 10,
    },
    enderecoInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        backgroundColor: colors.bege,
        padding: 8,
        borderRadius: 8,
        marginBottom: 10,
    },
    enderecoTexto: {
        fontSize: 12,
        color: colors.cinza,
        flex: 1,
    },
    valorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        paddingTop: 10,
        borderTopWidth: 1,
        borderTopColor: colors.marromClaro,
    },
    valorLabel: {
        fontSize: 14,
        color: colors.cinza,
    },
    valorTexto: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.marrom,
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
    },
    emptyStateTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: colors.preto,
        marginTop: 20,
        marginBottom: 10,
    },
    emptyStateText: {
        fontSize: 16,
        color: colors.cinza,
        textAlign: 'center',
        paddingHorizontal: 40,
    },
    popupOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    popupContainer: {
        width: '85%',
        backgroundColor: colors.creme,
        borderRadius: 20,
        padding: 24,
        alignItems: 'center',
    },
    popupIconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: colors.bege,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    popupTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: colors.marrom,
        marginBottom: 12,
        textAlign: 'center',
    },
    popupMessage: {
        fontSize: 16,
        color: colors.preto,
        textAlign: 'center',
        marginBottom: 24,
    },
    popupButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        gap: 12,
    },
    popupButton: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
    },
    popupCancelButton: {
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: colors.marrom,
    },
    popupCancelButtonText: {
        color: colors.marrom,
        fontSize: 16,
        fontWeight: '600',
    },
    popupConfirmButton: {
        backgroundColor: colors.marrom,
    },
    popupConfirmButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
});
