import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, Title, Paragraph, Button, Text, Slider, List, Switch, Divider } from 'react-native-paper';
import axios from 'axios';
import { API_URL, RESOURCE_TYPES, TRADE_POLICY_TYPES } from '../config';

const NationScreen = ({ route, navigation }) => {
  const { nationId } = route.params;
  const [nation, setNation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tariffRate, setTariffRate] = useState(0);

  useEffect(() => {
    const fetchNation = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/nations/${nationId}`);
        setNation(response.data);
        setTariffRate(response.data.tradePolicies.tariffRate || 0);
      } catch (error) {
        console.error('Error fetching nation:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNation();
  }, [nationId]);

  const handleUpdateTradePolicy = async () => {
    try {
      await axios.put(`${API_URL}/api/nations/${nationId}/trade-policies`, {
        tariffRate,
      });
      // Show success message or update UI
    } catch (error) {
      console.error('Error updating trade policy:', error);
    }
  };

  const handleUpdateResource = async (resourceName, newQuantity) => {
    try {
      const updatedResources = nation.resources.map(resource =>
        resource.name === resourceName
          ? { ...resource, quantity: newQuantity }
          : resource
      );

      await axios.put(`${API_URL}/api/nations/${nationId}/resources`, {
        resources: updatedResources,
      });

      setNation(prev => ({
        ...prev,
        resources: updatedResources,
      }));
    } catch (error) {
      console.error('Error updating resource:', error);
    }
  };

  if (loading || !nation) {
    return (
      <View style={styles.container}>
        <Text>Loading nation data...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title>{nation.name}</Title>
          <Paragraph>GDP: ${nation.gdp.toLocaleString()}</Paragraph>
          <Paragraph>Population: {nation.population.toLocaleString()}</Paragraph>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title>Trade Policies</Title>
          <Paragraph>Current Tariff Rate: {tariffRate}%</Paragraph>
          <Slider
            value={tariffRate}
            onValueChange={setTariffRate}
            minimumValue={0}
            maximumValue={100}
            step={1}
            style={styles.slider}
          />
          <Button
            mode="contained"
            onPress={handleUpdateTradePolicy}
            style={styles.button}
          >
            Update Trade Policy
          </Button>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title>Resources</Title>
          {nation.resources.map((resource, index) => (
            <View key={index}>
              <List.Item
                title={resource.name}
                description={`Quantity: ${resource.quantity.toLocaleString()}`}
                right={() => (
                  <View style={styles.resourceControls}>
                    <Button
                      mode="outlined"
                      onPress={() => handleUpdateResource(resource.name, resource.quantity - 1)}
                    >
                      -
                    </Button>
                    <Button
                      mode="outlined"
                      onPress={() => handleUpdateResource(resource.name, resource.quantity + 1)}
                    >
                      +
                    </Button>
                  </View>
                )}
              />
              <Divider />
            </View>
          ))}
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title>Trade Balance</Title>
          <Paragraph>Exports: ${nation.tradeBalance.exports.toLocaleString()}</Paragraph>
          <Paragraph>Imports: ${nation.tradeBalance.imports.toLocaleString()}</Paragraph>
          <Paragraph
            style={[
              styles.balance,
              { color: nation.tradeBalance.balance >= 0 ? 'green' : 'red' }
            ]}
          >
            Balance: ${nation.tradeBalance.balance.toLocaleString()}
          </Paragraph>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title>Diplomatic Relations</Title>
          {nation.diplomaticRelations.map((relation, index) => (
            <List.Item
              key={index}
              title={relation.nation}
              description={`Relation Score: ${relation.relationScore}`}
              right={() => (
                <View style={styles.relationIndicator}>
                  <View
                    style={[
                      styles.relationBar,
                      {
                        width: Math.abs(relation.relationScore) * 2,
                        backgroundColor: relation.relationScore >= 0 ? 'green' : 'red'
                      }
                    ]}
                  />
                </View>
              )}
            />
          ))}
        </Card.Content>
      </Card>
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
  slider: {
    marginVertical: 20,
  },
  button: {
    marginTop: 10,
  },
  resourceControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  balance: {
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 10,
  },
  relationIndicator: {
    width: 100,
    height: 4,
    backgroundColor: '#ddd',
    borderRadius: 2,
    overflow: 'hidden',
  },
  relationBar: {
    height: '100%',
  },
});

export default NationScreen; 