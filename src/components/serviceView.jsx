import colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

export function ServiceView({
    id,
    nome,
    profissao,
    descricao,
    imageFreelancer,
    avaliacao,
    isLiked = false,
    onLikePress,
    contactId,
    contactPhotoId,
}) {
    const handleLikePress = () => {
        if (onLikePress) onLikePress(id);
    };

    const handleChatPress = () => {
        if (!contactId) return;
        router.push({
            pathname: '/conversaC',
            params: {
                contactId,
                contactName: nome,
                contactPhotoId: contactPhotoId ?? '',
                userType: 'usuario',
            },
        });
    };

    return (
        <View style={styles.container}>

            <View style={styles.containerImagem}>
                <Image source={imageFreelancer} style={styles.image} />

                <View style={styles.avaliacao}>
                    <Ionicons name="star-outline" size={16} color="white" />
                    <Text style={styles.textAvaliacao}>{avaliacao}</Text>
                </View>

                <Pressable onPress={handleLikePress} style={styles.favorito}>
                    <Ionicons
                        name={isLiked ? "heart" : "heart-outline"}
                        size={18}
                        color={isLiked ? colors.rosa : "white"}
                    />
                </Pressable>
            </View>

            <View style={styles.containerTexto}>
                <Text style={styles.nome}>{nome}</Text>
                <Text style={styles.profissao}>{profissao}</Text>
                <Text style={styles.descricao} numberOfLines={4} ellipsizeMode="tail">
                    {descricao}
                </Text>

                <View style={styles.botoes}>
                    <Pressable onPress={handleChatPress} style={styles.botaoChat}>
                        <Ionicons name="chatbubble-outline" size={16} color={colors.marrom} />
                    </Pressable>
                    <Pressable onPress={() => router.push("/detalhe")} style={styles.botao}>
                        <Text style={styles.botaoText}>Ver Mais</Text>
                    </Pressable>
                </View>
            </View>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        width: "100%",
        height: 170,
    },
    containerImagem: {
        width: "40%",
        marginRight: 10,
        position: "relative",
    },
    containerTexto: {
        flex: 1,
        justifyContent: "space-between",
    },
    image: {
        width: "100%",
        height: "100%",
        borderRadius: 50,
        resizeMode: "cover",
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
        marginLeft: 3,
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
        fontSize: 22,
        textTransform: "uppercase",
        fontFamily: "KohoMedium",
    },
    profissao: {
        fontFamily: "KohoMedium",
        color: colors.cinza,
        fontSize: 14,
        textTransform: "uppercase",
    },
    descricao: {
        flex: 1,
        fontFamily: "KohoMedium",
        fontSize: 13,
        color: colors.preto,
        marginVertical: 4,
    },
    botoes: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-end",
        gap: 8,
        marginRight: 10,
    },
    botaoChat: {
        borderWidth: 1,
        borderColor: colors.marrom,
        padding: 6,
        borderRadius: 20,
        alignItems: "center",
        justifyContent: "center",
    },
    botao: {
        backgroundColor: colors.marrom,
        paddingVertical: 5,
        paddingHorizontal: 16,
        borderRadius: 20,
        alignItems: "center",
    },
    botaoText: {
        color: colors.creme,
        fontSize: 16,
        fontFamily: "KohoMedium",
    },
});
