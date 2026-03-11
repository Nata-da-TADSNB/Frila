import Colors from '@/constants/Colors';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    FlatList,
    Image,
    Modal,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

type ChatType = 'usuario' | 'freelancer';

interface ChatContact {
    id: string;
    name: string;
    photo: string;
    unreadCount: number;
}

export default function ChatScreen() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<ChatType>('usuario');
    const [searchText, setSearchText] = useState('');
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [selectedChat, setSelectedChat] = useState<ChatContact | null>(null);

    const userChats: ChatContact[] = [
        { id: '1', name: 'Andrey Silva', photo: '', unreadCount: 3 },
        { id: '2', name: 'Maria Santos', photo: '', unreadCount: 1 },
        { id: '3', name: 'João Pedro', photo: '', unreadCount: 0 },
        { id: '4', name: 'Suporte', photo: '', unreadCount: 2 },
    ];

    const freelancerChats: ChatContact[] = [
        { id: '5', name: 'Carlos Eduardo', photo: '', unreadCount: 5 },
        { id: '6', name: 'Ana Beatriz', photo: '', unreadCount: 2 },
        { id: '7', name: 'Lucas Mendes', photo: '', unreadCount: 0 },
        { id: '8', name: 'Suporte', photo: '', unreadCount: 1 },
        { id: '9', name: 'Patrícia Lima', photo: '', unreadCount: 4 },
    ];

    const getCurrentChats = () => {
        const chats = activeTab === 'usuario' ? userChats : freelancerChats;

        if (searchText.trim() === '') {
            return chats;
        }

        return chats.filter(chat =>
            chat.name.toLowerCase().includes(searchText.toLowerCase())
        );
    };

    const currentChats = getCurrentChats();
    const totalMessages = currentChats.reduce(
        (sum, chat) => sum + chat.unreadCount,
        0
    );

    const handleDeletePress = (chat: ChatContact) => {
        setSelectedChat(chat);
        setDeleteModalVisible(true);
    };

    const handleConfirmDelete = () => {
        if (selectedChat) {
            console.log('Apagar chat:', selectedChat.id);
            setDeleteModalVisible(false);
            setSelectedChat(null);
        }
    };

    const handleCancelDelete = () => {
        setDeleteModalVisible(false);
        setSelectedChat(null);
    };

    const handleOpenChat = (chat: ChatContact) => {
        router.push({
            pathname: './chat/mensagens',
            params: {
                contactId: chat.id,
                contactName: chat.name,
                contactPhoto: chat.photo
            }
        });
    };

    const renderChatItem = ({ item }: { item: ChatContact }) => (
        <TouchableOpacity
            style={styles.chatItem}
            onPress={() => handleOpenChat(item)}
        >
            <View style={styles.chatItemLeft}>
                <View style={styles.avatarContainer}>
                    <Image
                        source={{ uri: item.photo }}
                        style={styles.avatar}
                    />
                    {item.unreadCount > 0 && (
                        <View style={styles.unreadBadge}>
                            <Text style={styles.unreadBadgeText}>
                                {item.unreadCount}
                            </Text>
                        </View>
                    )}
                </View>

                <Text style={styles.chatName}>{item.name}</Text>
            </View>

            <TouchableOpacity
                onPress={() => handleDeletePress(item)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
                <Feather name="trash-2" size={20} color={Colors.marrom} />
            </TouchableOpacity>
        </TouchableOpacity>
    );

    const renderEmptyComponent = () => (
        <View style={styles.emptyContainer}>
            <Feather name="user-x" size={60} color={Colors.bege} />
            <Text style={styles.emptyText}>
                {searchText.trim() !== ''
                    ? `Pessoa não encontrada`
                    : 'Nenhuma conversa disponível'}
            </Text>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.titleContainer}>
                <Text style={styles.titleText}>Chat</Text>
            </View>

            <View style={styles.header}>
                <View style={styles.tabContainer}>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'usuario' && styles.activeTab]}
                        onPress={() => setActiveTab('usuario')}
                    >
                        <Text style={[styles.tabText, activeTab === 'usuario' && styles.activeTabText]}>
                            Usuário
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'freelancer' && styles.activeTab]}
                        onPress={() => setActiveTab('freelancer')}
                    >
                        <Text style={[styles.tabText, activeTab === 'freelancer' && styles.activeTabText]}>
                            Freelancer
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.searchContainer}>
                <View style={styles.searchBox}>
                    <Feather name="search" size={20} color={Colors.cinza} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Procurar"
                        placeholderTextColor={Colors.cinza}
                        value={searchText}
                        onChangeText={setSearchText}
                    />
                </View>

                <View style={styles.messageCountContainer}>
                    <Feather name="message-circle" size={20} color={Colors.marrom} />
                    <Text style={styles.messageCountText}>
                        {totalMessages} Mensagens
                    </Text>
                </View>
            </View>

            <FlatList
                data={currentChats}
                keyExtractor={(item) => item.id}
                renderItem={renderChatItem}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.chatList}
                ListEmptyComponent={renderEmptyComponent}
            />

            <Modal
                animationType="fade"
                transparent={true}
                visible={deleteModalVisible}
                onRequestClose={handleCancelDelete}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <View style={styles.modalIconContainer}>
                            <Feather name="trash-2" size={40} color={Colors.marrom} />
                        </View>

                        <Text style={styles.modalTitle}>Apagar conversa</Text>

                        <Text style={styles.modalMessage}>
                            Tem certeza que deseja apagar a conversa com {selectedChat?.name}?
                        </Text>

                        <Text style={styles.modalWarning}>
                            Esta ação não poderá ser desfeita.
                        </Text>

                        <View style={styles.modalButtonsContainer}>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.cancelButton]}
                                onPress={handleCancelDelete}
                            >
                                <Text style={styles.cancelButtonText}>Cancelar</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.modalButton, styles.deleteButton]}
                                onPress={handleConfirmDelete}
                            >
                                <Text style={styles.deleteButtonText}>Apagar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.creme,
    },
    titleContainer: {
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 10,
    },
    titleText: {
        fontSize: 28,
        fontWeight: 'bold',
        color: Colors.preto,
        textAlign: 'center',
        paddingBottom: 15,
    },
    header: {
        paddingHorizontal: 20,
        paddingBottom: 15,
    },
    tabContainer: {
        flexDirection: 'row',
        backgroundColor: Colors.bege,
        borderRadius: 25,
        padding: 4,
    },
    tab: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
        borderRadius: 21,
    },
    activeTab: {
        backgroundColor: Colors.marrom,
    },
    tabText: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.marrom,
    },
    activeTabText: {
        color: Colors.creme,
    },
    searchContainer: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        paddingVertical: 15,
        gap: 10,
        borderBottomWidth: 1,
        borderBottomColor: Colors.bege,
    },
    searchBox: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.bege,
        borderRadius: 25,
        paddingHorizontal: 15,
        paddingVertical: 10,
        gap: 10,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: Colors.preto,
    },
    messageCountContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.bege,
        borderRadius: 25,
        paddingHorizontal: 15,
        paddingVertical: 10,
        gap: 8,
    },
    messageCountText: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.marrom,
    },
    chatList: {
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 20,
        flexGrow: 1,
    },
    chatItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: Colors.bege,
    },
    chatItemLeft: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatarContainer: {
        position: 'relative',
        marginRight: 15,
    },
    avatar: {
        width: 55,
        height: 55,
        borderRadius: 27.5,
        backgroundColor: Colors.bege,
    },
    unreadBadge: {
        position: 'absolute',
        top: -2,
        right: -2,
        backgroundColor: Colors.marrom,
        minWidth: 20,
        height: 20,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: Colors.creme,
    },
    unreadBadgeText: {
        color: Colors.creme,
        fontSize: 10,
        fontWeight: 'bold',
    },
    chatName: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.marrom,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 60,
    },
    emptyText: {
        marginTop: 15,
        fontSize: 16,
        color: Colors.cinza,
        textAlign: 'center',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        width: '85%',
        backgroundColor: Colors.creme,
        borderRadius: 20,
        padding: 24,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalIconContainer: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: Colors.bege,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.marrom,
        marginBottom: 8,
    },
    modalMessage: {
        fontSize: 16,
        color: Colors.preto,
        textAlign: 'center',
        marginBottom: 8,
    },
    modalWarning: {
        fontSize: 14,
        color: Colors.cinza,
        textAlign: 'center',
        marginBottom: 24,
        fontStyle: 'italic',
    },
    modalButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        gap: 12,
    },
    modalButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 25,
        alignItems: 'center',
    },
    cancelButton: {
        backgroundColor: Colors.bege,
    },
    cancelButtonText: {
        color: Colors.marrom,
        fontSize: 16,
        fontWeight: '600',
    },
    deleteButton: {
        backgroundColor: Colors.marrom,
    },
    deleteButtonText: {
        color: Colors.creme,
        fontSize: 16,
        fontWeight: '600',
    },
});