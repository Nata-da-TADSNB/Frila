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

export default function Favoritos() {
    const [likedServices, setLikedServices] = useState([]);

    useFocusEffect(useCallback(() => {
        AsyncStorage.getItem(FAVORITES_KEY).then(stored => {
            if (stored) setLikedServices(JSON.parse(stored));
            else setLikedServices([]);
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

    const favoriteServices = SERVICOS_DATA.filter(s => likedServices.includes(s.id));

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
                            <Text style={styles.textFilter}>
                                {favoriteServices.length > 0
                                    ? `${favoriteServices.length} favorito(s)`
                                    : 'Meus favoritos'}
                            </Text>
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
                                        contactId={servico.contactId}
                                        contactPhotoId={servico.photoId}
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
        paddingBottom: 120,
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
        backgroundColor: "transparent",
    },
    containerFilters: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
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
        marginTop: 10,
        gap: 20,
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
    },
});
