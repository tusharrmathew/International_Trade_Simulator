// Calculate the impact of tariffs on trade
const calculateTariffImpact = (basePrice, tariffRate) => {
  const tariffAmount = basePrice * (tariffRate / 100);
  return {
    finalPrice: basePrice + tariffAmount,
    tariffAmount,
    percentageIncrease: tariffRate
  };
};

// Calculate trade balance
const calculateTradeBalance = (exports, imports) => {
  const balance = exports - imports;
  return {
    balance,
    isSurplus: balance > 0,
    percentageOfGDP: (balance / (exports + imports)) * 100
  };
};

// Simulate resource production and consumption
const simulateResourceProduction = (currentQuantity, productionRate, consumptionRate) => {
  const newQuantity = currentQuantity + productionRate - consumptionRate;
  return {
    newQuantity,
    netChange: productionRate - consumptionRate,
    isDeficit: newQuantity < 0
  };
};

// Calculate GDP growth based on trade and policies
const calculateGDPGrowth = (currentGDP, tradeBalance, policyImpact) => {
  const tradeImpact = tradeBalance * 0.1; // 10% of trade balance affects GDP
  const policyMultiplier = 1 + (policyImpact / 100);
  const newGDP = currentGDP * (1 + (tradeImpact / currentGDP)) * policyMultiplier;
  
  return {
    newGDP,
    growthRate: ((newGDP - currentGDP) / currentGDP) * 100,
    tradeContribution: tradeImpact,
    policyContribution: policyImpact
  };
};

// Simulate currency exchange rate changes
const simulateExchangeRate = (currentRate, tradeBalance, interestRate) => {
  const tradeImpact = tradeBalance * 0.0001; // Small impact from trade balance
  const interestImpact = (interestRate - 2) * 0.01; // Base rate of 2%
  const newRate = currentRate * (1 + tradeImpact + interestImpact);
  
  return {
    newRate,
    changePercentage: ((newRate - currentRate) / currentRate) * 100,
    factors: {
      tradeImpact,
      interestImpact
    }
  };
};

// Calculate diplomatic relations impact
const calculateDiplomaticImpact = (currentRelations, tradeActions, policyChanges) => {
  const tradeImpact = tradeActions.reduce((sum, action) => sum + action.impact, 0);
  const policyImpact = policyChanges.reduce((sum, change) => sum + change.impact, 0);
  const newRelations = currentRelations + tradeImpact + policyImpact;
  
  return {
    newRelations,
    change: newRelations - currentRelations,
    factors: {
      tradeImpact,
      policyImpact
    }
  };
};

// Simulate trade negotiation outcome
const simulateTradeNegotiation = (proposal, relations, economicPower) => {
  const relationBonus = relations * 0.1;
  const powerBonus = economicPower * 0.05;
  const baseSuccess = 0.5;
  
  const successProbability = baseSuccess + relationBonus + powerBonus;
  const isSuccessful = Math.random() < successProbability;
  
  return {
    isSuccessful,
    successProbability,
    factors: {
      relationBonus,
      powerBonus
    }
  };
};

module.exports = {
  calculateTariffImpact,
  calculateTradeBalance,
  simulateResourceProduction,
  calculateGDPGrowth,
  simulateExchangeRate,
  calculateDiplomaticImpact,
  simulateTradeNegotiation
}; 