### Install dependencies
In `./back/`:
```bash
npm install
```

### Add .env file from MyGES
Download .env file from MyGES and save it in `./back/`

### Start the database
In the root folder:
```bash
docker compose up -d
```

### Running the application
In `./back/`:
Development mode:
```bash
npm run dev
```
Production mode:
```bash
npm run build
npm run start
```

### Running tests
In `./back/`:
```bash
npm test
```

### Running tests with coverage
In `./back/`:
```bash
npm run coverage
```

### End-to-end test (BONUS 2)
The end-to-end test is available at `bonus-2` branch of this repo. Please mind its README file