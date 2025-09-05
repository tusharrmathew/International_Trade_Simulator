import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Card, Title, Paragraph, Button, Text, FAB } from 'react-native-paper';
import axios from 'axios';
import { API_URL, GAME_MODES, DIFFICULTY_LEVELS } from '../config';

const HomeScreen = ({ navigation }) => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchGames = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/games`);
      setGames(response.data);
    } catch (error) {
      console.error('Error fetching games:', error);
    }
  };

  useEffect(() => {
    fetchGames();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchGames();
    setRefreshing(false);
  };

  const createNewGame = async (mode) => {
    try {
      setLoading(true);
      const response = await axios.post(`${API_URL}/api/games/create`, {
        name: `New ${mode} Game`,
        settings: {
          mode,
          difficulty: DIFFICULTY_LEVELS.MEDIUM,
        },
        hostId: 'current-user-id' // Replace with actual user ID
      });

      navigation.navigate('Game', { gameId: response.data._id });
    } catch (error) {
      console.error('Error creating game:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.header}>
          <Title style={styles.title}>Welcome to TradeSphere</Title>
          <Paragraph style={styles.subtitle}>
            Choose a game mode or join an existing game
          </Paragraph>
        </View>

        <View style={styles.gameModes}>
          <Card style={styles.card}>
            <Card.Content>
              <Title>Single Player</Title>
              <Paragraph>Practice your trade strategies against AI opponents</Paragraph>
            </Card.Content>
            <Card.Actions>
              <Button onPress={() => createNewGame(GAME_MODES.SINGLE_PLAYER)}>
                Start Game
              </Button>
            </Card.Actions>
          </Card>

          <Card style={styles.card}>
            <Card.Content>
              <Title>Multiplayer</Title>
              <Paragraph>Compete with other players in real-time</Paragraph>
            </Card.Content>
            <Card.Actions>
              <Button onPress={() => createNewGame(GAME_MODES.MULTIPLAYER)}>
                Create Game
              </Button>
            </Card.Actions>
          </Card>

          <Card style={styles.card}>
            <Card.Content>
              <Title>Educational</Title>
              <Paragraph>Learn about global trade through guided scenarios</Paragraph>
            </Card.Content>
            <Card.Actions>
              <Button onPress={() => createNewGame(GAME_MODES.EDUCATIONAL)}>
                Start Learning
              </Button>
            </Card.Actions>
          </Card>
        </View>

        <View style={styles.activeGames}>
          <Title style={styles.sectionTitle}>Active Games</Title>
          {games.length === 0 ? (
            <Text style={styles.noGames}>No active games</Text>
          ) : (
            games.map((game) => (
              <Card key={game._id} style={styles.gameCard}>
                <Card.Content>
                  <Title>{game.name}</Title>
                  <Paragraph>Mode: {game.settings.mode}</Paragraph>
                  <Paragraph>Players: {game.players.length}</Paragraph>
                </Card.Content>
                <Card.Actions>
                  <Button onPress={() => navigation.navigate('Game', { gameId: game._id })}>
                    Join Game
                  </Button>
                </Card.Actions>
              </Card>
            ))
          )}
        </View>
      </ScrollView>

      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => navigation.navigate('Game')}
        label="New Game"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  subtitle: {
    color: '#666',
  },
  gameModes: {
    padding: 10,
  },
  card: {
    marginBottom: 10,
  },
  activeGames: {
    padding: 10,
  },
  sectionTitle: {
    marginBottom: 10,
  },
  noGames: {
    textAlign: 'center',
    color: '#666',
    marginVertical: 20,
  },
  gameCard: {
    marginBottom: 10,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default HomeScreen; 