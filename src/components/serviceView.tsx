import { Text, View, StyleSheet, Pressable } from "react-native";

export function ServiceView() {
    return (
        <View>
            <View>
                //container com dois icon avaliacao e favoritar
            //imagem do serviço
            </View>
            <View>
                <Text>Nome</Text>
                <Text>Profissao</Text>
                <Text>descrição</Text>
                <Pressable >
                    <Text >Ver mais</Text>
                </Pressable>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
    }

})