import Background from "@/components/backgroundImage";
import {
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
    Alert,
    ActivityIndicator,
} from "react-native";

import { Input } from "@/components/input";
import colors from "@/constants/Colors";
import { createUser, seedPropostaAndrey } from "@/database/database";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useState } from "react";

export default function Cadastro() {
    const router = useRouter();

    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [cpf, setCpf] = useState('');
    const [telefone, setTelefone] = useState('');
    const [senha, setSenha] = useState('');
    const [confirmacaoSenha, setConfirmacaoSenha] = useState('');
    const [loading, setLoading] = useState(false);

    const formatCpf = (value) => {
        const digits = value.replace(/\D/g, '').slice(0, 11);
        return digits
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    };

    const formatTelefone = (value) => {
        const digits = value.replace(/\D/g, '').slice(0, 11);
        if (digits.length <= 10) {
            return digits
                .replace(/(\d{2})(\d)/, '($1) $2')
                .replace(/(\d{4})(\d)/, '$1-$2');
        }
        return digits
            .replace(/(\d{2})(\d)/, '($1) $2')
            .replace(/(\d{5})(\d)/, '$1-$2');
    };

    const validate = () => {
        if (!nome.trim() || !email.trim() || !cpf.trim() || !telefone.trim() || !senha.trim() || !confirmacaoSenha.trim()) {
            Alert.alert('Atenção', 'Preencha todos os campos.');
            return false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.trim())) {
            Alert.alert('Atenção', 'Informe um e-mail válido.');
            return false;
        }

        const cpfDigits = cpf.replace(/\D/g, '');
        if (cpfDigits.length !== 11) {
            Alert.alert('Atenção', 'CPF deve ter 11 dígitos.');
            return false;
        }

        const telDigits = telefone.replace(/\D/g, '');
        if (telDigits.length < 10) {
            Alert.alert('Atenção', 'Informe um telefone válido.');
            return false;
        }

        if (senha.length < 6) {
            Alert.alert('Atenção', 'A senha deve ter pelo menos 6 caracteres.');
            return false;
        }

        if (senha !== confirmacaoSenha) {
            Alert.alert('Atenção', 'As senhas não coincidem.');
            return false;
        }

        return true;
    };

    const handleCadastro = async () => {
        if (!validate()) return;

        setLoading(true);
        try {
            const userId = await createUser(
                nome.trim(),
                email.trim(),
                senha,
                cpf.replace(/\D/g, ''),
                telefone.replace(/\D/g, '')
            );
            await AsyncStorage.setItem('userId', String(userId));
            await seedPropostaAndrey(userId);
            router.replace('/home');
        } catch (error) {
            if (error.message?.includes('UNIQUE')) {
                Alert.alert('Erro', 'Este e-mail já está cadastrado.');
            } else {
                Alert.alert('Erro', 'Não foi possível realizar o cadastro.');
                console.error('Cadastro error:', error);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Background source={require("@/assets/img/ARTBACKGROUNDBLACK.png")}>

            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
            >

                <ScrollView
                    contentContainerStyle={styles.container}
                    showsVerticalScrollIndicator={false}
                >

                    <View style={styles.top}>
                        <Text style={styles.nameApp}>FRILA</Text>
                    </View>

                    <View style={styles.forms}>

                        <Text style={styles.inputText}>Nome</Text>
                        <Input
                            value={nome}
                            onChangeText={setNome}
                            autoCapitalize="words"
                        />

                        <Text style={styles.inputText}>E-mail</Text>
                        <Input
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />

                        <Text style={styles.inputText}>CPF</Text>
                        <Input
                            value={cpf}
                            onChangeText={(v) => setCpf(formatCpf(v))}
                            keyboardType="numeric"
                            maxLength={14}
                        />

                        <Text style={styles.inputText}>Telefone</Text>
                        <Input
                            value={telefone}
                            onChangeText={(v) => setTelefone(formatTelefone(v))}
                            keyboardType="phone-pad"
                            maxLength={15}
                        />

                        <Text style={styles.inputText}>Senha</Text>
                        <Input
                            value={senha}
                            onChangeText={setSenha}
                            secureTextEntry
                        />

                        <Text style={styles.inputText}>Confirmação de Senha</Text>
                        <Input
                            value={confirmacaoSenha}
                            onChangeText={setConfirmacaoSenha}
                            secureTextEntry
                        />

                        <Pressable
                            style={[styles.button, loading && styles.buttonDisabled]}
                            onPress={handleCadastro}
                            disabled={loading}
                        >
                            {loading
                                ? <ActivityIndicator color={colors.creme} />
                                : <Text style={styles.buttonText}>CADASTRAR</Text>
                            }
                        </Pressable>

                        <Text style={styles.cadastrar}>
                            Ja possui uma conta?{" "}
                            <Text style={styles.link} onPress={() => router.push("/login")}>
                                Faça login
                            </Text>
                        </Text>

                    </View>

                </ScrollView>

            </KeyboardAvoidingView>

        </Background>
    );
}

const styles = StyleSheet.create({

    container: {
        flexGrow: 1,
        paddingTop: 50,
    },

    top: {
        alignItems: "center",
        marginBottom: 30,
    },

    forms: {
        flex: 1,
        justifyContent: "center",
        backgroundColor: colors.preto,
        borderTopLeftRadius: 100,
        paddingHorizontal: 20,
        paddingVertical: 50,
        gap: 20,
    },

    nameApp: {
        fontSize: 100,
        fontFamily: "GotuRegular",
    },

    inputText: {
        color: colors.creme,
        fontSize: 20,
        fontFamily: "KohoRegular",
    },

    link: {
        color: colors.marrom,
        fontFamily: "KohoRegular",
    },

    button: {
        backgroundColor: colors.marromClaro,
        paddingVertical: 15,
        borderRadius: 20,
        alignItems: "center",
        marginTop: 20,
    },

    buttonDisabled: {
        opacity: 0.6,
    },

    buttonText: {
        color: colors.creme,
        fontSize: 20,
        fontFamily: "KohoMedium",
    },

    cadastrar: {
        color: colors.creme,
        fontSize: 20,
        textAlign: "center",
        fontFamily: "KohoRegular",
    }

});
