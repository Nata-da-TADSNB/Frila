import { useRef, useState } from "react"; // ✅ ADICIONEI useState
import { SearchInput } from "@/components/SearchInput";
import { ServiceView } from "@/components/serviceView";
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    View
} from "react-native";

import { Footer } from "@/components/footer";
import Screen from "@/components/screen";
import { SwipeableFreelancerCard } from "@/components/Swipeablefreelancercard";
import colors from "@/constants/Colors";
import Ionicons from "@expo/vector-icons/build/Ionicons";
import { useRouter } from "expo-router";

export default function Search() {
    const router = useRouter();
    const scrollRef = useRef(null);

    // ✅ ISSO QUE FALTAVA
    const [likedServices, setLikedServices] = useState([]);

    const handleLikePress = (id) => {
        setLikedServices((prev) =>
            prev.includes(id)
                ? prev.filter((item) => item !== id)
                : [...prev, id]
        );
    };

    const servicosData = [
        {
            id: 1,
            imageFreelancer: require("@/assets/img/FOTOFREELANCER.png"),
            nome: "Geovana Oliveira",
            profissao: "Designer",
            descricao: "Ipsum fugiat elit dolore culpa duis...",
            avaliacao: 5,
        },
        {
            id: 2,
            imageFreelancer: require("@/assets/img/FOTOFREELANCER1.png"),
            nome: "Jorge Silva",
            profissao: "software developer",
            descricao: "Ipsum fugiat elit dolore culpa duis...",
            avaliacao: 4.2,
        },
        {
            id: 3,
            imageFreelancer: require("@/assets/img/FOTOFREELANCER.png"),
            nome: "Carlos Santos",
            profissao: "Web Developer",
            descricao: "Ipsum fugiat elit dolore culpa duis...",
            avaliacao: 4.7,
        },
        
    ];

    return (
        <View style={{ flex: 1 }}>
            <Screen style={styles.body}>
                <KeyboardAvoidingView
                    style={{ flex: 1 }}
                    behavior={Platform.OS === "ios" ? "padding" : "height"}>

                    <ScrollView
                        ref={scrollRef}
                        contentContainerStyle={styles.containerScroll}
                        showsVerticalScrollIndicator={false}
                        stickyHeaderIndices={[0]}
                        scrollEventThrottle={16}
                        directionalLockEnabled={true}
                    >
                        <View style={styles.inputContainer}>
                            <SearchInput placeholder="Buscar serviços..." />
                        </View>

                        <View style={styles.containerFilters}>
                            <Text style={styles.textFilter}>Conheça os serviços</Text>
                            <Ionicons name="filter" size={20} color={colors.cinza} />
                        </View>

                        <View style={styles.containerServicosA}>
                            <SwipeableFreelancerCard
                                scrollRef={scrollRef}
                                freelancers={[
                                    {
                                        id: "1",
                                        imageFreelancer: require("@/assets/img/HOMEM6.jpg"),
                                        nome: "Michel Oliveira",
                                        profissao: "UI/UX Designer",
                                        descricao: "Bla bla bla",
                                        avaliacao: 4.5,
                                        preco: 85,
                                    },
                                    {
                                        id: "2",
                                        imageFreelancer: require("@/assets/img/MULHER3.jpg"),
                                        nome: "Ana Carolina",
                                        profissao: "Mobile Developer",
                                        descricao: "Bla bla bla",
                                        avaliacao: 4.8,
                                        preco: 110,
                                    },
                                    {
                                        id: "3",
                                        imageFreelancer: require("@/assets/img/MULHER2.jpg"),
                                        nome: "Maria Silva",
                                        profissao: "Pedreira",
                                        descricao: "Bla bla bla",
                                        avaliacao: 4.8,
                                        preco: 110,
                                    },
                                ]}
                            />
                            <View style={styles.containerServicosB}>
                                {servicosData.map((servico) => (
                                    <ServiceView
                                        key={servico.id}
                                        id={servico.id}
                                        imageFreelancer={servico.imageFreelancer}
                                        nome={servico.nome}
                                        profissao={servico.profissao}
                                        descricao={servico.descricao}
                                        avaliacao={servico.avaliacao}
                                        isLiked={likedServices.includes(servico.id)} // ✅ agora existe
                                        onLikePress={handleLikePress} // ✅ agora existe
                                    />
                                ))}
                            </View>
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
    containerServicosA: {
        width: "100%",
        height: "100%",
        marginTop: 10,
        gap: 20
    },
    containerServicosB: {
        width: "100%",
        height: "100%",
        marginTop: 10,
        gap: 20
    }
});