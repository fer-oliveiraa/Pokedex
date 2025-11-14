import axios from 'axios';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    View
} from 'react-native';

export default function DetailsScreen({ route }) {
  const { pokemonName } = route.params;
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPokemonDetails();
  }, []);

  const fetchPokemonDetails = async () => {
    try {
      const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
      setDetails(response.data);
    } catch (error) {
      alert('Erro ao carregar detalhes');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ff3e3e" />
        <Text>Carregando dados...</Text>
      </View>
    );
  }

  if (!details) return null;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image 
          source={{ uri: details.sprites.other['official-artwork'].front_default }} 
          style={styles.image} 
        />
        <Text style={styles.name}>{details.name.toUpperCase()}</Text>
        
        <View style={styles.typesContainer}>
          {details.types.map((t) => (
            <Text key={t.type.name} style={styles.typeBadge}>
              {t.type.name.toUpperCase()}
            </Text>
          ))}
        </View>
      </View>

      <View style={styles.infoContainer}>
        <View style={styles.row}>
          <Text style={styles.label}>Altura:</Text>
          <Text style={styles.value}>{details.height / 10} m</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Peso:</Text>
          <Text style={styles.value}>{details.weight / 10} kg</Text>
        </View>

        <Text style={styles.sectionTitle}>Estatísticas Base</Text>
        
        {details.stats.map((stat) => (
          <View key={stat.stat.name} style={styles.statContainer}>
            <Text style={styles.statLabel}>
              {stat.stat.name.toUpperCase()} ({stat.base_stat})
            </Text>
            <View style={styles.statBarBg}>
              <View 
                style={[
                  styles.statBarFill, 
                  { width: `${Math.min(stat.base_stat, 100)}%` },
                  { backgroundColor: stat.base_stat > 50 ? '#4caf50' : '#ff9800' }
                ]} 
              />
            </View>
          </View>
        ))}
        
        <Text style={styles.sectionTitle}>Habilidades</Text>
        <View style={styles.abilitiesContainer}>
             {details.abilities.map((a) => (
                <Text key={a.ability.name} style={styles.abilityText}>
                    • {a.ability.name}
                </Text>
             ))}
        </View>

      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { alignItems: 'center', padding: 20, backgroundColor: '#f5f5f5' },
  image: { width: 200, height: 200 },
  name: { fontSize: 26, fontWeight: 'bold', marginTop: 10 },
  typesContainer: { flexDirection: 'row', marginTop: 10 },
  typeBadge: { 
    backgroundColor: '#ff3e3e', color: '#fff', padding: 5, 
    borderRadius: 5, marginHorizontal: 5, fontWeight: 'bold' 
  },
  infoContainer: { padding: 20 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  label: { fontSize: 16, fontWeight: 'bold', color: '#555' },
  value: { fontSize: 16 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', marginTop: 20, marginBottom: 10, color: '#333' },
  statContainer: { marginBottom: 10 },
  statLabel: { marginBottom: 5, fontSize: 12, color: '#666' },
  statBarBg: { height: 10, backgroundColor: '#eee', borderRadius: 5 },
  statBarFill: { height: 10, borderRadius: 5 },
  abilitiesContainer: { marginTop: 5 },
  abilityText: { fontSize: 16, marginBottom: 5, textTransform: 'capitalize' }
});
