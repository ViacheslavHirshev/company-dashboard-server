Technologies used:
 - Express + typescript
 - prisma
 - passportjs + passport-local
 - dotenv
 - jsonwebtoken
 - multer
 - bcryptjs
 - swagger-jsdoc/swagger-ui-express

How to run:
 - Clone repository
 - run "npm i"
 - create postgresql database
 - add .env file
 - run commands:
   - npm run push-schema
   - npm run generate-client
   - npm run compile (compile before running server)
   - npm run server (for server start)

.env file example:
 - APP_PORT = "3000"
 - ACCESS_TOKEN_SECRET = "myAccessSecret"
 - REFRESH_TOKEN_SECRET = "myRefreshSecret"
 - DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"
