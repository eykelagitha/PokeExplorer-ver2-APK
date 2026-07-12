import AsyncStorage from '@react-native-async-storage/async-storage';

const FAVORITES_KEY = '@poke_explorer_favorites';

export async function getFavorites() {
  try {
    const raw = await AsyncStorage.getItem(FAVORITES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.warn('Failed to load favorites', e);
    return [];
  }
}

export async function saveFavorites(favorites) {
  try {
    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  } catch (e) {
    console.warn('Failed to save favorites', e);
  }
}

export async function toggleFavorite(pokemon) {
  const current = await getFavorites();
  const exists = current.find((p) => p.id === pokemon.id);
  const updated = exists
    ? current.filter((p) => p.id !== pokemon.id)
    : [...current, pokemon];
  await saveFavorites(updated);
  return updated;
}
