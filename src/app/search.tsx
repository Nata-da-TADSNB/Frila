import { SearchInput } from "@/components/SearchInput";
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

export default function Index() {

    const router = useRouter();

    return (
        <View style={{ flex: 1 }}>

            <Screen style={styles.body}>
                <KeyboardAvoidingView
                    style={{ flex: 1 }}
                    behavior={Platform.OS === "ios" ? "padding" : "height"}>

                    <ScrollView
                        contentContainerStyle={styles.containerScroll}
                        showsVerticalScrollIndicator={false}
                        stickyHeaderIndices={[0]}
                    >

                        <View style={styles.inputContainer}>
                            <SearchInput placeholder="Buscar serviços..." />
                        </View>

                        <View style={styles.containerFilters}>
                            <Text style={styles.textFilter}>Conheça os serviços</Text>
                            <Ionicons name="filter" size={20} color={colors.cinza} />
                        </View>

                        <View style={styles.containerServicos}>


                            <SwipeableFreelancerCard
                                freelancers={[
                                    {
                                        id: "1",
                                        imageFreelancer: require("@/assets/img/FOTOFREELANCER1.png"),
                                        nome: "Michel Oliveira",
                                        profissao: "UI/UX Designer",
                                        descricao: "Bla bla bla bla bla",
                                        avaliacao: 4.5,
                                        preco: 85,
                                    },
                                    {
                                        id: "2",
                                        imageFreelancer: require("@/assets/img/FOTOFREELANCER.png"),
                                        nome: "Ana Carolina",
                                        profissao: "Mobile Developer",
                                        descricao: "Bla bla bla bla bla",
                                        avaliacao: 4.8,
                                        preco: 110,
                                    },
                                    {
                                        id: "3",
                                        imageFreelancer: require("@/assets/img/FOTOFREELANCER2.jpg"),
                                        nome: "Maria Ribeiro",
                                        profissao: "Designer",
                                        descricao: "Bla bla bla bla bla",
                                        avaliacao: 4.8,
                                        preco: 110,
                                    },
                                ]}
                            />

                        </View>

                    </ScrollView>

                </KeyboardAvoidingView>
            </Screen>

            <Footer />

        </View>
    )
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

    containerServicos: {
        width: "100%",
        height: "100%",
        marginTop: 10,
        gap: 20
    }

});