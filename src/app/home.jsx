import { Footer } from "@/components/footer";
import Screen from "@/components/screen";
import { SearchInput } from "@/components/SearchInput";
import { ServiceView } from "@/components/serviceView";
import { SERVICOS_DATA } from "@/constants/servicosData";
import colors from "@/constants/Colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Ionicons from "@expo/vector-icons/build/Ionicons";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    View
} from "react-native";

const FAVORITES_KEY = 'favoriteServices';

export default function Index() {
    const [likedServices, setLikedServices] = useState([]);

    useFocusEffect(useCallback(() => {
        AsyncStorage.getItem(FAVORITES_KEY).then(stored => {
            if (stored) setLikedServices(JSON.parse(stored));
        });
    }, []));

    const handleLikePress = async (serviceId) => {
        setLikedServices(prev => {
            const next = prev.includes(serviceId)
                ? prev.filter(id => id !== serviceId)
                : [...prev, serviceId];
            AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(next));
            return next;
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
                            {SERVICOS_DATA.map((servico) => (
                                <ServiceView
                                    key={servico.id}
                                    id={servico.id}
                                    imageFreelancer={servico.imageFreelancer}
                                    nome={servico.nome}
                                    profissao={servico.profissao}
                                    descricao={servico.descricao}
                                    avaliacao={servico.avaliacao}
                                    contactId={servico.contactId}
                                    contactPhotoId={servico.photoId}
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
        paddingBottom: 120,
    },
    nameApp: {
        fontSize: 100,
        fontFamily: "GotuRegular",
    },
    inputContainer: {
        alignItems: "center",
        width: "100%",
        backgroundColor: "transparent",
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
        marginTop: 10,
        gap: 20,
    },
});
