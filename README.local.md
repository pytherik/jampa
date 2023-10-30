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
Diese ist ein **provider** und deswegen @Injectable.  

Diese Strategie hat per default die Kennung 'jwt'; diese kann beliebig    
geändert werden, bzw die jetztige Nennung kann weggelassen werden.  
Über diese Kennung haben die **Guards** Zugriff auf die Strategy.   

[siehe auch nestjs Dokumentation](https://docs.nestjs.com/recipes/passport#implementing-passport-jwt)
```js
// auth/strategy/jwt.strategy.ts  
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get('JWT_SECRET'),
    });
  }
  async validate(payload: { sub: number; email: string }) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: payload.sub,
      },
    });
    delete user.hash;
    return user;
  }
}
```
hat hier einen eigenen Ordner bekommen, um deutlich zu machen, dass  
hier spezielle Aufgaben erfüllt werden. D.h. grundsätzlich könnte  
die Strategy auch im `auth` Ordner stehen.  
Die validate Methode fügt dem Request die `payload` hinzu, welche aus  
den im Token verschlüsselten Informationen über den User besteht:  
`payload: { sub: 1, email: 'me@here.de', iat: 1698318282, exp: 1698318462 }`  

außerdem werden mithilfe dieser Informationen die Userdaten aus der  
Datenbank geholt und, vom hash befreit, zurückgegeben.     
## Guards

Guards werden über den zu schützenden Routen in den Controllern angefügt.  
```js
// user/user.controller.ts
import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@Controller('users')
export class UserController {
  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  getMe(@Req() req: Request) { // kommt von express
    return req.user;
  }
```
hier wird die Route `/users/me` durch den `AuthGuard` geschützt,  
der der Strategy `'jwt` folgt.  

Um Probleme mit dem hardcoded string 'jwt' zu vermeiden kann diese  
Information in eine Guard Klasse ausgelagert werden:  
```js
// auth/guard/jwt.guard.ts
import { AuthGuard } from '@nestjs/passport';

export class JwtGuard extends AuthGuard('jwt') {
  constructor() {
    super();
  }
}
```
Die entsprechde Zeile im UserController sieht dann so aus:

```js
export class UserController {
  @UseGuards(JwtGuard)
  @Get('me')
```

## Custom Decorator
[Custom route decorators](https://docs.nestjs.com/custom-decorators)

Um nicht direkt auf `express` Funktionalität zurückgreifen zu müssen  
kann man einen eigenen Decorator anlegen, der diesen Job erledigt.  
```js
// auth/decorator/get-user.decorator.ts
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request: Express.Request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
```
hier wird für data kein Inhalt übermittelt, aber man kann hier noch  
spezifizieren... [siehe YT](https://youtu.be/GHTA143_b-s?t=8256)
## getMe - endgültige Version

```js
import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/guard';
import { GetUser } from '../auth/decorator';
import { User } from '@prisma/client';

@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
  @Get('me')
  getMe(@GetUser() user: User) {
    return user;
  }
}
```
# e2e Testing

> End-to-End-Tests testen das gesamte Softwareprodukt von Anfang  
> bis Ende. Es stellt sicher, dass alle Teile wie erwartet  
> zusammenarbeiten.  

Im Ordner `src/test` werden die End-toEnd-Tests geschrieben.  
Nestjs benutzt üblicherweise `supertest`.  
Hier wird jetzt mit `pactum` gearbeitet:  
```bash
$ pnpm i -D pactum
```
In nestjs werden Module kompiliert, das heisst um ein Modul zu testen  
importiert man es in die Testumgebung und kompiliert es dort.  
In diesem Fall wird das `AppModule` importiert, welches seinerseits  
das gesamte `backend` enthält. Das heisst, so können alle Requests genau  
wie aus Insomnia intern mit `pactum` gestellt und ausgewertet werden.  
Das Testing Framework ist `jest`,  dessen Syntax im weiteren Verlauf  
verwendet wird.  

```js
// app.e2e-spec.ts
import { Test } from '@nestjs/testing';
import { AppModule } from '..src/app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as pactum from 'pactum';
import { PrismaService } from '../src/prisma/prisma.service';

describe('App e2e', () => {
  let app: INestApplication;
  beforeAll(async() => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile;
    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );
    await app.init();
    await app.listen(3333);
    pactum.request.setBaseUrl('http://localhost:3333');
    
    prisma = app.get(PrismaService);
    await prisma.cleanDb();
  });
  afterAll(() => {
    app.close();
  })
  
  it.todo('should pass', () => {
    return 'hier wird die Testlogik ausgeführt'
  });
})
```
Dieser Test beinhaltet noch keine Testlogik; diese wird als Callback Funktion  
dem `it` Teil hinzugefügt.  
Über die Abstraktion zur `INestApplication` können der `app` nun die  
benötigten `ValidationPipes` zugewiesen werden.  
Das alles findet im `beforeAll` Teil - der starting logic des Testings statt.  
Darauf folgen alle Tests und danach kommt im `afterAll` Teil die tear-down logic.  


### Starten von e2e Tests
Ein Script im `package.json` startet den Test:
```bash
$ pnpm test:e2e
```
```js
...
"test:e2e": "jest --config ./test/jest-e2e.json",
...
```
dieses Script kann so erweitert werden, dass nach Veränderungen in der `app.e2e-spec.ts`  
automatisch neu getestet wird:
```js
...
"test:e2e": "jest --watch --no-cache --config ./test/jest-e2e.json",
...
```

## Test Datenbank

Eine Test Datenbank wird erstellt, indem im `docker-compose.yaml` einfach  
die bestehende DB kopiert, umbenannt und einem anderen Port zugewiesen  
wird.  
Prisma müssen die `.env` Umgebungsvariablen für die Testumgebung mitgeteilt  
werden. Dazu braucht es eine `.env.test` Datei.  
Das reicht aber nicht aus, Prisma greift nicht automatisch darauf zurück,  
wenn die Tests laufen sondern benutzt immer das `.env` File.  

```bash
$ pnpm i -D dotenv-cli
```
Die Scripte in package.json werden so angepasst:  
```json
...
// development
"prisma:dev:deploy": "prisma migrate deploy",
"db:dev:rm": "docker compose rm jampa-db -s -f -v",
"db:dev:up": "docker compose up jampa-db -d",
"db:dev:restart": "pnpm db:dev:rm && pnpm db:dev:up && sleep 1 && pnpm prisma:dev:deploy",
// testing
"prisma:test:deploy": "dotenv -e .env.test -- prisma migrate deploy",
"db:test:rm": "docker compose rm test-db -s -f -v",
"db:test:up": "docker compose up test-db -d",
"db:test:restart": "pnpm db:test:rm && pnpm db:test:up && sleep 1 && pnpm prisma:test:deploy",
...
"test:e2e": "dotenv -e .env.test -- jest --watch --no-cache --config ./test/jest-e2e.json"
...
```

Genauso kann nun auch Prisma Studio die Testdatenbank anzeigen:  
```bash
$ npx dotenv -e .env.test -- prisma studio
```
## PrismaService
Die Methode `prisma.clearDb()` aus dem `beforAll` Teil muss im PrismaService  
erstellt werden:
```js
...
  cleanDb() {
    return this.$transaction([
      this.bookmark.deleteMany(),
      this.user.deleteMany(),
    ])
  }
...
```
`$transaction` stellt sicher, dass die Befehle in der richtigen Reihenfolge  
abgearbeitet werden.  
