import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, Text, View, FlatList, Image, TouchableOpacity, TextInput, SafeAreaView, StatusBar 
} from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { Audio } from 'expo-av';

// Mövcud rəngli tema seçimləri
const THEMES = {
  orange: { primary: '#FF9800', cardBg: '#1E1E1E', text: '#FFFFFF', subText: '#AAAAAA' },
  purple: { primary: '#9C27B0', cardBg: '#1E1E1E', text: '#FFFFFF', subText: '#AAAAAA' },
  blue: { primary: '#2196F3', cardBg: '#1E1E1E', text: '#FFFFFF', subText: '#AAAAAA' },
  green: { primary: '#4CAF50', cardBg: '#1E1E1E', text: '#FFFFFF', subText: '#AAAAAA' },
  pink: { primary: '#E91E63', cardBg: '#1E1E1E', text: '#FFFFFF', subText: '#AAAAAA' },
};

// Başlanğıc Radio Siyahısı (Azərbaycan və Türkiyə stansiyaları - Video ardıcıllığı ilə)
const RADIO_STATIONS = [
  {
    id: '1',
    name: 'Best FM',
    genre: 'Populyar • Türk Popu',
    location: 'İstanbul',
    logo: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=100&h=100&fit=crop',
    streamUrl: 'https://ucars.radyotelekom.com/bestfm/playlist.m3u8'
  },
  {
    id: '2',
    name: 'Blue Karadeniz Radyo',
    genre: 'Xalq Musiqisi • Qara Dəniz',
    location: 'Trabzon',
    logo: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=100&h=100&fit=crop',
    streamUrl: 'https://radyo.bluekaradeniz.com:9300/stream'
  },
  {
    id: '3',
    name: 'Day.az Azerbaycan',
    genre: 'Dünya Musiqisi • Xəbər',
    location: 'Bakı',
    logo: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=100&h=100&fit=crop',
    streamUrl: 'https://stream.day.az/radio'
  },
  {
    id: '4',
    name: 'Damar FM',
    genre: 'Arabesk • Fantazi',
    location: 'Berlin',
    logo: 'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=100&h=100&fit=crop',
    streamUrl: 'https://icast.connectmedia.hu/5001/live.mp3'
  },
  {
    id: '5',
    name: 'Discoland',
    genre: 'Funk • Disco • 90s',
    location: 'Avropa',
    logo: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=100&h=100&fit=crop',
    streamUrl: 'https://stream.discoland.ro/live'
  }
];

