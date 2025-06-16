const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Configurar alias
config.resolver.alias = {
  '@': './src',
};

module.exports = config;