import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList, Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

export default function HomeScreen({ navigation }) {
  const [pokemons, setPokemons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); 
  
  const [nextUrl, setNextUrl] = useState('https://pokeapi.co/api/v2/pokemon?limit=20');
  
  const [searchText, setSearchText] = useState('');
  const [types, setTypes] = useState([]); 
  const [selectedType, setSelectedType] = useState(null); 

  useEffect(() => {
    fetchTypes();
    loadPokemons(); 
  }, []);

  const fetchTypes = async () => {
    try {
      const response = await axios.get('https://pokeapi.co/api/v2/type');
      const filteredTypes = response.data.results.filter(t => !['unknown', 'shadow'].includes(t.name));
      setTypes(filteredTypes);
    } catch (error) {
      console.error("Erro ao carregar filtros", error);
      
    }
  };

  const formatPokemonData = (name, url) => {
    const urlParts = url.split('/');
    const id = urlParts[urlParts.length - 2];
    return {
      name,
      id,
      url,
      imageUrl: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`
    };
  };

  const loadPokemons = async () => {
    if (loading || !nextUrl || selectedType) return;

    setLoading(true);
    setError(null); 
    try {
      const response = await axios.get(nextUrl);
      const newPokemons = response.data.results.map((item) => 
        formatPokemonData(item.name, item.url)
      );
      setPokemons([...pokemons, ...newPokemons]);
      setNextUrl(response.data.next); 
    } catch (error) {
      
      if (pokemons.length === 0) {
        setError("Não foi possível carregar os Pokémons.");
      } else {
        alert("Erro de conexão ao carregar mais itens.");
      }
    } finally {
      setLoading(false);
    }
  };

  const loadPokemonsByType = async (type) => {
    setLoading(true);
    setError(null);
    setPokemons([]); 
    setNextUrl(null); 

    try {
      const response = await axios.get(`https://pokeapi.co/api/v2/type/${type}`);
      const typePokemons = response.data.pokemon.map((item) => 
        formatPokemonData(item.pokemon.name, item.pokemon.url)
      );
      setPokemons(typePokemons);
    } catch (error) {
      setError(`Não foi possível carregar Pokémons do tipo ${type}.`);
    } finally {
      setLoading(false);
    }
  };

  const handleTypeSelect = (type) => {
    if (type === selectedType) {
      setSelectedType(null);
      setPokemons([]);
      setNextUrl('https://pokeapi.co/api/v2/pokemon?limit=20');
      setError(null); 
      setTimeout(() => loadPokemons(), 100); 
    } else {
      setSelectedType(type);
      loadPokemonsByType(type);
    }
  };

  
  const handleRetry = () => {
    setError(null);
    if (selectedType) {
      loadPokemonsByType(selectedType);
    } else {
      loadPokemons();
    }
  };

  const filteredPokemons = pokemons.filter(p => 
  p.name.toLowerCase().includes(searchText.toLowerCase()) || 
  p.id.toString().includes(searchText)
  );

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.card} 
      onPress={() => navigation.navigate('Details', { pokemonName: item.name })}
    >
      <Image source={{ uri: item.imageUrl }} style={styles.image} />
      <Text style={styles.name}>#{item.id} {item.name.toUpperCase()}</Text>
    </TouchableOpacity>
  );


  if (error && pokemons.length === 0) {
    return (
      <View style={styles.errorContainer}>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
        <Ionicons name="cloud-offline" size={60} color="#ff3e3e" />
        <Text style={styles.errorText}>{error}</Text>
        <Text style={styles.errorSubText}>Verifique sua conexão com a internet.</Text>
        
        <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
            <Text style={styles.retryButtonText}>Tentar Novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#ff3e3e" />
      
      <View style={styles.headerContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar Pokémon por nome..."
          value={searchText}
          onChangeText={setSearchText}
        />
        
        <View style={{ height: 50 }}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersContainer}>
            {types.map((type) => (
              <TouchableOpacity
                key={type.name}
                style={[
                  styles.typeChip,
                  selectedType === type.name && styles.typeChipSelected
                ]}
                onPress={() => handleTypeSelect(type.name)}
              >
                <Text style={[
                  styles.typeText,
                  selectedType === type.name && styles.typeTextSelected
                ]}>
                  {type.name.toUpperCase()}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>

      <FlatList
        data={filteredPokemons}
        keyExtractor={(item) => item.name}
        renderItem={renderItem}
        onEndReached={() => {
            if (!selectedType && !error) loadPokemons();
        }} 
        onEndReachedThreshold={0.1}
        ListFooterComponent={
          loading ? <ActivityIndicator size="large" color="#ff3e3e" style={{margin: 20}} /> : null
        }
        ListEmptyComponent={
            !loading && (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>Nenhum Pokémon encontrado.</Text>
                </View>
            )
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  headerContainer: { padding: 10, backgroundColor: '#ff3e3e', paddingBottom: 15 },
  searchInput: { backgroundColor: '#fff', padding: 10, borderRadius: 8, marginBottom: 10 },
  
  filtersContainer: { flexDirection: 'row', marginTop: 5 },
  typeChip: {
    backgroundColor: 'rgba(255,255,255,0.3)', paddingHorizontal: 15, paddingVertical: 8,
    borderRadius: 20, marginRight: 8, height: 35, justifyContent: 'center'
  },
  typeChipSelected: { backgroundColor: '#fff' },
  typeText: { color: '#fff', fontWeight: 'bold', fontSize: 12 },
  typeTextSelected: { color: '#ff3e3e' },

  card: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', 
    marginHorizontal: 10, marginVertical: 5, padding: 10, borderRadius: 8, elevation: 2
  },
  image: { width: 70, height: 70 },
  name: { fontSize: 18, fontWeight: 'bold', marginLeft: 10, color: '#333' },
  
  emptyContainer: { alignItems: 'center', marginTop: 50 },
  emptyText: { fontSize: 16, color: '#666' },

 
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: '#fff' },
  errorText: { fontSize: 20, fontWeight: 'bold', color: '#333', marginTop: 20, textAlign: 'center' },
  errorSubText: { fontSize: 16, color: '#666', marginTop: 10, textAlign: 'center', marginBottom: 30 },
  retryButton: { backgroundColor: '#ff3e3e', paddingHorizontal: 30, paddingVertical: 12, borderRadius: 25 },
  retryButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});
