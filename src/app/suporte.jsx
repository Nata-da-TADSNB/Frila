import { Footer } from "@/components/footer";
import Colors from "@/constants/Colors";
import { Feather } from '@expo/vector-icons';
import { useRouter } from "expo-router";
import { useState } from 'react';
import {
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";

function PopupSuporte({ visible, onClose, onEnviar }) {
    const [email, setEmail] = useState('');
    const [assunto, setAssunto] = useState('');

    const handleEnviar = () => {
        if (email && assunto) {
            onEnviar(email, assunto);
            setEmail('');
            setAssunto('');
            onClose();
        }
    };

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitulo}>FALAR COM SUPORTE</Text>
                        <TouchableOpacity onPress={onClose}>
                            <Feather name="x" size={24} color={Colors.marromClaro} />
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.modalLabel}>Seu e-mail:</Text>
                    <TextInput
                        style={styles.modalInput}
                        placeholder="Digite seu e-mail"
                        placeholderTextColor={Colors.marromClaro}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        value={email}
                        onChangeText={setEmail}
                    />

                    <Text style={styles.modalLabel}>Assunto:</Text>
                    <TextInput
                        style={[styles.modalInput, styles.modalTextArea]}
                        placeholder="Descreva seu problema ou dúvida"
                        placeholderTextColor={Colors.marromClaro}
                        multiline
                        numberOfLines={4}
                        textAlignVertical="top"
                        value={assunto}
                        onChangeText={setAssunto}
                    />

                    <TouchableOpacity
                        style={[
                            styles.modalBotaoEnviar,
                            (!email || !assunto) && styles.modalBotaoEnviarDisabled
                        ]}
                        onPress={handleEnviar}
                        disabled={!email || !assunto}
                    >
                        <Text style={styles.modalBotaoEnviarText}>ENVIAR</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}

function PerguntaFrequente({ pergunta, resposta }) {
    const [aberto, setAberto] = useState(false);

    return (
        <View style={styles.perguntaContainer}>
            <TouchableOpacity
                style={styles.perguntaHeader}
                onPress={() => setAberto(!aberto)}
                activeOpacity={0.7}
            >
                <Text style={styles.perguntaTexto}>{pergunta}</Text>
                <Feather
                    name={aberto ? "chevron-up" : "chevron-down"}
                    size={24}
                    color={Colors.marrom}
                />
            </TouchableOpacity>

            {aberto && (
                <View style={styles.respostaContainer}>
                    <Text style={styles.respostaTexto}>{resposta}</Text>
                </View>
            )}
        </View>
    );
}

