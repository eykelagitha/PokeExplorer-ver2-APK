import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Image, ScrollView, ActivityIndicator } from 'react-native';

export default function DetailScreen({ route }) {
  const { pokemon } = route.params;
  const [detail, setDetail] = useState(null);

  useEffect(() => {
    fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon.id}`)
      .then((r) => r.json())
      .then((d) => setDetail(d))
      .catch((e) => console.warn(e));
  }, [pokemon.id]);

  if (!detail) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ alignItems: 'center', padding: 20 }}>
      <Image source={{ uri: pokemon.image }} style={styles.image} />
      <Text style={styles.name}>{pokemon.name}</Text>
      <Text style={styles.id}>#{String(pokemon.id).padStart(3, '0')}</Text>

      <View style={styles.statsBox}>
        <Text style={styles.sectionTitle}>Stats</Text>
        {detail.stats.map((s) => (
          <View key={s.stat.name} style={styles.statRow}>
            <Text style={styles.statLabel}>{s.stat.name}</Text>
            <Text style={styles.statValue}>{s.base_stat}</Text>
          </View>
        ))}
      </View>

      <View style={styles.statsBox}>
        <Text style={styles.sectionTitle}>Info</Text>
        <Text style={styles.infoText}>Height: {detail.height / 10} m</Text>
        <Text style={styles.infoText}>Weight: {detail.weight / 10} kg</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  image: { width: 160, height: 160 },
  name: { fontSize: 26, fontWeight: '700', textTransform: 'capitalize' },
  id: { fontSize: 14, color: '#999', marginBottom: 16 },
  statsBox: { width: '100%', marginTop: 12, backgroundColor: '#F5F5F5', borderRadius: 12, padding: 16 },
  sectionTitle: { fontWeight: '700', fontSize: 16, marginBottom: 8 },
  statRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 },
  statLabel: { textTransform: 'capitalize', color: '#555' },
  statValue: { fontWeight: '700' },
  infoText: { color: '#555', paddingVertical: 2 },
});
