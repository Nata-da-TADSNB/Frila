import { Text, View, StyleSheet, Pressable, Image } from "react-native";
import colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";


type Props = {
    nome: string
    profissao: string
    descricao: string
    imageFreelancer: any
    avaliacao: number
}

export function ServiceView({ nome, profissao, descricao, imageFreelancer, avaliacao }: Props) {
    return (
        <View style={styles.container}>

            <View style={styles.containerImagem}>

                <Image
                    source={imageFreelancer}
                    style={styles.image}
                />

                <View style={styles.avaliacao}>
                    <Ionicons name="star-outline" size={16} color="white" />
                    <Text style={styles.textAvaliacao}>{avaliacao}</Text>
                </View>

                <View style={styles.favorito}>
                    <Ionicons name="heart-outline" size={18} color="white" />
                </View>

            </View>

            <View style={styles.containerTexto}>
                <Text style={styles.nome}>{nome}</Text>
                <Text style={styles.profissao}>{profissao}</Text>
                <Text style={styles.descricao} numberOfLines={5} ellipsizeMode="tail">{descricao}</Text>

                <Pressable onPress={() => router.push("/detalhe")} style={styles.botao}>
                    <Text style={styles.botaoText}>Ver Mais</Text>
                </Pressable>
            </View>

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        width: "100%",
        height: 160,
    },

    containerImagem: {
        width: "40%",
        marginRight: 10,
        position: "relative"

    },

    containerTexto: {
        width: "60%",
    },

    image: {
        width: "100%",
        height: "100%",
        borderRadius: 50,
        resizeMode: "cover"
    },

    avaliacao: {
        position: "absolute",
        top: 0,
        left: 0,
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.5)",
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 20,
    },

    textAvaliacao: {
        color: colors.creme,
        fontSize: 15,
        marginLeft: 3
    },

    favorito: {
        position: "absolute",
        top: 0,
        right: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        padding: 6,
        borderRadius: 20,
    },

    nome: {
        color: colors.preto,
        fontSize: 25,
        textTransform: "uppercase",
        fontFamily: "KohoMedium",
    },

    profissao: {
        fontFamily: "KohoMedium",
        color: colors.cinza,
        fontSize: 16,
        textTransform: "uppercase",
    },

    descricao: {
        flex: 1,
        fontFamily: "KohoMedium",
        fontSize: 14,
        color: colors.preto,
    },

    botao: {
        width: "50%",
        backgroundColor: colors.marrom,
        paddingVertical: 5,
        borderRadius: 20,
        alignItems: "center",
        alignSelf: "flex-end",
        marginRight: 10
    },

    botaoText: {
        color: colors.creme,
        fontSize: 18,
        fontFamily: "KohoMedium",
    },
});