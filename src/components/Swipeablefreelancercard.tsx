import { useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Image,
  PanResponder,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.28;
const SWIPE_OUT_DURATION = 280;

export type FreelancerItem = {
  id: string;
  imageFreelancer: any;
  nome: string;
  profissao: string;
  descricao: string;
  avaliacao: number;
  preco: number;
  onVerDetalhes?: () => void;
};

type CardProps = {
  item: FreelancerItem;
  isTop: boolean;
  stackIndex: number;
  onSwiped: () => void;
};

function FreelancerCard({ item, isTop, stackIndex, onSwiped }: CardProps) {
  const position = useRef(new Animated.ValueXY()).current;

  const rotate = position.x.interpolate({
    inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
    outputRange: ["-8deg", "0deg", "8deg"],
    extrapolate: "clamp",
  });

  const forceSwipe = (direction: "left" | "right") => {
    const x = direction === "right" ? SCREEN_WIDTH + 100 : -SCREEN_WIDTH - 100;
    Animated.timing(position, {
      toValue: { x, y: 0 },
      duration: SWIPE_OUT_DURATION,
      useNativeDriver: false,
    }).start(onSwiped);
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => isTop,
      onPanResponderMove: (_, gesture) => {
        position.setValue({ x: gesture.dx, y: gesture.dy * 0.1 });
      },
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dx > SWIPE_THRESHOLD) {
          forceSwipe("right");
        } else if (gesture.dx < -SWIPE_THRESHOLD) {
          forceSwipe("left");
        } else {
          Animated.spring(position, {
            toValue: { x: 0, y: 0 },
            friction: 5,
            useNativeDriver: false,
          }).start();
        }
      },
    })
  ).current;

  const scale = 1 - stackIndex * 0.045;
  const translateYOffset = stackIndex * 14;

  const animatedStyle = isTop
    ? {
        transform: [
          { translateX: position.x },
          { translateY: position.y },
          { rotate },
        ],
        zIndex: 10,
      }
    : {
        transform: [{ scale }, { translateY: translateYOffset }],
        zIndex: 10 - stackIndex,
        opacity: 1 - stackIndex * 0.08,
      };

  return (
    <Animated.View
      style={[styles.card, animatedStyle]}
      {...(isTop ? panResponder.panHandlers : {})}
    >
      <View style={styles.imageContainer}>
        <Image source={item.imageFreelancer} style={styles.image} />

        <View style={styles.avaliacaoBadge}>
          <Ionicons name="star" size={13} color={Colors.dourado} />
          <Text style={styles.avaliacaoText}>{item.avaliacao.toFixed(1)}</Text>
        </View>

        <View style={styles.favoritoBadge}>
          <Ionicons name="heart-outline" size={18} color="white" />
        </View>

        <View style={styles.chatBadge}>
          <Ionicons name="chatbubble-outline" size={17} color="white" />
        </View>
      </View>

      <View style={styles.body}>
        <Text style={styles.nome}>{item.nome.toUpperCase()}</Text>
        <Text style={styles.profissao}>{item.profissao}</Text>
        <Text style={styles.descricao} numberOfLines={3} ellipsizeMode="tail">
          {item.descricao}
        </Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.footer}>
        <View>
          <Text style={styles.profissaoFooter}>{item.profissao}</Text>
          <Text style={styles.preco}>
            ${item.preco}
            <Text style={styles.precoHora}>/hr</Text>
          </Text>
        </View>

        <Pressable style={styles.botao} onPress={item.onVerDetalhes}>
          <Text style={styles.botaoText}>SEE DETAILS</Text>
        </Pressable>
      </View>
    </Animated.View>
  );
}

// ─── Stack ────────────────────────────────────────────────────────────────────
type StackProps = {
  freelancers: FreelancerItem[];
};

export function SwipeableFreelancerCard({ freelancers }: StackProps) {
  const [cards, setCards] = useState(freelancers);
  const [swipeCount, setSwipeCount] = useState(0);

  const handleSwiped = () => {
    setCards((prev) => {
      const [first, ...rest] = prev;
      return [...rest, first]; // move o primeiro pro final
    });
    setSwipeCount((c) => c + 1); // muda o key do topo → força remontagem → reseta posição
  };

  return (
    <View style={styles.stackContainer}>
      {cards
        .slice(0, 3)
        .reverse()
        .map((item, reversedIndex) => {
          const stackIndex = Math.min(cards.slice(0, 3).length - 1 - reversedIndex, 2);
          const isTop = stackIndex === 0;
          // key com swipeCount garante que o card topo é remontado a cada swipe
          // sem isso, React reutiliza o componente e a posição animada não reseta
          const key = isTop
            ? `top-${swipeCount}`
            : `behind-${item.id}-${swipeCount}`;
          return (
            <FreelancerCard
              key={key}
              item={item}
              isTop={isTop}
              stackIndex={stackIndex}
              onSwiped={handleSwiped}
            />
          );
        })}
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  stackContainer: {
    width: "100%",
    height: 460,
    alignItems: "center",
    justifyContent: "center",
  },

  card: {
    position: "absolute",
    width: "100%",
    backgroundColor: Colors.preto,
    borderRadius: 24,
    overflow: "hidden",
    elevation: 10,
  },

  imageContainer: {
    width: "100%",
    height: 250,
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  avaliacaoBadge: {
    position: "absolute",
    top: 12,
    left: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(0,0,0,0.55)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
  },
  avaliacaoText: {
    color: Colors.creme,
    fontSize: 13,
    fontFamily: "KohoMedium",
  },
  favoritoBadge: {
    position: "absolute",
    top: 12,
    right: 52,
    backgroundColor: "rgba(0,0,0,0.55)",
    padding: 7,
    borderRadius: 20,
  },
  chatBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "rgba(0,0,0,0.55)",
    padding: 7,
    borderRadius: 20,
  },

  body: {
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 12,
  },
  nome: {
    color: Colors.creme,
    fontSize: 22,
    fontFamily: "KohoMedium",
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  profissao: {
    color: Colors.dourado,
    fontSize: 13,
    fontFamily: "KohoMedium",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  descricao: {
    color: Colors.bege,
    fontSize: 13,
    fontFamily: "KohoMedium",
    lineHeight: 19,
  },

  divider: {
    height: 1,
    backgroundColor: "#2E2E2E",
    marginHorizontal: 18,
    marginBottom: 14,
  },

  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingBottom: 20,
  },
  profissaoFooter: {
    color: Colors.dourado,
    fontSize: 11,
    fontFamily: "KohoMedium",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  preco: {
    color: Colors.creme,
    fontSize: 28,
    fontFamily: "KohoMedium",
  },
  precoHora: {
    fontSize: 13,
    color: Colors.cinza,
  },
  botao: {
    backgroundColor: Colors.creme,
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 50,
  },
  botaoText: {
    color: Colors.preto,
    fontSize: 12,
    fontFamily: "KohoMedium",
    fontWeight: "800",
    letterSpacing: 0.8,
  },
});