export default function Suporte() {
    const router = useRouter();
    const [popupSuporteVisible, setPopupSuporteVisible] = useState(false);

    const perguntasFrequentes = [
        {
            pergunta: "Como posso comprar um serviço?",
            resposta: "Para comprar um serviço, navegue pelos anúncios disponíveis na página inicial, selecione o serviço desejado e clique em 'Comprar'. Você será direcionado para a página de pagamento."
        },
        {
            pergunta: "Como me torno um freelancer?",
            resposta: "Para se tornar um freelancer, acesse seu perfil e clique em 'Tornar-se freelancer'. Preencha as informações solicitadas e aguarde a aprovação da nossa equipe."
        },
        {
            pergunta: "Como recebo pagamentos?",
            resposta: "Os pagamentos são processados pela plataforma e liberados para sua conta após a conclusão do serviço e confirmação do comprador. Você pode sacar os valores para sua conta bancária."
        },
        {
            pergunta: "Qual a taxa da plataforma?",
            resposta: "A plataforma cobra uma taxa de 10% sobre o valor total do serviço. Este valor é descontado automaticamente no momento da venda."
        },
        {
            pergunta: "Posso cancelar um serviço?",
            resposta: "Sim, é possível cancelar um serviço antes do pagamento. Após o pagamento, entre em contato com o vendedor para negociar o cancelamento ou com nosso suporte."
        },
        {
            pergunta: "Como entro em contato com o vendedor?",
            resposta: "Após contratar um serviço, você pode conversar com o vendedor através do chat disponível na página do serviço contratado."
        }
    ];

    const handleEnviarSuporte = (email, assunto) => {
        console.log('Email:', email);
        console.log('Assunto:', assunto);

        alert('Mensagem enviada com sucesso! Em breve retornaremos o contato.');
    };

    return (
        <>
            <ScrollView
                style={styles.container}
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >
                <Text style={styles.titulo}>SUPORTE</Text>

                <View style={styles.duvidasHeader}>
                    <Feather name="help-circle" size={24} color={Colors.marrom} />
                    <Text style={styles.duvidasTitulo}>DÚVIDAS FREQUENTES</Text>
                </View>

                <View style={styles.perguntasLista}>
                    {perguntasFrequentes.map((item, index) => (
                        <PerguntaFrequente
                            key={index}
                            pergunta={item.pergunta}
                            resposta={item.resposta}
                        />
                    ))}
                </View>

                <View style={styles.suporteContainer}>
                    <Text style={styles.suporteTexto}>
                        Não encontrou o que procurava?
                    </Text>
                    <Text style={styles.suporteSubtexto}>
                        Nossa equipe está pronta para ajudar você!
                    </Text>

                    <TouchableOpacity
                        style={styles.botaoSuporte}
                        onPress={() => setPopupSuporteVisible(true)}
                        activeOpacity={0.8}
                    >
                        <Feather name="headphones" size={24} color={Colors.creme} />
                        <Text style={styles.botaoSuporteText}>FALAR COM SUPORTE</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.infoContato}>
                    <View style={styles.infoItem}>
                        <Feather name="mail" size={20} color={Colors.marrom} />
                        <Text style={styles.infoTexto}>suporte@frila.com</Text>
                    </View>
                    <View style={styles.infoItem}>
                        <Feather name="clock" size={20} color={Colors.marrom} />
                        <Text style={styles.infoTexto}>Segunda a Sexta, 9h às 18h</Text>
                    </View>
                </View>
            </ScrollView>

            <PopupSuporte
                visible={popupSuporteVisible}
                onClose={() => setPopupSuporteVisible(false)}
                onEnviar={handleEnviarSuporte}
            />

            <Footer />
        </>

    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.creme,
    },
    content: {
        paddingHorizontal: 20,
        paddingTop: 40,
        paddingBottom: 40,
    },
    titulo: {
        fontSize: 25,
        fontWeight: 'bold',
        color: Colors.marrom,
        textAlign: 'center',
        marginBottom: 30,
    },
    duvidasHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 20,
    },
    duvidasTitulo: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.marrom,
        flex: 1,
    },
    perguntasLista: {
        gap: 10,
        marginBottom: 30,
    },
    perguntaContainer: {
        backgroundColor: Colors.bege,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: Colors.marromClaro,
        overflow: 'hidden',
    },
    perguntaHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        backgroundColor: Colors.bege,
    },
    perguntaTexto: {
        fontSize: 16,
        color: Colors.marrom,
        fontWeight: '600',
        flex: 1,
        marginRight: 10,
    },
    respostaContainer: {
        padding: 20,
        paddingTop: 15,
        backgroundColor: Colors.creme,
        borderTopWidth: 1,
        borderTopColor: Colors.marromClaro,
    },
    respostaTexto: {
        fontSize: 14,
        color: Colors.cinza,
        lineHeight: 20,
    },
    suporteContainer: {
        backgroundColor: Colors.bege,
        borderRadius: 20,
        padding: 25,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.marromClaro,
        marginBottom: 30,
        shadowColor: Colors.marrom,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 3,
    },
    suporteTexto: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.marrom,
        marginBottom: 5,
        textAlign: 'center',
    },
    suporteSubtexto: {
        fontSize: 14,
        color: Colors.cinza,
        marginBottom: 20,
        textAlign: 'center',
    },
    botaoSuporte: {
        backgroundColor: Colors.marrom,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        paddingVertical: 15,
        paddingHorizontal: 25,
        borderRadius: 30,
        width: '100%',
        shadowColor: Colors.marrom,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    botaoSuporteText: {
        color: Colors.creme,
        fontSize: 16,
        fontWeight: 'bold',
    },
    infoContato: {
        gap: 15,
        marginBottom: 60,
    },
    infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    infoTexto: {
        fontSize: 14,
        color: Colors.cinza,
        flex: 1,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContainer: {
        width: '100%',
        backgroundColor: Colors.creme,
        borderRadius: 20,
        padding: 24,
        shadowColor: Colors.marrom,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    modalTitulo: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.marrom,
    },
    modalLabel: {
        fontSize: 16,
        color: Colors.marrom,
        marginBottom: 8,
        fontWeight: '600',
    },
    modalInput: {
        backgroundColor: Colors.bege,
        borderRadius: 12,
        padding: 15,
        fontSize: 16,
        color: Colors.marrom,
        borderWidth: 1,
        borderColor: Colors.marromClaro,
        marginBottom: 20,
    },
    modalTextArea: {
        minHeight: 100,
        textAlignVertical: 'top',
    },
    modalBotaoEnviar: {
        backgroundColor: Colors.marrom,
        borderRadius: 15,
        padding: 15,
        alignItems: 'center',
        marginTop: 10,
    },
    modalBotaoEnviarDisabled: {
        backgroundColor: Colors.marromClaro,
    },
    modalBotaoEnviarText: {
        color: Colors.creme,
        fontSize: 16,
        fontWeight: 'bold',
    },
}); 