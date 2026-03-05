import Background from "@/components/backgroundImage";
import { View, Text, StyleSheet, Pressable, } from "react-native";
import { Input } from "@/components/input";
import colors from "@/constants/Colors";

export default function Index() {
    return (
        <Background source={require("@/assets/img/ARTBACKGROUNDWHITE.png")}>
            <View style={styles.container}>

                <View style={styles.top}>
                    <Text style={styles.nameApp}>FRILA</Text>
                </View>

                <View style={styles.forms}>
                    <Text style={styles.inputText}>E-mail</Text>
                    <Input />
                    <Text style={styles.inputText}>Senha</Text>
                    <Input />

                    <Text style={styles.redefinir}>Esqueceu sua senha? <Text style={styles.link}>Redefina aqui</Text></Text>

                    <Pressable style={styles.button}>
                        <Text style={styles.buttonText}>ENTRAR</Text>
                    </Pressable>

                    <Text style={styles.cadastrar}>Não tem uma conta? <Text style={styles.link}>Cadastre-se</Text></Text>
                </View>

            </View>
        </Background>
    )
}const styles = StyleSheet.create({

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
        borderTopRightRadius: 150,
        padding: 20,
        gap: 20,
    },

    nameApp: {
        fontSize: 100,
        fontFamily: "GotuRegular",
    },

    inputText: {
        color: colors.preto,
        fontSize: 30,
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
        backgroundColor: colors.marrom,
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