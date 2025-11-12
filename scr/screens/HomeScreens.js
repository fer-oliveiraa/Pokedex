// src/screens/HomeScreen.js
import axios from 'axios';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList, Image,
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
  const [nextUrl, setNextUrl] = useState('https://pokeapi.co/api/v2/pokemon?limit=20');
  const [searchText, setSearchText] = useState('');

  // Função para carregar dados da API
  const loadPokemons = async () => {
    if (loading || !nextUrl) return;

    setLoading(true);
    try {
      const response = await axios.get(nextUrl);
      
      // A API retorna apenas nome e url. Precisamos extrair o ID da url para montar a imagem
      const newPokemons = response.data.results.map((item) => {
        const urlParts = item.url.split('/');
        const id = urlParts[urlParts.length - 2];
        return {
          ...item,
          id,
          imageUrl: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`
        };
      });

      setPokemons([...pokemons, ...newPokemons]);
      setNextUrl(response.data.next); // Prepara a próxima página
    } catch (error) {
      console.error(error);
      alert('Erro ao carregar Pokémons');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPokemons();
  }, []);

  // Filtro de busca local
  const filteredPokemons = pokemons.filter(p => 
    p.name.toLowerCase().includes(searchText.toLowerCase())
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

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#ff3e3e" />
      
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar Pokémon..."
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      <FlatList
        data={filteredPokemons}
        keyExtractor={(item) => item.name}
        renderItem={renderItem}
        onEndReached={loadPokemons} // Gatilho do Scroll Infinito
        onEndReachedThreshold={0.1}
        ListFooterComponent={
          loading ? <ActivityIndicator size="large" color="#ff3e3e" /> : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  searchContainer: { padding: 10, backgroundColor: '#ff3e3e' },
  searchInput: { backgroundColor: '#fff', padding: 10, borderRadius: 8 },
  card: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', 
    margin: 8, padding: 10, borderRadius: 8, elevation: 3
  },
  image: { width: 70, height: 70 },
  name: { fontSize: 18, fontWeight: 'bold', marginLeft: 10 },
});