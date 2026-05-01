import Background from "@/components/backgroundImage";
import { Input } from "@/components/input";
import colors from "@/constants/Colors";
import { initDatabase, getUserByEmailAndSenha } from "@/database/database";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";

export default function Index() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');

    useEffect(() => {
        initDatabase().catch(err => console.error('DB init error:', err));
    }, []);

    const handleLogin = async () => {
        if (!email.trim() || !senha.trim()) {
            Alert.alert('Atenção', 'Preencha e-mail e senha.');
            return;
        }
        try {
            const user = await getUserByEmailAndSenha(email.trim(), senha.trim());
            if (user) {
                await AsyncStorage.setItem('userId', String(user.id_usuario));
                router.push("/home");
            } else {
                Alert.alert('Erro', 'E-mail ou senha inválidos.');
            }
        } catch (error) {
            console.error('Login error:', error);
            Alert.alert('Erro', 'Não foi possível realizar o login.');
        }
    };

    return (
        <Background source={require("@/assets/img/ARTBACKGROUNDWHITE.png")}>
            <View style={styles.container}>

                <View style={styles.top}>
                    <Text style={styles.nameApp}>FRILA</Text>
                </View>

                <View style={styles.forms}>
                    <Text style={styles.inputText}>E-mail</Text>
                    <Input
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                    <Text style={styles.inputText}>Senha</Text>
                    <Input
                        value={senha}
                        onChangeText={setSenha}
                        secureTextEntry
                    />

                    <Text style={styles.redefinir}>Esqueceu sua senha? <Text style={styles.link}>Redefina aqui</Text></Text>

                    <Pressable style={styles.button} onPress={handleLogin}>
                        <Text style={styles.buttonText}>ENTRAR</Text>
                    </Pressable>

                    <Text style={styles.cadastrar}>Não tem uma conta? <Text style={styles.link} onPress={() => router.push("/cadastro")}>Cadastre-se</Text></Text>
                </View>

            </View>
        </Background>
    );
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        paddingTop: 50,
    },

    top: {
        flex: 1,
        alignItems: "center",
    },

    forms: {
        flex: 2,
        justifyContent: "center",
        backgroundColor: "#fff",
        borderTopRightRadius: 100,
        padding: 20,
        gap: 20,
    },

    nameApp: {
        fontSize: 100,
        fontFamily: "GotuRegular",
    },

    inputText: {
        color: colors.preto,
        fontSize: 20,
        fontFamily: "KohoRegular",
    },

    link: {
        color: colors.marrom,
        fontFamily: "KohoRegular",
    },

    redefinir: {
        fontSize: 20,
        fontFamily: "KohoRegular",
    },

    button: {
        backgroundColor: colors.marromClaro,
        paddingVertical: 15,
        borderRadius: 20,
        alignItems: "center",
        marginTop: 50,
    },

    buttonText: {
        color: colors.creme,
        fontSize: 20,
        fontFamily: "KohoMedium",
    },

    cadastrar: {
        fontSize: 20,
        textAlign: "center",
        fontFamily: "KohoRegular",
    }

});
