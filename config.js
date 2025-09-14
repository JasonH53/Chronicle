// Configuration file for Willow
module.exports = {
  // Team Registration Credentials
  teamId: '9cf0f5bf-0cb5-42dc-bded-568322a95a89',
  jwtToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZWFtSWQiOiI5Y2YwZjViZi0wY2I1LTQyZGMtYmRlZC01NjgzMjJhOTVhODkiLCJ0ZWFtX25hbWUiOiJDaHJvbmljbGUtRGV2IiwiY29udGFjdF9lbWFpbCI6ImNwamFzb24xMjM0QGdtYWlsLmNvbSIsImV4cCI6MTc1ODY2MzAwNS4wMjczNDh9.Rx2nYReJIRy0ME8ZeydCjCjZ8B2EFp54dV5x3yRdCng',
  
  // API Configuration
  rbcApiBaseUrl: 'https://2dcq63co40.execute-api.us-east-1.amazonaws.com/dev',
  
  // Server Configuration
  port: process.env.PORT || 3001,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // Database Configuration (you'll need to set this up)
  databaseUrl: process.env.DATABASE_URL || 'postgresql://username:password@localhost:5432/goalify_invest'
};
