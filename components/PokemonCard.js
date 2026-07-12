import React, { useRef, useEffect } from 'react';
import { Animated, StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';

const TYPE_COLORS = {
  fire: '#FF7A3C', water: '#4FC3F7', grass: '#66BB6A', electric: '#FFD54F',
  poison: '#AB47BC', bug: '#9CCC65', normal: '#B0BEC5', ground: '#D4A373',
  flying: '#90A4AE', psychic: '#F06292', rock: '#A1887F', ice: '#80DEEA',
  fighting: '#E57373', ghost: '#7E57C2', dragon: '#5C6BC0', dark: '#616161',
  steel: '#78909C', fairy: '#F48FB1',
};

export default function PokemonCard({ pokemon, onPress, isFavorite, onToggleFavorite }) {
  const fade = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, { toValue: 1, duration: 350, useNativeDriver: true }),
      Animated.spring(scale, { toValue: 1, friction: 6, useNativeDriver: true }),
    ]).start();
  }, []);

  const mainType = pokemon.types?.[0] || 'normal';
  const bg = TYPE_COLORS[mainType] || '#B0BEC5';

  return (
    <Animated.View style={{ opacity: fade, transform: [{ scale }] }}>
      <TouchableOpacity style={[styles.card, { backgroundColor: bg }]} onPress={onPress} activeOpacity={0.85}>
        <Image source={{ uri: pokemon.image }} style={styles.image} />
        <View style={styles.info}>
          <Text style={styles.id}>#{String(pokemon.id).padStart(3, '0')}</Text>
          <Text style={styles.name}>{pokemon.name}</Text>
          <View style={styles.typeRow}>
            {pokemon.types?.map((t) => (
              <View key={t} style={styles.typeBadge}>
                <Text style={styles.typeText}>{t}</Text>
              </View>
            ))}
          </View>
        </View>
        <TouchableOpacity onPress={onToggleFavorite} style={styles.favBtn} hitSlop={{top:10,bottom:10,left:10,right:10}}>
          <Text style={styles.favIcon}>{isFavorite ? '★' : '☆'}</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    padding: 12,
    marginHorizontal: 16,
    marginVertical: 6,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  image: { width: 64, height: 64, marginRight: 12 },
  info: { flex: 1 },
  id: { color: '#fff', opacity: 0.8, fontSize: 12, fontWeight: '600' },
  name: { color: '#fff', fontSize: 18, fontWeight: '700', textTransform: 'capitalize' },
  typeRow: { flexDirection: 'row', marginTop: 4, gap: 6 },
  typeBadge: { backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 2 },
  typeText: { color: '#fff', fontSize: 11, fontWeight: '600', textTransform: 'capitalize' },
  favBtn: { padding: 6 },
  favIcon: { fontSize: 26, color: '#fff' },
});
