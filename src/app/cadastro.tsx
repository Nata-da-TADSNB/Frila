import Background from "@/components/backgroundImage";
import {
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View
} from "react-native";

import { Input } from "@/components/input";
import colors from "@/constants/Colors";
import { useRouter } from "expo-router";

export default function Index() {

    const router = useRouter();

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
                        <Input />

                        <Text style={styles.inputText}>E-mail</Text>
                        <Input />

                        <Text style={styles.inputText}>CPF</Text>
                        <Input />

                        <Text style={styles.inputText}>Telefone</Text>
                        <Input />

                        <Text style={styles.inputText}>Senha</Text>
                        <Input />

                        <Text style={styles.inputText}>Confirmação de Senha</Text>
                        <Input />

                        <Pressable style={styles.button}>
                            <Text style={styles.buttonText}>ENTRAR</Text>
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
    )
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

    redefinir: {
        fontSize: 20,
        fontFamily: "KohoRegular",
    },

    button: {
        backgroundColor: colors.marromClaro,
        paddingVertical: 15,
        borderRadius: 20,
        alignItems: "center",
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