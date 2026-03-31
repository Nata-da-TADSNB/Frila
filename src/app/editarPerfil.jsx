import Colors from "@/constants/Colors";
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from "react";
import { Image, Modal, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function Index() {
    const router = useRouter();

    const [nome, setNome] = useState("Andrey Alves");
    const [telefone, setTelefone] = useState("(11) 98765-4321");
    const [editandoNome, setEditandoNome] = useState(false);
    const [editandoTelefone, setEditandoTelefone] = useState(false);

    const [modalVisible, setModalVisible] = useState(false);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleSavePassword = () => {
        if (!password || !confirmPassword) {
            alert("Preencha todos os campos!");
            return;
        }

        if (password !== confirmPassword) {
            alert("As senhas não coincidem!");
            return;
        }

        if (password.length < 6) {
            alert("A senha deve ter pelo menos 6 caracteres!");
            return;
        }

        console.log("Nova senha:", password);
        alert("Senha alterada com sucesso!");

        setPassword("");
        setConfirmPassword("");
        setModalVisible(false);
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <TouchableOpacity
                    style={styles.exitButton}
                    onPress={() => router.push('/perfil')}
                    activeOpacity={0.7}
                >
                    <Feather name="arrow-left" size={20} color={Colors.marrom} />
                </TouchableOpacity>

                <View style={styles.imageContainer}>
                    <Image
                        source={require('@/assets/img/BANNERPERFIL.png')}
                        style={styles.bannerImage}
                    />
                </View>

                <View style={styles.profileImageContainer}>
                    <View style={styles.profileImageWrapper}>
                        <Image
                            source={require('@/assets/img/FOTOFREELANCER1.png')}
                            style={styles.profileImage}
                        />

                        <TouchableOpacity
                            style={styles.profileOverlay}
                            onPress={() => console.log('Trocar foto de perfil')}
                            activeOpacity={0.7}
                        >
                            <View style={styles.iconContainer}>
                                <Feather name="edit-2" size={40} color={Colors.bege} />
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.titleContainer}>
                    <Text style={styles.titleText}>EDITE SUAS INFORMAÇÕES</Text>
                </View>

                <View style={styles.formContainer}>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Name</Text>
                        <View style={styles.inputWrapper}>
                            <TextInput
                                style={styles.input}
                                value={nome}
                                onChangeText={setNome}
                                placeholder="Seu nome"
                                placeholderTextColor={Colors.cinza}
                            />
                            <TouchableOpacity
                                style={styles.editButton}
                                onPress={() => setEditandoNome(!editandoNome)}
                            >
                                <Feather name="edit-2" size={18} color={Colors.marrom} />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>E-mail</Text>
                        <View style={styles.inputWrapper}>
                            <TextInput
                                style={[styles.input, styles.disabledInput]}
                                value="AndreyAlves@gmail.com"
                                placeholder="Seu e-mail"
                                placeholderTextColor={Colors.cinza}
                                editable={false}
                            />
                            <View style={styles.lockIcon}>
                                <Feather name="lock" size={16} color={Colors.cinza} />
                            </View>
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>CPF</Text>
                        <View style={styles.inputWrapper}>
                            <TextInput
                                style={[styles.input, styles.disabledInput]}
                                value="987.654.321-00"
                                placeholder="Seu CPF"
                                placeholderTextColor={Colors.cinza}
                                editable={false}
                            />
                            <View style={styles.lockIcon}>
                                <Feather name="lock" size={16} color={Colors.cinza} />
                            </View>
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Telephone</Text>
                        <View style={styles.inputWrapper}>
                            <TextInput
                                style={styles.input}
                                value={telefone}
                                onChangeText={setTelefone}
                                placeholder="Seu telefone"
                                placeholderTextColor={Colors.cinza}
                                keyboardType="phone-pad"
                            />
                            <TouchableOpacity
                                style={styles.editButton}
                                onPress={() => setEditandoTelefone(!editandoTelefone)}
                            >
                                <Feather name="edit-2" size={18} color={Colors.marrom} />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <TouchableOpacity
                        style={styles.passwordLink}
                        onPress={() => setModalVisible(true)}
                    >
                        <Text style={styles.passwordText}>Alterar Senha</Text>
                        <Feather name="chevron-right" size={20} color={Colors.marrom} />
                    </TouchableOpacity>

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={styles.saveButton}
                            onPress={() => {
                                console.log("Dados salvos:", { nome, telefone });
                                alert("Dados salvos com sucesso!");
                            }}
                        >
                            <Text style={styles.saveButtonText}>SALVAR</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.cancelButton}
                            onPress={() => {
                                setNome("Andrey Alves");
                                setTelefone("(11) 98765-4321");
                                router.push('/perfil');
                            }}
                        >
                            <Text style={styles.cancelButtonText}>CANCELAR</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>

            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>MUDAR SENHA</Text>

                        <View style={styles.modalInputGroup}>
                            <Text style={styles.modalLabel}>Digite sua nova senha</Text>
                            <TextInput
                                style={styles.modalInput}
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry
                            />
                        </View>

                        <View style={styles.modalInputGroup}>
                            <Text style={styles.modalLabel}>Confirme sua nova senha</Text>
                            <TextInput
                                style={styles.modalInput}
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                                secureTextEntry
                            />
                        </View>

                        <View style={styles.modalButtonContainer}>
                            <TouchableOpacity
                                style={styles.modalCancelButton}
                                onPress={() => {
                                    setPassword("");
                                    setConfirmPassword("");
                                    setModalVisible(false);
                                }}
                            >
                                <Text style={styles.modalCancelButtonText}>Cancelar</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.modalConfirmButton}
                                onPress={handleSavePassword}
                            >
                                <Text style={styles.modalConfirmButtonText}>Confirmar</Text>
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
    exitButton: {
        position: 'absolute',
        top: 10,
        left: 10,
        zIndex: 10,
        backgroundColor: Colors.bege,
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: Colors.preto,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.2,
        shadowRadius: 2.5,
        elevation: 4,
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
    profileImageWrapper: {
        width: '100%',
        height: '100%',
        position: 'relative',
    },
    profileImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    profileOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconContainer: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: Colors.bege,
    },
    titleContainer: {
        marginTop: 50,
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    titleText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.marrom,
        textAlign: 'center',
        fontFamily: "KohoRegular",
    },
    formContainer: {
        paddingHorizontal: 20,
        paddingBottom: 30,
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 17,
        color: Colors.marrom,
        marginBottom: 5,
        fontWeight: '500',
        fontFamily: "KohoRegular",
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.bege,
        borderRadius: 10,
        paddingHorizontal: 15,
        height: 50,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: Colors.marrom,
        height: '100%',
    },
    disabledInput: {
        color: Colors.cinza,
    },
    editButton: {
        padding: 8,
    },
    lockIcon: {
        padding: 8,
    },
    passwordLink: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: Colors.bege,
        paddingHorizontal: 15,
        height: 50,
        marginBottom: 30,
    },
    passwordText: {
        fontSize: 16,
        color: Colors.marrom,
        fontWeight: '500',
    },
    buttonContainer: {
        gap: 12,
    },
    saveButton: {
        backgroundColor: Colors.marrom,
        borderRadius: 10,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: Colors.preto,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    saveButtonText: {
        color: Colors.bege,
        fontSize: 16,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    cancelButton: {
        backgroundColor: Colors.bege,
        borderRadius: 10,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.marrom,
    },
    cancelButtonText: {
        color: Colors.marrom,
        fontSize: 16,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '85%',
        backgroundColor: Colors.bege,
        borderRadius: 20,
        padding: 25,
        shadowColor: Colors.preto,
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: Colors.marrom,
        textAlign: 'center',
        marginBottom: 25,
        fontFamily: "KohoRegular",
    },
    modalInputGroup: {
        marginBottom: 20,
    },
    modalLabel: {
        fontSize: 16,
        color: Colors.marrom,
        marginBottom: 5,
        fontWeight: '500',
        fontFamily: "KohoRegular",
    },
    modalInput: {
        backgroundColor: Colors.creme,
        borderRadius: 10,
        paddingHorizontal: 15,
        height: 45,
        fontSize: 16,
        color: Colors.marrom,
        borderWidth: 1,
        borderColor: Colors.marrom,
    },
    modalButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
        gap: 10,
    },
    modalCancelButton: {
        flex: 1,
        backgroundColor: Colors.bege,
        borderRadius: 10,
        height: 45,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.marrom,
    },
    modalCancelButtonText: {
        color: Colors.marrom,
        fontSize: 16,
        fontWeight: 'bold',
    },
    modalConfirmButton: {
        flex: 1,
        backgroundColor: Colors.marrom,
        borderRadius: 10,
        height: 45,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalConfirmButtonText: {
        color: Colors.bege,
        fontSize: 16,
        fontWeight: 'bold',
    },
});