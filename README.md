# Pfotenpreis 🐾

Ein deutsches Preisvergleichsportal für **Tierbedarf** mit zwei Seiten: Ergebnisliste und Produktdetail. Symfony 7.4 / PHP 8.3 als API, React 19 mit React Router 7 als SPA, Doctrine ORM 3 und SQLite als persistenter Datenspeicher.

## Starten

Voraussetzungen: Docker Engine und Docker Compose v2 oder neuer.

```sh
docker compose up --build -d
```

Öffne **http://localhost:8080**. Der Backend-Container legt beim ersten Start acht Produkte mit jeweils drei Angeboten an. Die SQLite-Datenbank liegt im benannten Volume `catalog`; Neustarts behalten die Daten. Die Initialisierung überschreibt keine vorhandenen Produkte. Nginx liefert die SPA aus und leitet `/api/` an Symfony weiter. Der Backend-Port ist nicht extern veröffentlicht.

```sh
docker compose down       # Container stoppen, Daten behalten
# Nur zum bewussten Zurücksetzen der lokalen Demo:
docker compose down -v
```

## Funktionen

- Suche nach Produkt oder Marke, Filter für Tierart und Kategorie, drei Sortierungen.
- Suchzustand in URL-Parametern, direkt verlinkbare Detailseiten, Zurück-Link mit Filtererhalt.
- Detailseite mit Produktmerkmalen und Händlervergleich nach **Gesamtpreis inklusive Versand**.
- Ergebnisliste nennt den niedrigsten **Produktpreis exklusive Versand**, entsprechend beschriftet.
- Responsive Darstellung, Lade-, Fehler- und Leerzustände, erneutes Laden bei Fehlern.
- Alle Produkte, Preise und Händler sind **synthetische Demodaten**, keine Live-Angebote. Angebotsbuttons zeigen einen Hinweis; es gibt keinen Kaufprozess.

## Geschichtete Architektur

```text
backend/src/
  Presentation/  Symfony HTTP-Controller und CLI-Einstieg
  Logic/         Catalog: Such- und Sortier-Anwendungsfälle
  Domain/        Frameworkfreies Produkt und Repository-Port
  Data/          Doctrine-Adapter, Mapping, SQLite, Demo-Initialisierung
frontend/src/
  presentation/  React-Seiten, Layout und CSS
  logic/         Asynchroner Catalog-Hook, Abbruch veralteter Requests
  domain/        Produkt-/Angebotstypen und EUR-Formatierung
  data/          HTTP-Adapter
```

HTTP-Präsentation → Logic → Domain-Port ← Data-Adapter. Symfony verdrahtet die Abhängigkeiten in `config/services.yaml`. Die Domain importiert weder Symfony noch Doctrine. Das ORM-Mapping bleibt in einem eigenen Persistenzmodell, das in Domain-Produkte übersetzt wird. Auch der CLI-Bootstrap verwendet einen Logic-Anwendungsfall und einen Domain-Port für die Initialisierung. Im Frontend verwendet die Darstellung die Logic-Schicht, diese den HTTP-Adapter und alle verwenden die Domain-Typen.

Für den kleinen Demo-Katalog wird das vollständige Sortiment geladen und im Anwendungsfall gefiltert. Produktattribute einschließlich Angeboten sind als JSON in einer Doctrine-Entity gespeichert; es werden keine externen APIs verwendet. Preise sind ganzzahlige EUR-Cents. Bei einem großen Katalog wären paginierte Repository-Abfragen und separate Angebotsentitäten der nächste Schritt.

## API

- `GET /api/products?q=josera&animal=Hund&category=Trockenfutter&sort=price-asc`
- `GET /api/products/1` (404 bei unbekannter ID)
- `GET /api/health` (inklusive Datenbankzugriff)

Sortierung: `price-asc`, `price-desc`, `name`; ungültige Sortierungen oder Array-Parameter liefern 400. Die API ist für einen öffentlichen, lesenden Demo-Katalog vorgesehen.

## Prüfen

```sh
docker compose exec backend vendor/bin/phpunit --bootstrap vendor/autoload.php tests
docker compose exec backend sh -c 'find src config public tests -name "*.php" -exec php -l {} \;'
# Node.js 24+ für den HTTP-Smoke-Test:
node tests/smoke.mjs
# Frontend lokal prüfen:
cd frontend
npm ci
npm run build
```

Abhängigkeiten werden über `composer.lock` und `package-lock.json` fixiert. Der Container enthält PHPUnit für die lokalen Tests. Der PHP-Entwicklungsserver ist für die lauffähige Demo gedacht; für öffentlichen Produktivbetrieb sollte PHP-FPM oder ein vergleichbarer Application Server eingesetzt werden.

Optional für Entwicklungsarbeit: PHP 8.3 mit PDO SQLite, mbstring, XML/DOM und Composer 2; `composer install` im Backend. `APP_SECRET=local-demo php bin/console app:initialize` und anschließend `APP_SECRET=local-demo php -S 0.0.0.0:8000 -t public public/index.php`. Im Frontend `npm ci && npm run dev`; Vite proxyt `/api` auf Port 8000.

Die Schriftarten werden von Google Fonts geladen, das Hero-Foto von Unsplash. Produktillustrationen sind lokal mit CSS umgesetzt. Bei blockierten Bild-/Fontdiensten bleiben die Funktionen verfügbar. Es gibt keine Tracking- oder Analytics-Integration.

### Umgebungen mit eigener Zertifizierungsstelle

Der Backend-Build unterstützt optional das BuildKit-Secret `composer_ca` für Composer. Beispiel: `docker build --secret id=composer_ca,src=/pfad/ca-bundle.crt -t coderabbittesting-backend backend`. Das Zertifikatsbundle wird nicht im Image gespeichert; TLS-Prüfung bleibt aktiv. Der normale Compose-Build benötigt dieses Secret nicht.
