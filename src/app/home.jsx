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

export default function Index() {
    const router = useRouter();
    const [likedServices, setLikedServices] = useState([]);

    const handleLikePress = (serviceId) => {
        setLikedServices(prev => {
            if (prev.includes(serviceId)) {
                return prev.filter(id => id !== serviceId);
            } else {
                return [...prev, serviceId];
            }
        });
    };

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

                        <View>
                            <Text style={styles.nameApp}>FRILA</Text>
                        </View>

                        <View style={styles.inputContainer}>
                            <SearchInput placeholder="Buscar serviços..." />
                        </View>

                        <View style={styles.containerFilters}>
                            <Text style={styles.textFilter}>Conheça os serviços</Text>
                            <Ionicons name="filter" size={20} color={colors.cinza} />
                        </View>

                        <View style={styles.containerServicos}>
                            {servicosData.map((servico) => (
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
    nameApp: {
        fontSize: 100,
        fontFamily: "GotuRegular",
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
    }
});