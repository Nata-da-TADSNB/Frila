import Colors from "@/constants/Colors";
import { Feather } from '@expo/vector-icons';
import { Href, useRouter } from 'expo-router';
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type FeatherIconName = React.ComponentProps<typeof Feather>['name'];

export default function Index() {
    const router = useRouter();

    const menuItems: { icon: FeatherIconName; text: string; route: Href }[] = [
        { icon: 'home', text: 'Home', route: '/home' },
        { icon: 'shopping-bag', text: 'Pedidos', route: '/pedidos' },
        { icon: 'message-circle', text: 'Chat', route: '/chat' },
        { icon: 'plus', text: 'Freelancer', route: '/dashboard' },
        { icon: 'heart', text: 'Gostei', route: '/gostei' },
        { icon: 'help-circle', text: 'Duvídas', route: '/duvidas' },
        { icon: 'settings', text: 'Configuracoes', route: '/editarPerfil' },
        { icon: 'log-out', text: 'Sair', route: '/login' },
    ];

    const handleNavigation = (route: Href, text: string) => {
        if (text === 'Sair') {
            console.log('Fazer logout');
        }
        router.push(route);
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.imageContainer}>
                    <Image
                        source={require('@/assets/img/BANNERPERFIL.png')}
                        style={styles.bannerImage}
                    />
                </View>

                <View style={styles.profileImageContainer}>
                    <Image
                        source={require('@/assets/img/FOTOFREELANCER.png')}
                        style={styles.profileImage}
                    />
                </View>

                <View style={styles.infoContainer}>
                    <View style={styles.nameRatingRow}>
                        <Text style={styles.nameText}>Hello, Andrey Silva</Text>
                        <View style={styles.ratingContainer}>
                            <Feather name="star" size={24} color={Colors.creme} />
                            <Text style={styles.ratingText}>4.5</Text>
                        </View>
                    </View>

                    <Text style={styles.sinceText}>With us since 2021</Text>
                </View>

                <View style={styles.menuContainer}>
                    {menuItems.map((item, index) => {
                        const isLastItem = index === menuItems.length - 1;

                        return (
                            <TouchableOpacity
                                key={index}
                                style={[
                                    styles.menuItem,
                                    isLastItem && styles.menuItemLast
                                ]}
                                onPress={() => handleNavigation(item.route, item.text)}
                            >
                                <Feather
                                    name={item.icon}
                                    size={24}
                                    color={Colors.marrom}
                                    style={styles.menuIcon}
                                />
                                <Text style={styles.menuText}>{item.text}</Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.creme,
    },
    imageContainer: {
        width: '100%',
        height: 200,
    },
    bannerImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    profileImageContainer: {
        position: 'absolute',
        top: 70,
        alignSelf: 'center',
        width: 160,
        height: 160,
        borderRadius: 80,
        borderWidth: 4,
        borderColor: Colors.bege,
        shadowColor: Colors.preto,
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
        elevation: 8,
        overflow: 'hidden',
        backgroundColor: Colors.creme,
    },
    profileImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    infoContainer: {
        marginTop: 50,
        paddingHorizontal: 20,
        marginBottom: 30,
    },
    nameRatingRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    nameText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.marrom,
    },
    ratingContainer: {
        backgroundColor: Colors.marrom,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    ratingText: {
        fontSize: 18,
        fontWeight: '600',
        color: Colors.creme,
    },
    sinceText: {
        fontSize: 15,
        color: Colors.cinza,
        marginTop: -5,
    },
    menuContainer: {
        paddingHorizontal: 20,
        gap: 20,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: Colors.bege,
    },
    menuItemLast: {
        borderBottomWidth: 0,
    },
    menuIcon: {
        marginRight: 16,
        width: 24,
    },
    menuText: {
        fontSize: 18,
        color: Colors.preto,
        fontWeight: '500',
    },
});