import React, { useState, useCallback } from 'react';
import { StyleSheet, View, FlatList, Text } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import PokemonCard from '../components/PokemonCard';
import { getFavorites, toggleFavorite } from '../utils/storage';

export default function FavoritesScreen({ navigation }) {
  const [favorites, setFavorites] = useState([]);

  useFocusEffect(
    useCallback(() => {
      getFavorites().then(setFavorites);
    }, [])
  );

  const handleToggleFavorite = async (pokemon) => {
    const updated = await toggleFavorite(pokemon);
    setFavorites(updated);
  };

  if (favorites.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>Belum ada pokemon favorit.{"\n"}Tap ☆ di halaman utama untuk menambahkan.</Text>
      </View>
    );
  }

  return (
    <FlatList
      style={styles.container}
      data={favorites}
      keyExtractor={(item) => String(item.id)}
      renderItem={({ item }) => (
        <PokemonCard
          pokemon={item}
          isFavorite={true}
          onToggleFavorite={() => handleToggleFavorite(item)}
          onPress={() => navigation.navigate('Detail', { pokemon: item })}
        />
      )}
      contentContainerStyle={{ paddingVertical: 8 }}
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  emptyText: { textAlign: 'center', color: '#999', fontSize: 15 },
});
