```bash
git clone https://github.com/javascript2001/unicorn.git
```

```bash
cd unicorn
```

```bash
npm i 
```
# Setup .env file

# Run docker container of PostgreSQL and valkey if you are not setup remote url in .env file
```bash
docker run -d --name unicorn -p 5432:5432 -e POSTGRES_USER=admin -e POSTGRES_PASSWORD=admin postgres
```
```bash
docker run -d --name unicorn-valkey -p 6379:6379
```
## setup .env variables according to your local environment or remote url




```bash
npx prism generate
```
```bash
npx prisma migrate dev
```

```bash
npm run dev
```

```bash
cd src/worker
```
```bash
node worker.js
```

