import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, Title, Paragraph, Button, Text, TextInput, List, Checkbox, Divider } from 'react-native-paper';
import axios from 'axios';
import { API_URL, RESOURCE_TYPES } from '../config';

const TradeScreen = ({ route, navigation }) => {
  const { gameId, targetNationId } = route.params;
  const [targetNation, setTargetNation] = useState(null);
  const [selectedResources, setSelectedResources] = useState([]);
  const [terms, setTerms] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTargetNation = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/nations/${targetNationId}`);
        setTargetNation(response.data);
      } catch (error) {
        console.error('Error fetching target nation:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTargetNation();
  }, [targetNationId]);

  const handleResourceSelection = (resource) => {
    setSelectedResources(prev =>
      prev.includes(resource)
        ? prev.filter(r => r !== resource)
        : [...prev, resource]
    );
  };

  const handleSubmitProposal = async () => {
    if (selectedResources.length === 0) {
      alert('Please select at least one resource');
      return;
    }

    try {
      await axios.post(`${API_URL}/api/games/${gameId}/trade`, {
        fromNation: 'current-nation-id', // Replace with actual nation ID
        toNation: targetNationId,
        resources: selectedResources,
        terms,
      });

      navigation.goBack();
    } catch (error) {
      console.error('Error submitting trade proposal:', error);
      alert('Failed to submit trade proposal');
    }
  };

  if (loading || !targetNation) {
    return (
      <View style={styles.container}>
        <Text>Loading trade data...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title>Trade with {targetNation.name}</Title>
          <Paragraph>GDP: ${targetNation.gdp.toLocaleString()}</Paragraph>
          <Paragraph>Trade Balance: ${targetNation.tradeBalance.balance.toLocaleString()}</Paragraph>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title>Available Resources</Title>
          {RESOURCE_TYPES.map((resource, index) => (
            <View key={index}>
              <List.Item
                title={resource}
                right={() => (
                  <Checkbox
                    status={selectedResources.includes(resource) ? 'checked' : 'unchecked'}
                    onPress={() => handleResourceSelection(resource)}
                  />
                )}
              />
              <Divider />
            </View>
          ))}
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title>Trade Terms</Title>
          <TextInput
            label="Additional Terms"
            value={terms}
            onChangeText={setTerms}
            mode="outlined"
            multiline
            numberOfLines={4}
            style={styles.termsInput}
          />
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title>Proposal Summary</Title>
          <Paragraph>Selected Resources:</Paragraph>
          {selectedResources.map((resource, index) => (
            <Text key={index}>- {resource}</Text>
          ))}
          {terms ? (
            <>
              <Paragraph style={styles.summaryLabel}>Additional Terms:</Paragraph>
              <Text>{terms}</Text>
            </>
          ) : null}
        </Card.Content>
      </Card>

      <Button
        mode="contained"
        onPress={handleSubmitProposal}
        style={styles.submitButton}
      >
        Submit Trade Proposal
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  card: {
    margin: 10,
  },
  termsInput: {
    marginTop: 10,
  },
  summaryLabel: {
    marginTop: 10,
  },
  submitButton: {
    margin: 20,
  },
});

export default TradeScreen; 