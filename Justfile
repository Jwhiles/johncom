# Install dependencies
install:
    npm install

# Run migrations and collect static files
bootstrap:
  npm run setup
  npm run generateBackLinks
  npm run generatePublishedPages

# Run the development server
dev:
  npm run dev

# Build the production static files
build:
  npm run build

# Run tests
test:
  npm run test

# Run linting
lint:
  npm run lint


# Pull down the contents of the prod DB
dump_live_db:
    fly ssh sftp get /data/sqlite.db prisma/data.db

# Connect to the fly console
console:
    fly ssh console
