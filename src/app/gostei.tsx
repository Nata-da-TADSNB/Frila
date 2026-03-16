import { Footer } from "@/components/footer";
import Screen from "@/components/screen";
import { SearchInput } from "@/components/SearchInput";
import { ServiceView } from "@/components/serviceView";
import colors from "@/constants/Colors";
import Ionicons from "@expo/vector-icons/build/Ionicons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    View
} from "react-native";

const servicosData = [
    {
        id: 1,
        imageFreelancer: require("@/assets/img/FOTOFREELANCER.png"),
        nome: "Geovana Oliveira",
        profissao: "Designer",
        descricao: "Ipsum fugiat elit dolore culpa duis. Reprehenderit ullamco dolor esse minim fugiat consectetur amet id nisi aliquip laborum esse enim. Culpa officia magna ad adipisicing. Amet Lorem ipsum amet fugia.",
        avaliacao: 5,
    },
    {
        id: 2,
        imageFreelancer: require("@/assets/img/FOTOFREELANCER1.png"),
        nome: "Jorge Silva",
        profissao: "software developer",
        descricao: "Ipsum fugiat elit dolore culpa duis. Reprehenderit ullamco dolor esse minim fugiat consectetur amet id nisi aliquip laborum esse enim. Culpa officia magna ad adipisicing. Amet Lorem ipsum amet fugia.",
        avaliacao: 4.2,
    },
    {
        id: 3,
        imageFreelancer: require("@/assets/img/FOTOFREELANCER.png"),
        nome: "Geovana Oliveira",
        profissao: "Designer",
        descricao: "Ipsum fugiat elit dolore culpa duis. Reprehenderit ullamco dolor esse minim fugiat consectetur amet id nisi aliquip laborum esse enim. Culpa officia magna ad adipisicing. Amet Lorem ipsum amet fugia.",
        avaliacao: 5,
    },
    {
        id: 4,
        imageFreelancer: require("@/assets/img/FOTOFREELANCER1.png"),
        nome: "Jorge Silva",
        profissao: "software developer",
        descricao: "Ipsum fugiat elit dolore culpa duis. Reprehenderit ullamco dolor esse minim fugiat consectetur amet id nisi aliquip laborum esse enim. Culpa officia magna ad adipisicing. Amet Lorem ipsum amet fugia.",
        avaliacao: 4.2,
    },
    {
        id: 5,
        imageFreelancer: require("@/assets/img/FOTOFREELANCER.png"),
        nome: "Geovana Oliveira",
        profissao: "Designer",
        descricao: "Ipsum fugiat elit dolore culpa duis. Reprehenderit ullamco dolor esse minim fugiat consectetur amet id nisi aliquip laborum esse enim. Culpa officia magna ad adipisicing. Amet Lorem ipsum amet fugia.",
        avaliacao: 5,
    },
    {
        id: 6,
        imageFreelancer: require("@/assets/img/FOTOFREELANCER1.png"),
        nome: "Jorge Silva",
        profissao: "software developer",
        descricao: "Ipsum fugiat elit dolore culpa duis. Reprehenderit ullamco dolor esse minim fugiat consectetur amet id nisi aliquip laborum esse enim. Culpa officia magna ad adipisicing. Amet Lorem ipsum amet fugia.",
        avaliacao: 4.2,
    },
];

export default function Favoritos() {
    const router = useRouter();
    const [likedServices, setLikedServices] = useState<number[]>([1, 3, 5]);

    const handleLikePress = (serviceId: number) => {
        setLikedServices(prev => {
            if (prev.includes(serviceId)) {
                return prev.filter(id => id !== serviceId);
            } else {
                return [...prev, serviceId];
            }
        });
    };

    const favoriteServices = servicosData.filter(servico =>
        likedServices.includes(servico.id)
    );

    return (
        <View style={{ flex: 1 }}>
            <Screen style={styles.body}>
                <KeyboardAvoidingView
                    style={{ flex: 1 }}
                    behavior={Platform.OS === "ios" ? "padding" : "height"}>

                    <ScrollView
                        contentContainerStyle={styles.containerScroll}
                        showsVerticalScrollIndicator={false}
                        stickyHeaderIndices={[1]}
                    >

                        <View style={styles.headerContainer}>
                            <Text style={styles.title}>Gostei</Text>
                        </View>

                        <View style={styles.inputContainer}>
                            <SearchInput placeholder="Buscar serviços..." />
                        </View>

                        <View style={styles.containerFilters}>
                            <Text style={styles.textFilter}>Meus favoritos</Text>
                            <Ionicons name="filter" size={20} color={colors.cinza} />
                        </View>

                        {favoriteServices.length > 0 ? (
                            <View style={styles.containerServicos}>
                                {favoriteServices.map((servico) => (
                                    <ServiceView
                                        key={servico.id}
                                        id={servico.id}
                                        imageFreelancer={servico.imageFreelancer}
                                        nome={servico.nome}
                                        profissao={servico.profissao}
                                        descricao={servico.descricao}
                                        avaliacao={servico.avaliacao}
                                        isLiked={likedServices.includes(servico.id)}
                                        onLikePress={handleLikePress}
                                    />
                                ))}
                            </View>
                        ) : (
                            <View style={styles.emptyContainer}>
                                <Ionicons name="heart-outline" size={60} color={colors.cinza} />
                                <Text style={styles.emptyText}>Nenhum serviço curtido ainda</Text>
                                <Text style={styles.emptySubText}>
                                    Toque no coração dos serviços que você gostar para vê-los aqui
                                </Text>
                            </View>
                        )}

                    </ScrollView>

                </KeyboardAvoidingView>
            </Screen>

            <Footer />
        </View>
    );
}

const styles = StyleSheet.create({
    body: {
        backgroundColor: colors.creme,
    },
    containerScroll: {
        flexGrow: 1,
        paddingBottom: 120
    },
    headerContainer: {
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 10,
    },
    title: {
        fontSize: 48,
        fontFamily: "GotuRegular",
        color: colors.preto,
    },
    inputContainer: {
        alignItems: "center",
        width: "100%",
        backgroundColor: "transparent"
    },
    containerFilters: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 20,
        marginBottom: 10,
    },
    textFilter: {
        fontFamily: "KohoLight",
        fontSize: 18,
        color: colors.cinza,
    },
    containerServicos: {
        width: "100%",
        height: "100%",
        marginTop: 10,
        gap: 20
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 50,
        gap: 15,
    },
    emptyText: {
        fontFamily: "KohoMedium",
        fontSize: 18,
        color: colors.cinza,
        textAlign: 'center',
    },
    emptySubText: {
        fontFamily: "KohoLight",
        fontSize: 14,
        color: colors.cinza,
        textAlign: 'center',
        paddingHorizontal: 40,
    }
});