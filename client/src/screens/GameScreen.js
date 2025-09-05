import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Card, Title, Paragraph, Button, Text, ProgressBar, Divider } from 'react-native-paper';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import io from 'socket.io-client';
import axios from 'axios';
import { API_URL, SOCKET_URL } from '../config';

const GameScreen = ({ route, navigation }) => {
  const { gameId } = route.params;
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState(null);
  const [tradeProposals, setTradeProposals] = useState([]);

  useEffect(() => {
    const fetchGame = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/games/${gameId}`);
        setGame(response.data);
      } catch (error) {
        console.error('Error fetching game:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGame();

    // Initialize socket connection
    const newSocket = io(SOCKET_URL);
    setSocket(newSocket);

    newSocket.emit('joinGame', gameId);

    newSocket.on('newTradeProposal', (proposal) => {
      setTradeProposals(prev => [...prev, proposal]);
    });

    newSocket.on('gameStateUpdate', (updatedGame) => {
      setGame(updatedGame);
    });

    return () => {
      newSocket.disconnect();
    };
  }, [gameId]);

  const handleTradeProposal = async (proposal) => {
    try {
      await axios.post(`${API_URL}/api/games/${gameId}/trade`, proposal);
      socket.emit('tradeProposal', { gameId, ...proposal });
    } catch (error) {
      console.error('Error submitting trade proposal:', error);
    }
  };

  const handleEndTurn = async () => {
    try {
      await axios.post(`${API_URL}/api/games/${gameId}/end-turn`);
      socket.emit('gameUpdate', { gameId, type: 'turn_end' });
    } catch (error) {
      console.error('Error ending turn:', error);
    }
  };

  if (loading || !game) {
    return (
      <View style={styles.container}>
        <Text>Loading game...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Title>{game.name}</Title>
        <Paragraph>Turn {game.currentTurn} of {game.maxTurns}</Paragraph>
        <ProgressBar
          progress={game.currentTurn / game.maxTurns}
          color="#2196F3"
          style={styles.progressBar}
        />
      </View>

      <Card style={styles.card}>
        <Card.Content>
          <Title>Your Nation</Title>
          <Paragraph>GDP: ${game.players[0].nationId.gdp.toLocaleString()}</Paragraph>
          <Paragraph>Trade Balance: ${game.players[0].nationId.tradeBalance.balance.toLocaleString()}</Paragraph>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title>Economic Indicators</Title>
          <LineChart
            data={{
              labels: ['Q1', 'Q2', 'Q3', 'Q4'],
              datasets: [{
                data: [100, 120, 115, 130]
              }]
            }}
            width={Dimensions.get('window').width - 40}
            height={220}
            chartConfig={{
              backgroundColor: '#ffffff',
              backgroundGradientFrom: '#ffffff',
              backgroundGradientTo: '#ffffff',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(33, 150, 243, ${opacity})`,
              style: {
                borderRadius: 16
              }
            }}
            bezier
            style={styles.chart}
          />
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title>Trade Proposals</Title>
          {tradeProposals.length === 0 ? (
            <Text>No active trade proposals</Text>
          ) : (
            tradeProposals.map((proposal, index) => (
              <View key={index} style={styles.proposal}>
                <Paragraph>From: {proposal.fromNation}</Paragraph>
                <Paragraph>Resources: {proposal.resources.join(', ')}</Paragraph>
                <View style={styles.proposalActions}>
                  <Button mode="contained" onPress={() => handleTradeProposal({ ...proposal, accept: true })}>
                    Accept
                  </Button>
                  <Button mode="outlined" onPress={() => handleTradeProposal({ ...proposal, accept: false })}>
                    Reject
                  </Button>
                </View>
                <Divider style={styles.divider} />
              </View>
            ))
          )}
        </Card.Content>
      </Card>

      <Button
        mode="contained"
        onPress={handleEndTurn}
        style={styles.endTurnButton}
      >
        End Turn
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
  },
  progressBar: {
    marginTop: 10,
  },
  card: {
    margin: 10,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  proposal: {
    marginVertical: 10,
  },
  proposalActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  divider: {
    marginVertical: 10,
  },
  endTurnButton: {
    margin: 20,
  },
});

export default GameScreen; 