export default function App() {
  const [currentTheme, setCurrentTheme] = useState('orange');
  const [searchQuery, setSearchQuery] = useState('');
  const [playingStation, setPlayingStation] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [sound, setSound] = useState(null);
  const [showThemeModal, setShowThemeModal] = useState(false);

  const theme = THEMES[currentTheme];

  // Radio oynatma funksiyası
  async function handlePlayStation(station) {
    try {
      if (sound) {
        await sound.unloadAsync();
      }
      
      if (playingStation?.id === station.id && isPlaying) {
        setIsPlaying(false);
        setPlayingStation(null);
        return;
      }

      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: station.streamUrl },
        { shouldPlay: true }
      );
      
      setSound(newSound);
      setPlayingStation(station);
      setIsPlaying(true);
    } catch (error) {
      console.log("Radio oxutma xətası:", error);
    }
  }

  // Axtarış filtrləməsi
  const filteredStations = RADIO_STATIONS.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.genre.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: '#121212' }]}>
      <StatusBar barStyle="light-content" />

      {/* Üst Navigasiya Paneli */}
      <View style={styles.header}>
        <TouchableOpacity>
          <Ionicons name="menu" size={26} color={theme.primary} />
        </TouchableOpacity>
        
        <View style={styles.headerTitleContainer}>
          <FontAwesome5 name="moon" size={18} color={theme.primary} />
          <Text style={styles.headerTitle}> Luna Radio</Text>
        </View>

        <TouchableOpacity onPress={() => setShowThemeModal(!showThemeModal)}>
          <Ionicons name="color-palette" size={24} color={theme.primary} />
        </TouchableOpacity>
      </View>

      {/* Tema Seçim Paneli (Aktiv olduqda görünür) */}
      {showThemeModal && (
        <View style={styles.themeSelector}>
          <Text style={styles.themeLabel}>Tema Seç:</Text>
          <View style={styles.themeButtons}>
            {Object.keys(THEMES).map((key) => (
              <TouchableOpacity 
                key={key} 
                style={[styles.themeDot, { backgroundColor: THEMES[key].primary }]} 
                onPress={() => { setCurrentTheme(key); setShowThemeModal(false); }}
              />
            ))}
          </View>
        </View>
      )}

      {/* Axtarış Sətri */}
      <View style={[styles.searchContainer, { backgroundColor: theme.cardBg }]}>
        <Ionicons name="search" size={20} color={theme.subText} style={styles.searchIcon} />
        <TextInput
          placeholder="Radio və ya janr axtar..."
          placeholderTextColor={theme.subText}
          style={[styles.searchInput, { color: theme.text }]}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Radio Siyahısı (Dairəvi loqolar və tünd dizayn) */}
      <FlatList
        data={filteredStations}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={[styles.stationCard, { backgroundColor: theme.cardBg }]}
            onPress={() => handlePlayStation(item)}
          >
            <Image source={{ uri: item.logo }} style={styles.stationLogo} />
            <View style={styles.stationInfo}>
              <Text style={[styles.stationName, { color: theme.text }]}>{item.name}</Text>
              <Text style={[styles.stationGenre, { color: theme.subText }]}>{item.genre}</Text>
            </View>
            <TouchableOpacity>
              <Ionicons name="heart-outline" size={22} color={theme.subText} />
            </TouchableOpacity>
          </TouchableOpacity>
        )}
      />

      {/* Aşağıdakı Mini-Pleyer */}
      {playingStation && (
        <View style={[styles.miniPlayer, { backgroundColor: theme.cardBg, borderTopColor: theme.primary }]}>
          <Image source={{ uri: playingStation.logo }} style={styles.miniLogo} />
          <View style={styles.miniInfo}>
            <Text style={[styles.miniName, { color: theme.text }]}>{playingStation.name}</Text>
            <Text style={[styles.miniStatus, { color: theme.primary }]}>Canlı çalır...</Text>
          </View>
          <TouchableOpacity onPress={() => handlePlayStation(playingStation)} style={[styles.playBtn, { backgroundColor: theme.primary }]}>
            <Ionicons name={isPlaying ? "pause" : "play"} size={22} color="#FFF" />
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16 },
  headerTitleContainer: { flexDirection: 'row', alignItems: 'center' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#FFF' },
  themeSelector: { backgroundColor: '#1E1E1E', padding: 12, marginHorizontal: 16, borderRadius: 10, alignItems: 'center', marginBottom: 10 },
  themeLabel: { color: '#FFF', fontSize: 14, marginBottom: 8 },
  themeButtons: { flexDirection: 'row', gap: 15 },
  themeDot: { width: 30, height: 30, borderRadius: 15 },
  searchContainer: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 16, borderRadius: 25, paddingHorizontal: 15, height: 45, marginBottom: 15 },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1, fontSize: 15 },
  stationCard: { flexDirection: 'row', alignItems: 'center', padding: 12, marginHorizontal: 16, marginVertical: 6, borderRadius: 12 },
  stationLogo: { width: 55, height: 55, borderRadius: 27.5, marginRight: 15 },
  stationInfo: { flex: 1 },
  stationName: { fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
  stationGenre: { fontSize: 13 },
  miniPlayer: { flexDirection: 'row', alignItems: 'center', padding: 12, borderTopWidth: 2, position: 'absolute', bottom: 0, left: 0, right: 0 },
  miniLogo: { width: 45, height: 45, borderRadius: 22.5, marginRight: 12 },
  miniInfo: { flex: 1 },
  miniName: { fontSize: 15, fontWeight: 'bold' },
  miniStatus: { fontSize: 12, marginTop: 2 },
  playBtn: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' }
});
