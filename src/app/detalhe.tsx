import { Footer } from "@/components/footer";
import Colors from "@/constants/Colors";
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useRef, useState } from "react";
import {
  Dimensions,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type FeatherIconName = React.ComponentProps<typeof Feather>['name'];

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const HERO_IMAGES = [
  require("@/assets/img/FOTOFREELANCER1.png"),
  require("@/assets/img/FOTOFREELANCER1.png"),
  require("@/assets/img/FOTOFREELANCER1.png"),
  require("@/assets/img/FOTOFREELANCER1.png"),
  require("@/assets/img/FOTOFREELANCER1.png"),
  require("@/assets/img/FOTOFREELANCER1.png"),
  require("@/assets/img/FOTOFREELANCER1.png"),
];

export default function ProviderDetail() {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);
  const swiperRef = useRef<ScrollView>(null);

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
    setActiveIndex(index);
  };

  // Função para navegar para a tela de conversa
  const handleNegotiate = () => {
    router.push('/conversaC');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView showsVerticalScrollIndicator={false} style={styles.scroll}>

        {/* Hero Swiper */}
        <View style={styles.heroContainer}>
          <ScrollView
            ref={swiperRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={handleScroll}
            scrollEventThrottle={16}
            style={styles.swiperScroll}
          >
            {HERO_IMAGES.map((src, i) => (
              <Image
                key={i}
                source={src}
                style={styles.heroImage}
                resizeMode="cover"
              />
            ))}
          </ScrollView>

          {/* Back Button */}
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Feather name="chevron-left" size={20} color={Colors.preto} />
          </TouchableOpacity>

          {/* Top Right Actions */}
          <View style={styles.topRightActions}>
            <TouchableOpacity style={styles.heartButton}>
              <Feather name="heart" size={20} color={Colors.marrom} />
            </TouchableOpacity>
            <View style={styles.ratingBadge}>
              <Feather name="star" size={13} color={Colors.marrom} />
              <Text style={styles.ratingText}>4.5</Text>
            </View>
          </View>

          {/* Dots Indicator */}
          <View style={styles.dotsContainer}>
            {HERO_IMAGES.map((_, i) => (
              <View
                key={i}
                style={[styles.dot, i === activeIndex && styles.dotActive]}
              />
            ))}
          </View>
        </View>

        {/* Content Card */}
        <View style={styles.card}>
          <View style={styles.profileRow}>
            <Image
              source={require("@/assets/img/FOTOFREELANCER1.png")}
              style={styles.avatar}
            />
            <View style={styles.nameBlock}>
              <View style={styles.nameBadgeRow}>
                <View style={styles.presencialBadge}>
                  <Feather name="user" size={13} color={Colors.creme} />
                  <Text style={styles.presencialText}>Presencial</Text>
                </View>
                <TouchableOpacity style={styles.alertIcon}>
                  <Feather name="alert-triangle" size={18} color={Colors.marromClaro} />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <Text style={styles.name}>Andrey Silva</Text>
          <Text style={styles.location}>São Paulo, SP - Centro Universitário Senac</Text>

          <Text style={styles.description}>
            Fictional Latin placeholder text with no specific meaning, used to simulate content in layouts and designs.
          </Text>
          <Text style={styles.description}>
            Fictional Latin placeholder text with no specific meaning, used to simulate content in layouts and designs.
          </Text>

          <View style={styles.divider} />

          <View style={styles.priceRow}>
            <View>
              <Text style={styles.priceLabel}>Valor estimado do serviço</Text>
              <Text style={styles.price}>$185</Text>
            </View>
            <TouchableOpacity
              style={styles.negociarButton}
              onPress={handleNegotiate} // Adiciona o evento de press
            >
              <Text style={styles.negociarText}>NEGOCIAR</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <Footer />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.creme,
  },
  scroll: {
    flex: 1,
    backgroundColor: Colors.creme,
  },

  /* Hero Swiper */
  heroContainer: {
    position: 'relative',
    width: '100%',
    height: 300,
  },
  swiperScroll: {
    width: SCREEN_WIDTH,
    height: 300,
  },
  heroImage: {
    width: SCREEN_WIDTH,
    height: 300,
  },
  backButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.creme,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.preto,
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  topRightActions: {
    position: 'absolute',
    top: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  heartButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.creme,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.preto,
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.creme,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
    shadowColor: Colors.preto,
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  ratingText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.marrom,
    fontFamily: "Koho",
  },

  /* Dots */
  dotsContainer: {
    position: 'absolute',
    bottom: 12,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  dotActive: {
    width: 18,
    backgroundColor: Colors.creme,
  },

  /* Card */
  card: {
    backgroundColor: Colors.creme,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: Colors.bege,
  },
  nameBlock: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  nameBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  presencialBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cinza,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  presencialText: {
    color: Colors.creme,
    fontSize: 13,
    fontWeight: '500',
    fontFamily: "Koho",
  },
  alertIcon: {
    padding: 4,
  },
  name: {
    fontSize: 30,
    fontWeight: '700',
    color: Colors.marrom,
    marginTop: 8,
    marginBottom: 2,
    fontFamily: "Koho",
  },
  location: {
    fontSize: 18,
    color: Colors.marromClaro,
    marginBottom: 14,
    fontFamily: "Koho",
  },
  description: {
    fontSize: 20,
    color: Colors.cinza,
    lineHeight: 21,
    marginBottom: 10,
    fontFamily: "Koho",
  },
  divider: {
    height: 1,
    backgroundColor: Colors.bege,
    marginVertical: 16,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  priceLabel: {
    fontSize: 14,
    color: Colors.cinza,
    fontWeight: '600',
    marginBottom: 4,
    fontFamily: "Koho",
  },
  price: {
    fontSize: 42,
    fontWeight: '800',
    color: '#2E7D32',
    fontFamily: "Koho",
  },
  negociarButton: {
    backgroundColor: Colors.dourado,
    paddingHorizontal: 28,
    paddingVertical: 16,
    borderRadius: 30,
  },
  negociarText: {
    color: Colors.creme,
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 1,
    fontFamily: "Koho",
  },
});