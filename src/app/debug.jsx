import { getAllServicos, initDatabase } from "@/database/database";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";

export default function Debug() {
    const [servicos, setServicos] = useState([]);
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        async function carregar() {
            await initDatabase();
            const id = await AsyncStorage.getItem('userId');
            setUserId(id);
            const dados = await getAllServicos(id ? Number(id) : 1);
            setServicos(dados);
        }
        carregar();
    }, []);

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.titulo}>🗄️ DEBUG — SQLite</Text>
            <Text style={styles.info}>userId no AsyncStorage: {userId ?? 'não encontrado'}</Text>
            <Text style={styles.info}>Total de serviços: {servicos.length}</Text>
            <View style={styles.divider} />

            {servicos.length === 0 ? (
                <Text style={styles.vazio}>Nenhum serviço cadastrado.</Text>
            ) : (
                servicos.map((s, i) => (
                    <View key={s.id_servico} style={styles.card}>
                        <Text style={styles.cardTitulo}>#{i + 1} — {s.titulo}</Text>
                        {Object.entries(s).map(([chave, valor]) => (
                            <View key={chave} style={styles.linha}>
                                <Text style={styles.chave}>{chave}:</Text>
                                <Text style={styles.valor}>{String(valor ?? '—')}</Text>
                            </View>
                        ))}
                    </View>
                ))
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1e1e1e',
        padding: 16,
    },
    titulo: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#61dafb',
        marginBottom: 8,
        marginTop: 40,
    },
    info: {
        fontSize: 13,
        color: '#aaa',
        marginBottom: 4,
    },
    divider: {
        height: 1,
        backgroundColor: '#444',
        marginVertical: 12,
    },
    vazio: {
        color: '#888',
        fontStyle: 'italic',
    },
    card: {
        backgroundColor: '#2d2d2d',
        borderRadius: 8,
        padding: 12,
        marginBottom: 12,
        borderLeftWidth: 3,
        borderLeftColor: '#61dafb',
    },
    cardTitulo: {
        color: '#61dafb',
        fontWeight: 'bold',
        fontSize: 14,
        marginBottom: 8,
    },
    linha: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 3,
        gap: 4,
    },
    chave: {
        color: '#e5c07b',
        fontSize: 12,
        fontWeight: '600',
    },
    valor: {
        color: '#98c379',
        fontSize: 12,
        flexShrink: 1,
    },
});
