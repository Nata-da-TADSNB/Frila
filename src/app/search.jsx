import { Footer } from "@/components/footer";
import Screen from "@/components/screen";
import { ServiceView } from "@/components/serviceView";
import { SwipeableFreelancerCard } from "@/components/Swipeablefreelancercard";
import { SERVICOS_DATA } from "@/constants/servicosData";
import colors from "@/constants/Colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Ionicons from "@expo/vector-icons/build/Ionicons";
import { BlurView } from "expo-blur";
import { useFocusEffect } from "expo-router";
import { useCallback, useRef, useState } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

const FAVORITES_KEY = 'favoriteServices';

const DESTAQUES = [
    {
        id: "d1",
        imageFreelancer: require("@/assets/img/HOMEM6.jpg"),
        nome: "Michel Oliveira",
        profissao: "UI/UX Designer",
        descricao: "Prototipagem e design de interfaces. Figma completo com guia de estilo.",
        avaliacao: 4.5,
        preco: 85,
    },
    {
        id: "d2",
        imageFreelancer: require("@/assets/img/MULHER3.jpg"),
        nome: "Ana Carolina",
        profissao: "Dev Mobile",
        descricao: "Aplicativos Flutter publicados nas stores com suporte contínuo.",
        avaliacao: 4.8,
        preco: 110,
    },
    {
        id: "d3",
        imageFreelancer: require("@/assets/img/MULHER2.jpg"),
        nome: "Ana Beatriz",
        profissao: "Social Media",
        descricao: "Gestão de redes sociais com estratégia de conteúdo e relatórios.",
        avaliacao: 4.7,
        preco: 75,
    },
];

export default function Search() {
    const scrollRef = useRef(null);
    const [searchText, setSearchText] = useState('');
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

    const servicosFiltrados = searchText.trim()
        ? SERVICOS_DATA.filter(s =>
            s.nome.toLowerCase().includes(searchText.toLowerCase()) ||
            s.profissao.toLowerCase().includes(searchText.toLowerCase())
        )
        : SERVICOS_DATA;

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
                        keyboardShouldPersistTaps="handled"
                    >
                        {/* Barra de busca sticky */}
                        <View style={styles.inputContainer}>
                            <BlurView intensity={60} tint="light" style={styles.searchBar}>
                                <TextInput
                                    placeholder="Buscar por nome ou profissão..."
                                    placeholderTextColor={colors.cinza}
                                    style={styles.searchInput}
                                    value={searchText}
                                    onChangeText={setSearchText}
                                    autoFocus={false}
                                    returnKeyType="search"
                                />
                                {searchText.length > 0 ? (
                                    <Ionicons
                                        name="close-circle"
                                        size={20}
                                        color={colors.cinza}
                                        onPress={() => setSearchText('')}
                                    />
                                ) : (
                                    <Ionicons name="search" size={20} color={colors.preto} />
                                )}
                            </BlurView>
                        </View>

                        {/* Destaques — só exibe se não está filtrando */}
                        {!searchText.trim() && (
                            <>
                                <View style={styles.containerFilters}>
                                    <Text style={styles.textFilter}>Destaques</Text>
                                </View>
                                <SwipeableFreelancerCard
                                    scrollRef={scrollRef}
                                    freelancers={DESTAQUES}
                                />
                            </>
                        )}

                        <View style={styles.containerFilters}>
                            <Text style={styles.textFilter}>
                                {searchText.trim()
                                    ? `${servicosFiltrados.length} resultado(s) para "${searchText}"`
                                    : 'Todos os serviços'}
                            </Text>
                            <Ionicons name="filter" size={20} color={colors.cinza} />
                        </View>

                        {servicosFiltrados.length > 0 ? (
                            <View style={styles.containerServicos}>
                                {servicosFiltrados.map((servico) => (
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
                                <Ionicons name="search-outline" size={50} color={colors.cinza} />
                                <Text style={styles.emptyText}>
                                    Nenhum serviço encontrado para "{searchText}"
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
    inputContainer: {
        alignItems: "center",
        width: "100%",
        backgroundColor: "transparent",
        paddingVertical: 10,
    },
    searchBar: {
        flexDirection: "row",
        alignItems: "center",
        borderRadius: 30,
        width: "90%",
        paddingHorizontal: 16,
        paddingVertical: 12,
        overflow: "hidden",
        boxShadow: "0px 0px 4px rgba(0, 0, 0, 0.25)",
    },
    searchInput: {
        fontSize: 16,
        flex: 1,
    },
    containerFilters: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 16,
        marginBottom: 4,
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
        alignItems: "center",
        paddingVertical: 60,
        gap: 16,
    },
    emptyText: {
        fontFamily: "KohoRegular",
        fontSize: 16,
        color: colors.cinza,
        textAlign: "center",
    },
});
