import colors from "@/constants/Colors";
import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from "expo-router";
import React, { useState } from 'react';
import {
    Image,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";

function PopupSucesso({ visible, onClose }) {
    const router = useRouter();

    const handleOk = () => {
        onClose();
        setTimeout(() => {
            router.replace("/dashboard");
        }, 100);
    };

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={handleOk}
        >
            <View style={styles.popupOverlay}>
                <View style={styles.popupContainer}>
                    <View style={styles.popupIconContainer}>
                        <Feather name="check-circle" size={50} color="#333333" />
                    </View>

                    <Text style={styles.popupTitle}>SERVIÇO CRIADO!</Text>

                    <Text style={styles.popupMessage}>
                        Seu serviço foi criado com sucesso.
                    </Text>

                    <TouchableOpacity
                        style={[styles.popupButton, styles.popupButtonConfirm]}
                        onPress={handleOk}
                    >
                        <Text style={styles.popupButtonConfirmText}>OK</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}

function PopupCancelar({ visible, onClose, onConfirm }) {
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
                        <Feather name="x-circle" size={50} color="#999999" />
                    </View>

                    <Text style={styles.popupTitle}>CANCELAR SERVIÇO</Text>

                    <Text style={styles.popupMessage}>
                        Tem certeza que deseja cancelar? As informações não serão salvas.
                    </Text>

                    <View style={styles.popupButtonsContainer}>
                        <TouchableOpacity
                            style={[styles.popupButton, styles.popupButtonCancel]}
                            onPress={onClose}
                        >
                            <Text style={styles.popupButtonCancelText}>NÃO</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.popupButton, styles.popupButtonConfirm]}
                            onPress={onConfirm}
                        >
                            <Text style={styles.popupButtonConfirmText}>SIM</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

