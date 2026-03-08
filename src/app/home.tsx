import { SearchInput } from "@/components/SearchInput";
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    View
} from "react-native";

import Screen from "@/components/screen";
import colors from "@/constants/Colors";
import { useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/build/Ionicons";
import { ServiceView } from "@/components/serviceView";

export default function Index() {

    const router = useRouter();

    return (
        <Screen style={styles.body}>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === "ios" ? "padding" : "height"}>

                <ScrollView
                    contentContainerStyle={styles.containerScroll}
                    showsVerticalScrollIndicator={false}>

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

                        <ServiceView
                            imageFreelancer={require("@/assets/img/FOTOFREELANCER.png")}
                            nome="Geovana Oliveira"
                            profissao="Designer"
                            descricao ="Ipsum fugiat elit dolore culpa duis. Reprehenderit ullamco dolor esse minim fugiat consectetur amet id nisi aliquip laborum esse enim. Culpa officia magna ad adipisicing. Amet Lorem ipsum amet fugia."
                        />


                    </View>


                </ScrollView>

            </KeyboardAvoidingView>
        </Screen>
    )
}

const styles = StyleSheet.create({

    body: {
        backgroundColor: colors.creme,
    },

    containerScroll: {
        flexGrow: 1,
    },

    nameApp: {
        fontSize: 100,
        fontFamily: "GotuRegular",
    },

    inputContainer: {
        alignItems: "center",
        width: "100%",
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
    }




});