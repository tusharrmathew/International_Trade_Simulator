const mongoose = require('mongoose');

const ResourceSchema = new mongoose.Schema({
  name: String,
  quantity: Number,
  productionRate: Number,
  consumptionRate: Number
});

const TradePolicySchema = new mongoose.Schema({
  tariffRate: Number,
  embargoes: [String],
  freeTradeAgreements: [String]
});

const NationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  gdp: {
    type: Number,
    required: true
  },
  population: {
    type: Number,
    required: true
  },
  currency: {
    name: String,
    exchangeRate: Number
  },
  resources: [ResourceSchema],
  tradePolicies: TradePolicySchema,
  tradeBalance: {
    exports: Number,
    imports: Number,
    balance: Number
  },
  diplomaticRelations: [{
    nation: String,
    relationScore: Number
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Nation', NationSchema); 