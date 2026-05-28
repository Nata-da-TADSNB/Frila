import Colors from "@/constants/Colors";
import { getUserById, updateUser, updateUserPassword } from "@/database/database";
import { Feather } from '@expo/vector-icons';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from "react";
import { Alert, Image, Modal, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

const formatCpfDisplay = (cpf) => {
    if (!cpf) return '';
    const d = cpf.replace(/\D/g, '');
    return d.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
};

const formatTelDisplay = (tel) => {
    if (!tel) return '';
    const d = tel.replace(/\D/g, '');
    if (d.length === 11) return d.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    if (d.length === 10) return d.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    return d;
};

const formatTelInput = (value) => {
    const digits = value.replace(/\D/g, '').slice(0, 11);
    if (digits.length <= 10) {
        return digits
            .replace(/(\d{2})(\d)/, '($1) $2')
            .replace(/(\d{4})(\d)/, '$1-$2');
    }
    return digits
        .replace(/(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{5})(\d)/, '$1-$2');
};

export default function EditarPerfil() {
    const router = useRouter();

    const [userId, setUserId] = useState(null);
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [cpf, setCpf] = useState('');
    const [telefone, setTelefone] = useState('');

    const originalNome = useRef('');
    const originalTelefone = useRef('');

    const [modalVisible, setModalVisible] = useState(false);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    useEffect(() => {
        async function carregarUsuario() {
            const id = await AsyncStorage.getItem('userId');
            if (!id) return;
            const user = await getUserById(Number(id));
            if (!user) return;

            setUserId(Number(id));
            setNome(user.nome);
            setEmail(user.email);
            setCpf(formatCpfDisplay(user.cpf));
            setTelefone(formatTelDisplay(user.telefone));

            originalNome.current = user.nome;
            originalTelefone.current = formatTelDisplay(user.telefone);
        }
        carregarUsuario();
    }, []);

    const handleSalvar = async () => {
        if (!nome.trim()) {
            Alert.alert('Atenção', 'O nome não pode estar vazio.');
            return;
        }
        try {
            const telDigits = telefone.replace(/\D/g, '');
            await updateUser(userId, nome.trim(), telDigits || null);
            originalNome.current = nome.trim();
            originalTelefone.current = telefone;
            Alert.alert('Sucesso', 'Dados salvos com sucesso!');
        } catch (error) {
            console.error('Erro ao salvar:', error);
            Alert.alert('Erro', 'Não foi possível salvar os dados.');
        }
    };

    const handleCancelar = () => {
        setNome(originalNome.current);
        setTelefone(originalTelefone.current);
        router.push('/perfil');
    };

    const handleSavePassword = async () => {
        if (!password || !confirmPassword) {
            Alert.alert('Atenção', 'Preencha todos os campos!');
            return;
        }
        if (password !== confirmPassword) {
            Alert.alert('Atenção', 'As senhas não coincidem!');
            return;
        }
        if (password.length < 6) {
            Alert.alert('Atenção', 'A senha deve ter pelo menos 6 caracteres!');
            return;
        }
        try {
            await updateUserPassword(userId, password);
            Alert.alert('Sucesso', 'Senha alterada com sucesso!');
            setPassword('');
            setConfirmPassword('');
            setModalVisible(false);
        } catch (error) {
            console.error('Erro ao alterar senha:', error);
            Alert.alert('Erro', 'Não foi possível alterar a senha.');
        }
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
                        <Text style={styles.label}>Nome</Text>
                        <View style={styles.inputWrapper}>
                            <TextInput
                                style={styles.input}
                                value={nome}
                                onChangeText={setNome}
                                placeholder="Seu nome"
                                placeholderTextColor={Colors.cinza}
                                autoCapitalize="words"
                            />
                            <Feather name="edit-2" size={18} color={Colors.marrom} style={styles.editIcon} />
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>E-mail</Text>
                        <View style={styles.inputWrapper}>
                            <TextInput
                                style={[styles.input, styles.disabledInput]}
                                value={email}
                                editable={false}
                                placeholderTextColor={Colors.cinza}
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
                                value={cpf}
                                editable={false}
                                placeholderTextColor={Colors.cinza}
                            />
                            <View style={styles.lockIcon}>
                                <Feather name="lock" size={16} color={Colors.cinza} />
                            </View>
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Telefone</Text>
                        <View style={styles.inputWrapper}>
                            <TextInput
                                style={styles.input}
                                value={telefone}
                                onChangeText={(v) => setTelefone(formatTelInput(v))}
                                placeholder="Seu telefone"
                                placeholderTextColor={Colors.cinza}
                                keyboardType="phone-pad"
                                maxLength={15}
                            />
                            <Feather name="edit-2" size={18} color={Colors.marrom} style={styles.editIcon} />
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
                        <TouchableOpacity style={styles.saveButton} onPress={handleSalvar}>
                            <Text style={styles.saveButtonText}>SALVAR</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.cancelButton} onPress={handleCancelar}>
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
                                    setPassword('');
                                    setConfirmPassword('');
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
        shadowOffset: { width: 0, height: 2 },
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
        shadowOffset: { width: 0, height: 4 },
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
    editIcon: {
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
        shadowOffset: { width: 0, height: 2 },
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
        shadowOffset: { width: 0, height: 4 },
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
