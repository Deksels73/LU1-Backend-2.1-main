# Vrij Lezen op Maat API

Backend voor een leesadviessysteem. Leerlingen kunnen een leesprofiel opslaan en boekadvies bekijken; docenten kunnen gekoppelde leerlingen volgen. De API is gebouwd met Fastify en TypeScript.

## Vereisten

- Node.js 20 of hoger en npm
- Een bereikbare MongoDB-database
- Een PostgreSQL-database voor de Drizzle-schema's en migraties

## Lokaal opzetten

Clone de repository, open de projectmap en installeer de dependencies:

```bash
npm install
```

Maak in de projectroot een `.env`-bestand aan. Vul de connection strings en geheimen in voor jouw lokale databases:

```env
DATABASE_URL=postgresql://gebruikersnaam:wachtwoord@localhost:5432/lu1_database
MONGODB_URI=mongodb://localhost:27017
JWT_SECRET=vul_hier_een_lange_willekeurige_geheime_waarde_in
SESSION_KEY=0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef
```

`SESSION_KEY` wordt als hex gedecodeerd en moet 32 bytes opleveren (64 hexadecimale tekens). Gebruik voor een echte omgeving een willekeurig gegenereerde sleutel; commit secrets nooit naar Git. De catalogusroute leest boeken uit MongoDB-database `LU1_Database`, collectie `catalogus`. Zorg dat deze collectie beschikbaar is en gevuld is wanneer je de catalogus of boekadviezen wilt testen.

Compileer TypeScript en start daarna de server:

```bash
npm run build
npm start
```

`npm start` voert eerst de tests uit en start daarna `index.js`. De server luistert op <http://localhost:8080>. De Swagger UI is beschikbaar op <http://localhost:8080/docs>.

## Codebase

```text
auth/             JWT-strategie en authenticatieguards
drizzle/          gegenereerde PostgreSQL-migraties
repositories/     databasequeries en schema-definities
routes/           Fastify-routes: HTTP-invoer, validatie en responses
service/          applicatielogica en use-cases
tests/            Vitest unit- en end-to-endtests
config.ts         leest en controleert omgevingsvariabelen
index.ts          start Fastify, plugins, Swagger en routes
openapi.yaml      API-contract en endpointdocumentatie
drizzle.config.ts Drizzle Kit-configuratie
Eslint.config.ts ESLint-regels voor de codebase
vitest.config.ts  Vitest-configuratie
```

De TypeScript-bestanden (`.ts`) zijn de bronbestanden. `npm run build` genereert JavaScript- en typebestanden naast de bronbestanden; pas gegenereerde `.js`-bestanden niet handmatig aan.

### Waar maak ik een wijziging?

Voor een nieuwe of gewijzigde API-functie volg je meestal deze route:

1. Voeg de HTTP-route toe of wijzig deze in het passende bestand onder `routes/`. Routes verwerken requests en responses en gebruiken authenticatieguards waar nodig.
2. Plaats de bedrijfslogica in de bijbehorende service onder `service/`.
3. Voeg databasewerk toe aan de repository onder `repositories/`; houd databasequeries uit de route.
4. Voeg of wijzig een test in `tests/` en werk `openapi.yaml` bij als het API-contract verandert.
5. Controleer de wijziging met de commando's onder [Ontwikkelcommando's](#ontwikkelcommando's).

Voorbeeld: adviesgedrag staat in `service/advies.service.ts`; de route staat in `routes/advies.route.ts` en de gebruikte data-accesslaag in de repositories.

## Coding style

De codebase gebruikt ESLint als coding style- en kwaliteitscontrole. De regels staan in [Eslint.config.ts](Eslint.config.ts) en combineren de aanbevolen ESLint- en TypeScript-ESLint-regels. Ongebruikte variabelen zijn fouten; een `_`-prefix geeft aan dat een parameter bewust ongebruikt is. Expliciete `any`-types en non-null assertions zijn waarschuwingen; tests hebben hiervoor uitzonderingen omdat mocks dat soms nodig hebben. TypeScript gebruikt daarnaast `strict`-typecontrole in [tsconfig.json](tsconfig.json).

Voer `npm run lint` uit voor je wijziging afrondt. De huidige configuratie controleert regels, maar voert geen automatische formattering uit. `npm run lint:fix` past alleen ESLint-fixes toe die automatisch oplosbaar zijn.

## Ontwikkelcommando's

```bash
npm run build       # compileer TypeScript
npm test            # voer tests eenmalig uit
npm run test:watch  # voer tests uit tijdens ontwikkeling
npm run lint        # controleer ESLint-regels
npm run lint:fix    # pas automatische ESLint-fixes toe
npm run db:generate # genereer Drizzle-migraties
npm run db:migrate  # voer Drizzle-migraties uit
```

## Belangrijkste endpoints

### Auth

- `POST /register` — account aanmaken
- `POST /login` — inloggen en JWT ophalen
- `GET /me` — informatie over ingelogde gebruiker

### Leesprofiel

- `GET /leesprofiel`
- `POST /leesprofiel`
- `PUT /leesprofiel`

### Advies

- `GET /advies` — genereert een leesadvies op basis van het profiel

### Leeslijst

- `GET /leeslijst`
- `POST /leeslijst`
- `PUT /leeslijst`

### Koppeling

- endpoints voor koppeling van leerling en docent

### Catalogus

- `GET /catalog` — openbare catalogus met filtermogelijkheden

## Autenticatie

Na een succesvolle `POST /login` ontvang je een JWT. Gebruik deze in de header:

```http
Authorization: Bearer <token>
```

## Tests

De applicatie gebruikt Vitest. Testbestanden staan in de map `tests/`.

```bash
npm test
```

## Licentie

Project is gelicenseerd onder `ISC`.

## Opmerking

De volledige API-specificatie staat in [openapi.yaml](openapi.yaml). Als de backend lokaal draait, kun je deze ook visueel bekijken via Swagger UI op `/docs`.
