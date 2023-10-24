## Start Project

### nest.js global installieren
```bash
$ npm i -g @nest/cli
```
### Projekt Gerüst erstellen
```bash
$ nest new <project-name>
```

## Zentrales Modul app.module.ts

> Dieses Modul wird in main.ts importiert und  
> beinhaltet alle für die Anwendung verwendeten  
> anderen Module, Controller und Services.  
> Diese sind im @Module Decorator definiert.  

## Controller und Service

> Im Controller werden die Endpoints definiert. Mittels Dependency Injection  
> werden die Methoden aus den Service Klassen genutzt.  
> In den Service Klassen befinden sich die Methoden für die Business Logic.  
 
## Modul, Service und Controller generieren
```bash
$ nest g module modulename          # erstellt Ordner und .module.ts
$ nest g controller controllername  # erstellt nur .controller.ts
$ nest g service servicename        # bzw .service.ts
```

## Dependency Injection

Services haben einen `@Injectable({})` Decorator. Dadurch können sie  
im constructor des Controllers einfach instanziiert werden und sind  
in der Controller Klasse nutzbar.  

```js
@Controller
export class AuthController {
  constructor(private authService: AuthService) {
    this.authService.doSomething();
  }
}
```

## Export und Import von Modulen
> Wenn ein Service eines Moduls injizierbar sein soll, muss dieser  
> im @Module decorator exportiert werden
```js
@Module({
  imports: [SomeOtherModule],
  providers: [ThisModuleService],
  exports: [ThisModuleService]
})
export class ThisModule {
  // ...
}
```
> Um ein Modul Global verfügbar zu machen nutzt man den  
> @Global() decorator.    
> Dafür muss das jeweilige Modul auch im zentralen AppModule  
> importiert sein.  

## Docker

Eine Möglichkeit eine Docker-Datenbank zu erstellen ist die  
Verwendung eines `docker-compose.yml` Files.  

```yml
# docker-compose.yml
version: '3.8'
services:
  jampa-db:
    image: postgres:13
    ports:
      - 5434:5432
    environment:
      POSTGRES_USER: username
      POSTGRES_PASSWORD: geheim
      POSTGRES_DB: dbname
```
Der Container kann jetzt gestartet werden  
```bash
$ docker compose up jampa-db
```

## Prisma ORM (object-relational mapping)

> ORM übernimmt alle Aufgaben in Zusammenhang mit der Datenbank:  
> Schema (Entities), Datenbankabfragen  

Zwei Pakete müssen installiert werden.

```bash
$ pnpm i -D prisma  # -D oder --save-dev 
$ pnpm i @prisma/client
```
```bash
$ npx prisma init
```
Prisma init erstellt einen prisma Ordner der ein  
`schema.prisma` File enthält.  
Hier werden die Models erstellt.  

Ausserdem ein  
`.env` File, in dem die Zugangsdaten für die Datenbank  
hinterlegt werden.  

> zuerst Models erstellen und dann db Connection in .env  

### prisma commandos (Konsole)

- `npx prisma init` 
  - erstellt `.env` und Ordner prisma
- `npx prisma migrate dev` 
  - migriert die Models in die Datenbank
  - erstell migrations Ordner mit `migration.sql` file
- `npx prisma generate` erstellt einen type für jedes Model
  - jetzt kann dieser Typ im z.B. auth.service importiert werden
- `npx prisma studio` öffnet Browser Tool


## DTO (Data Transfer Object)

> DTOs sind Files bzw Klassen, die zur Eingabeüberprüfung dienen.    
> Darin kommen neben den Typendeklarationen auch Pipes zur Anwendung,  
> um die erhaltenen Daten auf bestimmte Kriterien hin zu überprüfen.  
> Daher kann es sinvoll sein, für ähnliche Aufgaben verschiedene DTOs  
> anzulegen z.B ein **CreateDto** wo alle Felder required sind neben  
> einem **UpdateDto** mit optionalen Feldern.  

Pipes werden in main.ts global eingebunden:
```js
app.useGlobalPipes(new ValidationPipe());
```

## Pipes (transformation und validation)

```bash
$ pnpm i class-validator class-transformer
```
