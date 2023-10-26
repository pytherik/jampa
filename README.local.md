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

Eine Möglichkeit eine [Docker-Datenbank](https://docs.docker.com/compose/) zu erstellen ist die  
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

## [Prisma](https://www.prisma.io/docs/concepts) ORM (Object Relational Mapping)

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
[Tutorial](https://dev.to/davidekete/understanding-data-transfer-objects-dto-and-data-validation-in-typescript-nestjs-1j2b)
### definieren den Inhalt und die Form von Request und Response Objekten  
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
Um die `ValidationPipe` global zur Überprüfung des Datentransfers  
zu nutzen wird sie in `main.ts` eingebunden:
```js
// main.ts
async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  await app.listen(3000);
}
bootstrap();
```
[Dokumentation und Optionsliste](https://docs.nestjs.com/techniques/validation#overview)

```bash
$ pnpm i class-validator class-transformer
```
[class-validator Liste der Validation-Queries](https://www.npmjs.com/package/class-validator)


## ConfigModule

Einbinden des Moduls
```bash
$ pnpm i @nestjs/config
```

Im zentralen App Modul:

```js
// app.module.ts
...
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
...
```
Das Setzen der Option `isGlobal: true` kann jetzt von überall  
auf die in `.env` (muss im project root Verzeichnis liegen)  
definierten Variablen zugegriffen werden. In den Optionen  
kann auch ein anderer Speicherort der `.env` Datei angegeben werden.  

```js
// Beispiel für config.get('VARIABLE_AUS_DOTENV')
...
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor(config: ConfigService) {
    super({
      datasources: {
        db: {
          url: config.get('DATABASE_URL'),
        },
...
```
Im Hintergrund arbeiten `ConfigModule` und `ConfigService`  
mit [dotenv (Video)](https://www.youtube.com/watch?v=zwcvXd3kGbw).

## Authentication

[Passport Strategies](https://www.passportjs.org/packages/)  
[JWT (Video)](https://www.youtube.com/watch?v=uAKzFhE3rxU)  
[JWT Doku, Debugger](https://jwt.io/)  

```bash
$ pnpm i @nestjs/passport passport @nestjs/jwt passport-jwt
```
## JWT (Json Web Token)

Das Jwt Module wird im Auth Module importiert
```js
// auth.module.ts
...
@Module({
  imports: [JwtModule.register({})],
...
```
Die Werte für Secret, Expiring usw. können hier als Optionen der  
`.register` Methode angegeben werden.  
Der JwtService kann aber auch in anderen Services wie dem AuthService  
importiert werden, um dort die Optionen zu setzen
```js
// auth.service.ts
...
@Injectable({})
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private jwt: JwtService,
  ) {}
...
```
zusätzlich muss im AppModule der JwtService bereitgestellt werden.  
```js
// app.module.ts
import { JwtService } from '@nestjs/jwt';
...
  controllers: [AppController, AuthController],
  providers: [AppService, AuthService, JwtService],
})
...
```
Im AuthService stellt nun eine Methode den Token für die Anmeldung  
und das Login bereit:
```js
  signToken(userId: number, email: string): Promise<string> {
    const payload = {
      sub: userId,
      email,
    };
    const secret = this.config.get('JWT_SECRET');
    console.log({ secret });
    return this.jwt.signAsync(payload, {
      expiresIn: '3m',
      secret: secret,
    });
  }
```
Dieser Token wird nun bei jedem Request im Header als  
Bearer-Token mitgegeben. Die Logik zum prüfen der Validität  
des Bearers nennt man **Strategy**

## Strategy

Das `@nestjs/passport` Modul beinhaltet die passport-jwt Strategy.  
In einer Konfigurationsklasse werden dieser alle nötigen Informationen  
zur Verfügung gestellt.  
Diese ist ein provider und deswegen @Injectable.  
[siehe auch nestjs Dokumentation](https://docs.nestjs.com/recipes/passport#implementing-passport-jwt)
```js
// auth/strategy/jwt.strategy.ts  
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get('JWT_SECRET'),
    });
  }
}
```
hat hier einen eigenen Ordner bekommen, um deutlich zu machen, dass  
hier spezielle Aufgaben erfüllt werden. D.h. grundsätzlich könnte  
die Strategy auch im `auth` Ordner stehen.  

