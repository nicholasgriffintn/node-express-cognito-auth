require('dotenv').config();

const serverMap = {
    PORT: process.env.PORT || 3001,
    RAVEN_ID: process.env.RAVEN_ID,
    WHITELIST,
    AWS_COGNITO_REGION: process.env.AWS_COGNITO_REGION || 'eu-west-1',
    AWS_COGNITO_USER_POOL_ID: process.env.AWS_COGNITO_USER_POOL_ID || '',
    AWS_COGNITO_TOKEN_USE: process.env.AWS_COGNITO_TOKEN_USE || 'access',
    AWS_COGNITO_TOKEN_EXPRIATION: process.env.AWS_COGNITO_TOKEN_EXPRIATION || '3600000',
    AWS_COGNITO_CLIENT_ID: process.env.AWS_COGNITO_CLIENT_ID || '',
}

module.exports = serverMap;