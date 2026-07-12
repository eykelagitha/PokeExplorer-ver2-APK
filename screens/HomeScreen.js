import React, { useState, useEffect, useCallback, useRef } from 'react';
import { StyleSheet, View, FlatList, ActivityIndicator, TextInput, Text } from 'react-native';
import PokemonCard from '../components/PokemonCard';
import VersionFooter from '../components/VersionFooter';
import { getFavorites, toggleFavorite } from '../utils/storage';

const PAGE_SIZE = 20;

async function fetchPokemonPage(offset) {
  const listRes = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${PAGE_SIZE}&offset=${offset}`);
  const listJson = await listRes.json();
  const detailed = await Promise.all(
    listJson.results.map(async (p) => {
      const res = await fetch(p.url);
      const d = await res.json();
      return {
        id: d.id,
        name: d.name,
        image: d.sprites?.front_default,
        types: d.types.map((t) => t.type.name),
      };
    })
  );
  return { items: detailed, hasMore: !!listJson.next };
}

export default function HomeScreen({ navigation }) {
  const [pokemons, setPokemons] = useState([]);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [favorites, setFavorites] = useState([]);
  const [search, setSearch] = useState('');

  // Ref-based guard (not state) so overlapping calls — e.g. React 18
  // StrictMode invoking effects twice in dev — can't both slip through
  // before state has a chance to update.
  const isFetchingRef = useRef(false);
  const offsetRef = useRef(0);
  const hasMoreRef = useRef(true);

  const loadMore = useCallback(async () => {
    if (isFetchingRef.current || !hasMoreRef.current) return;
    isFetchingRef.current = true;
    setLoading(true);
    try {
      const { items, hasMore: more } = await fetchPokemonPage(offsetRef.current);
      setPokemons((prev) => {
        const existingIds = new Set(prev.map((p) => p.id));
        const deduped = items.filter((p) => !existingIds.has(p.id));
        return [...prev, ...deduped];
      });
      offsetRef.current += PAGE_SIZE;
      setOffset(offsetRef.current);
      hasMoreRef.current = more;
      setHasMore(more);
    } catch (e) {
      console.warn('Failed to fetch pokemon', e);
    } finally {
      isFetchingRef.current = false;
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMore();
    getFavorites().then(setFavorites);
  }, [loadMore]);

  const handleToggleFavorite = async (pokemon) => {
    const updated = await toggleFavorite(pokemon);
    setFavorites(updated);
  };

  const isFavorite = (id) => favorites.some((f) => f.id === id);

  const filtered = search
    ? pokemons.filter((p) => p.name.includes(search.toLowerCase()))
    : pokemons;

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.search}
        placeholder="Cari pokemon..."
        value={search}
        onChangeText={setSearch}
      />
      <FlatList
        data={filtered}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        renderItem={({ item }) => (
          <PokemonCard
            pokemon={item}
            isFavorite={isFavorite(item.id)}
            onToggleFavorite={() => handleToggleFavorite(item)}
            onPress={() => navigation.navigate('Detail', { pokemon: item })}
          />
        )}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          loading ? <ActivityIndicator style={{ margin: 16 }} /> : <VersionFooter />
        }
        contentContainerStyle={{ paddingVertical: 8 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  search: {
    margin: 12,
    padding: 10,
    borderRadius: 12,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
});