import colors from "@/constants/Colors";
import { createServico, getServicoById, initDatabase, updateServico } from "@/database/database";
import { Feather } from '@expo/vector-icons';
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";

// ---------- helpers ----------

function parseEndereco(enderecoStr) {
    // Formato salvo: "Logradouro, Numero - Bairro, Cidade/UF - CEP: 00000000"
    const match = enderecoStr.match(/^(.*?),\s*(.*?)\s*-\s*(.*?),\s*(.*?)\/(.*?)\s*-\s*CEP:\s*(.*)$/);
    if (match) {
        return {
            logradouro: match[1].trim(),
            numero:     match[2].trim(),
            bairro:     match[3].trim(),
            cidade:     match[4].trim(),
            estado:     match[5].trim(),
            cep:        match[6].trim(),
        };
    }
    // Formato antigo (campo único) — coloca tudo no logradouro
    return { logradouro: enderecoStr, numero: '', bairro: '', cidade: '', estado: '', cep: '' };
}

async function sincronizarBanco(dadosServico) {
    const apiUrl = process.env.EXPO_PUBLIC_API_URL;
    if (!apiUrl) return; // frila-api não configurado, ignora silenciosamente

    try {
        await fetch(`${apiUrl}/servicos`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Bypass-Tunnel-Reminder': 'true',
            },
            body: JSON.stringify(dadosServico),
        });
    } catch {
        // Servidor offline ou fora da rede — falha silenciosa, SQLite já salvou
    }
}

// ---------- modals ----------