export default function AdicionarServico() {
    const router = useRouter();
    const [fotos, setFotos] = useState([]);
    const [nome, setNome] = useState('');
    const [descricao, setDescricao] = useState('');
    const [tipoServico, setTipoServico] = useState(null);
    const [endereco, setEndereco] = useState('');
    const [valorMedio, setValorMedio] = useState('100');
    const [mostrarEndereco, setMostrarEndereco] = useState(false);
    const [popupSucessoVisible, setPopupSucessoVisible] = useState(false);
    const [popupCancelarVisible, setPopupCancelarVisible] = useState(false);

    const taxaPlataforma = 0.10;
    const valorNumerico = parseFloat(valorMedio) || 0;
    const valorTaxa = valorNumerico * taxaPlataforma;
    const valorReceber = valorNumerico - valorTaxa;

    const pickImage = async (index) => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled && result.assets && result.assets[0]) {
            const novasFotos = [...fotos];
            novasFotos[index] = result.assets[0].uri;
            setFotos(novasFotos);
        }
    };

    const removerFoto = (index) => {
        const novasFotos = fotos.filter((_, i) => i !== index);
        setFotos(novasFotos);
    };

    const selecionarTipoServico = (tipo) => {
        setTipoServico(tipo);
        setMostrarEndereco(tipo === 'presencial' || tipo === 'delivery');
        if (tipo === 'digital') {
            setEndereco('');
        }
    };

    const handleCriar = () => {
        console.log({
            fotos,
            nome,
            descricao,
            tipoServico,
            endereco: mostrarEndereco ? endereco : null,
            valorMedio: valorNumerico,
            valorTaxa,
            valorReceber
        });

        setPopupSucessoVisible(true);
    };

    const handleCancelar = () => {
        setPopupCancelarVisible(true);
    };

    const confirmarCancelar = () => {
        setPopupCancelarVisible(false);
        router.replace("/dashboard");
    };

    const handleFecharPopup = () => {
        setPopupSucessoVisible(false);
        router.replace("/dashboard");
    };

    return (
        <>
            <ScrollView
                style={styles.container}
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >
                <Text style={styles.titulo}>ADICIONAR SERVIÇO</Text>

                <View style={styles.fotosContainer}>
                    {[0, 1, 2].map((index) => (
                        <TouchableOpacity
                            key={index}
                            style={styles.fotoBox}
                            onPress={() => pickImage(index)}
                        >
                            {fotos[index] ? (
                                <View style={styles.fotoWrapper}>
                                    <Image source={{ uri: fotos[index] }} style={styles.foto} />
                                    <TouchableOpacity
                                        style={styles.removerFoto}
                                        onPress={() => removerFoto(index)}
                                    >
                                        <Feather name="x" size={20} color="#FFFFFF" />
                                    </TouchableOpacity>
                                </View>
                            ) : (
                                <Feather name="plus" size={40} color="#999999" />
                            )}
                        </TouchableOpacity>
                    ))}
                </View>

                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Nome"
                        placeholderTextColor="#999999"
                        value={nome}
                        onChangeText={setNome}
                    />

                    <TextInput
                        style={[styles.input, styles.textArea]}
                        placeholder="Descrição"
                        placeholderTextColor="#999999"
                        multiline
                        numberOfLines={4}
                        textAlignVertical="top"
                        value={descricao}
                        onChangeText={setDescricao}
                    />
                </View>

                <View style={styles.tipoContainer}>
                    <TouchableOpacity
                        style={[
                            styles.tipoButton,
                            tipoServico === 'digital' && styles.tipoButtonAtivo
                        ]}
                        onPress={() => selecionarTipoServico('digital')}
                    >
                        <Feather
                            name="monitor"
                            size={24}
                            color={tipoServico === 'digital' ? '#333333' : '#999999'}
                        />
                        <Text style={[
                            styles.tipoText,
                            tipoServico === 'digital' && styles.tipoTextAtivo
                        ]}>
                            Digital
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.tipoButton,
                            tipoServico === 'presencial' && styles.tipoButtonAtivo
                        ]}
                        onPress={() => selecionarTipoServico('presencial')}
                    >
                        <Feather
                            name="map-pin"
                            size={24}
                            color={tipoServico === 'presencial' ? '#333333' : '#999999'}
                        />
                        <Text style={[
                            styles.tipoText,
                            tipoServico === 'presencial' && styles.tipoTextAtivo
                        ]}>
                            Presencial
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.tipoButton,
                            tipoServico === 'delivery' && styles.tipoButtonAtivo
                        ]}
                        onPress={() => selecionarTipoServico('delivery')}
                    >
                        <Feather
                            name="truck"
                            size={24}
                            color={tipoServico === 'delivery' ? '#333333' : '#999999'}
                        />
                        <Text style={[
                            styles.tipoText,
                            tipoServico === 'delivery' && styles.tipoTextAtivo
                        ]}>
                            Delivery
                        </Text>
                    </TouchableOpacity>
                </View>

                {mostrarEndereco && (
                    <View style={styles.enderecoContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="Endereço completo"
                            placeholderTextColor="#999999"
                            value={endereco}
                            onChangeText={setEndereco}
                        />
                    </View>
                )}

                <View style={styles.valorContainer}>
                    <Text style={styles.valorLabel}>Valor médio do serviço:</Text>

                    <View style={styles.valorInputContainer}>
                        <Text style={styles.valorSimbolo}>R$</Text>
                        <TextInput
                            style={styles.valorInput}
                            placeholder="100"
                            placeholderTextColor="#999999"
                            keyboardType="numeric"
                            value={valorMedio}
                            onChangeText={setValorMedio}
                        />
                    </View>

                    <Text style={styles.obsTexto}>
                        Obs.: Cobramos 10% do valor recebido pelo comprador.
                    </Text>

                    <View style={styles.divider} />

                    <View style={styles.calculoContainer}>
                        <View style={styles.calculoLinha}>
                            <Text style={styles.calculoLabel}>Valor total a receber:</Text>
                            <Text style={styles.calculoValor}>R$ {valorNumerico.toFixed(2)}</Text>
                        </View>

                        <View style={styles.calculoLinha}>
                            <Text style={styles.calculoLabel}>Taxa da plataforma (10%):</Text>
                            <Text style={styles.calculoValorTaxa}>- R$ {valorTaxa.toFixed(2)}</Text>
                        </View>

                        <View style={[styles.calculoLinha, styles.totalLinha]}>
                            <Text style={styles.totalLabel}>Você receberá:</Text>
                            <Text style={styles.totalValor}>R$ {valorReceber.toFixed(2)}</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.botoesContainer}>
                    <TouchableOpacity
                        style={styles.botaoCancelar}
                        onPress={handleCancelar}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.botaoCancelarText}>CANCELAR</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.botaoCriar}
                        onPress={handleCriar}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.botaoCriarText}>CRIAR</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>

            <PopupSucesso
                visible={popupSucessoVisible}
                onClose={handleFecharPopup}
            />

            <PopupCancelar
                visible={popupCancelarVisible}
                onClose={() => setPopupCancelarVisible(false)}
                onConfirm={confirmarCancelar}
            />
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
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
    fotosContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 30,
    },
    fotoBox: {
        width: 100,
        height: 100,
        backgroundColor: '#E0E0E0',
        borderRadius: 15,
        borderWidth: 2,
        borderColor: '#666666',
        borderStyle: 'dashed',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    fotoWrapper: {
        width: '100%',
        height: '100%',
        position: 'relative',
    },
    foto: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    removerFoto: {
        position: 'absolute',
        top: 5,
        right: 5,
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderRadius: 15,
        width: 24,
        height: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    inputContainer: {
        gap: 15,
        marginBottom: 30,
    },
    input: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 15,
        fontSize: 16,
        color: '#333333',
        borderWidth: 1,
        borderColor: '#CCCCCC',
    },
    textArea: {
        minHeight: 100,
        textAlignVertical: 'top',
    },
    tipoContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 30,
        gap: 10,
    },
    tipoButton: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 15,
        alignItems: 'center',
        gap: 8,
        borderWidth: 2,
        borderColor: '#CCCCCC',
    },
    tipoButtonAtivo: {
        borderColor: '#333333',
        backgroundColor: '#E0E0E0',
    },
    tipoText: {
        fontSize: 14,
        color: '#999999',
        fontWeight: '600',
    },
    tipoTextAtivo: {
        color: '#333333',
    },
    enderecoContainer: {
        marginBottom: 30,
    },
    valorContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 20,
        marginBottom: 30,
        borderWidth: 1,
        borderColor: '#CCCCCC',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 3,
    },
    valorLabel: {
        fontSize: 18,
        color: '#333333',
        fontWeight: '600',
        marginBottom: 10,
    },
    valorInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F5F5F5',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#CCCCCC',
        marginBottom: 15,
    },
    valorSimbolo: {
        fontSize: 18,
        color: '#333333',
        paddingLeft: 15,
        paddingRight: 5,
    },
    valorInput: {
        flex: 1,
        padding: 15,
        fontSize: 18,
        color: '#333333',
    },
    obsTexto: {
        fontSize: 14,
        color: '#666666',
        fontStyle: 'italic',
        marginBottom: 15,
    },
    divider: {
        height: 1,
        backgroundColor: '#CCCCCC',
        marginVertical: 15,
    },
    calculoContainer: {
        gap: 10,
    },
    calculoLinha: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    calculoLabel: {
        fontSize: 16,
        color: '#666666',
    },
    calculoValor: {
        fontSize: 16,
        color: '#333333',
        fontWeight: '600',
    },
    calculoValorTaxa: {
        fontSize: 16,
        color: '#FF4444',
        fontWeight: '600',
    },
    totalLinha: {
        marginTop: 5,
        paddingTop: 10,
        borderTopWidth: 1,
        borderTopColor: '#CCCCCC',
    },
    totalLabel: {
        fontSize: 18,
        color: colors.preto,
        fontWeight: 'bold',
    },
    totalValor: {
        fontSize: 24,
        color: colors.preto,
        fontWeight: 'bold',
    },
    botoesContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 15,
    },
    botaoCriar: {
        flex: 1,
        backgroundColor: '#333333',
        borderRadius: 15,
        padding: 18,
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    botaoCriarText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    botaoCancelar: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        borderRadius: 15,
        padding: 18,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#CCCCCC',
    },
    botaoCancelarText: {
        color: '#666666',
        fontSize: 18,
        fontWeight: 'bold',
    },
    popupOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    popupContainer: {
        width: '80%',
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 24,
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    popupIconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#E0E0E0',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    popupTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333333',
        marginBottom: 12,
        textAlign: 'center',
    },
    popupMessage: {
        fontSize: 16,
        color: '#666666',
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
        paddingVertical: 12,
        borderRadius: 25,
        alignItems: 'center',
    },
    popupButtonConfirm: {
        backgroundColor: '#333333',
    },
    popupButtonConfirmText: {
        color: '#FFFFFF',
        textAlign: 'center',
        fontSize: 16,
        fontWeight: '600',
        width: 200,
    },
    popupButtonCancel: {
        backgroundColor: '#FFFFFF',
        borderWidth: 2,
        borderColor: '#CCCCCC',
    },
    popupButtonCancelText: {
        color: '#666666',
        fontSize: 16,
        fontWeight: '600',
    },
});