function PopupSucesso({ visible, onClose, modoEdicao }) {
    const router = useRouter();

    const handleOk = () => {
        onClose();
        setTimeout(() => router.replace("/dashboard"), 100);
    };

    return (
        <Modal animationType="fade" transparent visible={visible} onRequestClose={handleOk}>
            <View style={styles.popupOverlay}>
                <View style={styles.popupContainer}>
                    <View style={styles.popupIconContainer}>
                        <Feather name="check-circle" size={50} color="#333333" />
                    </View>
                    <Text style={styles.popupTitle}>
                        {modoEdicao ? 'SERVIÇO ATUALIZADO!' : 'SERVIÇO CRIADO!'}
                    </Text>
                    <Text style={styles.popupMessage}>
                        {modoEdicao
                            ? 'Seu serviço foi atualizado com sucesso.'
                            : 'Seu serviço foi criado com sucesso.'}
                    </Text>
                    <TouchableOpacity style={[styles.popupButton, styles.popupButtonConfirm]} onPress={handleOk}>
                        <Text style={styles.popupButtonConfirmText}>OK</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}

function PopupCancelar({ visible, onClose, onConfirm }) {
    return (
        <Modal animationType="fade" transparent visible={visible} onRequestClose={onClose}>
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
                        <TouchableOpacity style={[styles.popupButton, styles.popupButtonCancel]} onPress={onClose}>
                            <Text style={styles.popupButtonCancelText}>NÃO</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.popupButton, styles.popupButtonConfirm]} onPress={onConfirm}>
                            <Text style={styles.popupButtonConfirmText}>SIM</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

// ---------- main screen ----------

export default function AdicionarServico() {
    const router = useRouter();
    const { servicoId } = useLocalSearchParams();
    const modoEdicao = !!servicoId;

    // auth
    const [idPrestador, setIdPrestador] = useState(1);

    // fotos
    const [fotos, setFotos] = useState([]);

    // dados básicos
    const [nome, setNome] = useState('');
    const [descricao, setDescricao] = useState('');

    // tipo de serviço
    const [tipoServico, setTipoServico] = useState(null);
    const [mostrarEndereco, setMostrarEndereco] = useState(false);

    // endereço (ViaCEP)
    const [cep, setCep] = useState('');
    const [logradouro, setLogradouro] = useState('');
    const [numero, setNumero] = useState('');
    const [bairro, setBairro] = useState('');
    const [cidade, setCidade] = useState('');
    const [estado, setEstado] = useState('');
    const [buscandoCep, setBuscandoCep] = useState(false);

    // valor
    const [valorMedio, setValorMedio] = useState('100');

    // modais
    const [popupSucessoVisible, setPopupSucessoVisible] = useState(false);
    const [popupCancelarVisible, setPopupCancelarVisible] = useState(false);

    const taxaPlataforma = 0.10;
    const valorNumerico = parseFloat(valorMedio) || 0;
    const valorTaxa = valorNumerico * taxaPlataforma;
    const valorReceber = valorNumerico - valorTaxa;

    // ---------- init ----------

    useEffect(() => {
        async function init() {
            await initDatabase();
            const id = await AsyncStorage.getItem('userId');
            if (id) setIdPrestador(Number(id));

            if (modoEdicao) {
                try {
                    const servico = await getServicoById(Number(servicoId));
                    if (!servico) return;
                    setNome(servico.titulo);
                    setDescricao(servico.descricao || '');
                    setValorMedio(String(servico.preco));
                    if (servico.imagem) setFotos([servico.imagem]);

                    const isPresencial = servico.endereco && servico.endereco !== 'Remoto/Digital';
                    if (isPresencial) {
                        setTipoServico('presencial');
                        setMostrarEndereco(true);
                        const parsed = parseEndereco(servico.endereco);
                        setCep(parsed.cep);
                        setLogradouro(parsed.logradouro);
                        setNumero(parsed.numero);
                        setBairro(parsed.bairro);
                        setCidade(parsed.cidade);
                        setEstado(parsed.estado);
                    } else {
                        setTipoServico('digital');
                        setMostrarEndereco(false);
                    }
                } catch (err) {
                    console.error('Erro ao carregar serviço:', err);
                }
            }
        }
        init();
    }, [servicoId]);

    // ---------- ViaCEP ----------

    const buscarCep = async (cepDigitado) => {
        const cepLimpo = cepDigitado.replace(/\D/g, '');
        setCep(cepDigitado);

        if (cepLimpo.length !== 8) return;

        setBuscandoCep(true);
        try {
            const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
            const data = await response.json();
            if (data.erro) {
                Alert.alert('CEP não encontrado', 'Verifique o CEP digitado e tente novamente.');
                return;
            }
            setLogradouro(data.logradouro || '');
            setBairro(data.bairro || '');
            setCidade(data.localidade || '');
            setEstado(data.uf || '');
        } catch (err) {
            Alert.alert('Erro', 'Não foi possível buscar o CEP. Verifique sua conexão.');
        } finally {
            setBuscandoCep(false);
        }
    };

    // ---------- fotos ----------

    const pickImage = async (index) => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });
        if (!result.canceled && result.assets?.[0]) {
            const novasFotos = [...fotos];
            novasFotos[index] = result.assets[0].uri;
            setFotos(novasFotos);
        }
    };

    const removerFoto = (index) => {
        setFotos(fotos.filter((_, i) => i !== index));
    };

    // ---------- tipo de serviço ----------

    const selecionarTipoServico = (tipo) => {
        setTipoServico(tipo);
        setMostrarEndereco(tipo === 'presencial' || tipo === 'delivery');
        if (tipo === 'digital') {
            setCep(''); setLogradouro(''); setNumero('');
            setBairro(''); setCidade(''); setEstado('');
        }
    };

    // ---------- salvar ----------

    const handleCriar = async () => {
        if (!nome.trim()) {
            Alert.alert('Atenção', 'O nome do serviço é obrigatório.');
            return;
        }
        if (!valorNumerico || valorNumerico <= 0) {
            Alert.alert('Atenção', 'Informe um valor válido para o serviço.');
            return;
        }

        const enderecoFinal = mostrarEndereco
            ? `${logradouro}, ${numero} - ${bairro}, ${cidade}/${estado} - CEP: ${cep.replace(/\D/g, '')}`
            : 'Remoto/Digital';

        const imagemFinal = fotos[0] || null;

        try {
            let idServico;

            if (modoEdicao) {
                await updateServico(
                    Number(servicoId),
                    nome.trim(), descricao.trim(),
                    enderecoFinal, valorNumerico, valorReceber, imagemFinal
                );
                idServico = Number(servicoId);
            } else {
                idServico = await createServico(
                    idPrestador,
                    nome.trim(), descricao.trim(),
                    enderecoFinal, valorNumerico, valorReceber, imagemFinal
                );
            }

            // Sincronizar com frila-api/banco.sqlite (falha silenciosa se offline)
            sincronizarBanco({
                id_servico:      idServico,
                id_prestador:    idPrestador,
                titulo:          nome.trim(),
                descricao:       descricao.trim(),
                cep:             cep.replace(/\D/g, ''),
                logradouro,
                numero,
                bairro,
                cidade,
                estado,
                endereco_completo: enderecoFinal,
                preco:           valorNumerico,
                preco_total:     valorReceber,
                imagem:          imagemFinal,
                salvo_em:        new Date().toISOString(),
            });

            setPopupSucessoVisible(true);
        } catch (error) {
            console.error('Erro ao salvar serviço:', error);
            Alert.alert('Erro', 'Não foi possível salvar o serviço.');
        }
    };

    const handleCancelar = () => setPopupCancelarVisible(true);

    const confirmarCancelar = () => {
        setPopupCancelarVisible(false);
        router.replace("/dashboard");
    };

    const handleFecharPopup = () => {
        setPopupSucessoVisible(false);
        router.replace("/dashboard");
    };

    // ---------- render ----------

    return (
        <>
            <ScrollView
                style={styles.container}
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >
                <Text style={styles.titulo}>
                    {modoEdicao ? 'EDITAR SERVIÇO' : 'ADICIONAR SERVIÇO'}
                </Text>

                {/* FOTOS */}
                <View style={styles.fotosContainer}>
                    {[0, 1, 2].map((index) => (
                        <TouchableOpacity key={index} style={styles.fotoBox} onPress={() => pickImage(index)}>
                            {fotos[index] ? (
                                <View style={styles.fotoWrapper}>
                                    <Image source={{ uri: fotos[index] }} style={styles.foto} />
                                    <TouchableOpacity style={styles.removerFoto} onPress={() => removerFoto(index)}>
                                        <Feather name="x" size={20} color="#FFFFFF" />
                                    </TouchableOpacity>
                                </View>
                            ) : (
                                <Feather name="plus" size={40} color="#999999" />
                            )}
                        </TouchableOpacity>
                    ))}
                </View>

                {/* NOME E DESCRIÇÃO */}
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

                {/* TIPO DE SERVIÇO */}
                <View style={styles.tipoContainer}>
                    {[
                        { key: 'digital',    icon: 'monitor',  label: 'Digital'    },
                        { key: 'presencial', icon: 'map-pin',  label: 'Presencial' },
                        { key: 'delivery',   icon: 'truck',    label: 'Delivery'   },
                    ].map(({ key, icon, label }) => (
                        <TouchableOpacity
                            key={key}
                            style={[styles.tipoButton, tipoServico === key && styles.tipoButtonAtivo]}
                            onPress={() => selecionarTipoServico(key)}
                        >
                            <Feather name={icon} size={24} color={tipoServico === key ? '#333333' : '#999999'} />
                            <Text style={[styles.tipoText, tipoServico === key && styles.tipoTextAtivo]}>
                                {label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* ENDEREÇO (ViaCEP) */}
                {mostrarEndereco && (
                    <View style={styles.enderecoContainer}>

                        {/* CEP */}
                        <View style={styles.cepRow}>
                            <TextInput
                                style={[styles.input, styles.cepInput]}
                                placeholder="CEP (somente números)"
                                placeholderTextColor="#999999"
                                keyboardType="numeric"
                                maxLength={8}
                                value={cep}
                                onChangeText={buscarCep}
                            />
                            {buscandoCep && (
                                <ActivityIndicator
                                    size="small"
                                    color={colors.marrom}
                                    style={styles.cepLoader}
                                />
                            )}
                        </View>

                        {/* Logradouro */}
                        <TextInput
                            style={styles.input}
                            placeholder="Logradouro"
                            placeholderTextColor="#999999"
                            value={logradouro}
                            onChangeText={setLogradouro}
                        />

                        {/* Número */}
                        <TextInput
                            style={styles.input}
                            placeholder="Número"
                            placeholderTextColor="#999999"
                            keyboardType="numeric"
                            value={numero}
                            onChangeText={setNumero}
                        />

                        {/* Bairro */}
                        <TextInput
                            style={styles.input}
                            placeholder="Bairro"
                            placeholderTextColor="#999999"
                            value={bairro}
                            onChangeText={setBairro}
                        />

                        {/* Cidade + Estado */}
                        <View style={styles.cidadeRow}>
                            <TextInput
                                style={[styles.input, styles.cidadeInput]}
                                placeholder="Cidade"
                                placeholderTextColor="#999999"
                                value={cidade}
                                onChangeText={setCidade}
                            />
                            <TextInput
                                style={[styles.input, styles.estadoInput]}
                                placeholder="UF"
                                placeholderTextColor="#999999"
                                maxLength={2}
                                autoCapitalize="characters"
                                value={estado}
                                onChangeText={setEstado}
                            />
                        </View>
                    </View>
                )}

                {/* VALOR */}
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

                {/* BOTÕES */}
                <View style={styles.botoesContainer}>
                    <TouchableOpacity style={styles.botaoCancelar} onPress={handleCancelar} activeOpacity={0.8}>
                        <Text style={styles.botaoCancelarText}>CANCELAR</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.botaoCriar} onPress={handleCriar} activeOpacity={0.8}>
                        <Text style={styles.botaoCriarText}>{modoEdicao ? 'SALVAR' : 'CRIAR'}</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>

            <PopupSucesso visible={popupSucessoVisible} onClose={handleFecharPopup} modoEdicao={modoEdicao} />
            <PopupCancelar
                visible={popupCancelarVisible}
                onClose={() => setPopupCancelarVisible(false)}
                onConfirm={confirmarCancelar}
            />
        </>
    );
}

// ---------- styles ----------

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
        gap: 12,
        marginBottom: 30,
    },
    cepRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    cepInput: {
        flex: 1,
    },
    cepLoader: {
        marginLeft: 4,
    },
    cidadeRow: {
        flexDirection: 'row',
        gap: 12,
    },
    cidadeInput: {
        flex: 3,
    },
    estadoInput: {
        flex: 1,
        textAlign: 'center',
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
