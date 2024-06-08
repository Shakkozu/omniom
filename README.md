![Logo](assets/logo_small.png)
# Omniom

[![Build and Test](https://github.com/Shakkozu/omniom/actions/workflows/cicd.yml/badge.svg)](https://github.com/Shakkozu/omniom/actions/workflows/cicd.yml)

System umożliwiający prowadzenie jadłospisu oraz monitorowania aktualnego stanu zdrowia (wagi, pomiarów), rozszerzony o funkcjonalność koordynowania współpracy pomiędzy dietetykami oraz użytkownikami aplikacji, którzy monitorują swoje posiłki i sylwetkę

- [Omniom](#omniom)
    - [Czego się nauczyłem](#czego-się-nauczyłem)
  - [Architektura ](#architektura)
    - [Architektura - Frontend](#architektura-frontend)
    - [Architektura - Backend](#architektura-backend)
        - [Struktura katalogów oraz przyjęte konwencje](#struktura-katalogów-oraz-przyjęte-konwencje)
        - [Testy w aplikacji](#testy-w-aplikacji)
    - [Podjęte decyzje wraz z argumentacją](#podjęte-decyzje-i-ich-argumentacja)
  - [Powód powstania](#powód-powstania)
  - [Główne założenia](#główne-założenia)
    - [Możliwości komercjalizacji projektu](#możliwości-komercjalizacji-projektu)
  - [Baza produktowa](#baza-produktowa)
  - [Założenia projektowe](#założenia-projektowe)
    - [MVP](#mvp)
    - [Architektura](#architektura)
      - [Diagram architektury C4](#diagram-architektury-c4)
        - [C2 - Container level](#c2---container-level)
        - [C3 - Component level](#c3---component-level)
    - [Lista funkcjonalności do zrealizowania w MVP](#lista-funkcjonalności-do-zrealizowania-w-mvp)

---

## Demo - link do filmu prezentującego funkcjonalności w aplikacji
[![Omniom - demo](https://img.youtube.com/vi/92kY-081AnM/maxresdefault.jpg)](https://www.youtube.com/watch?v=92kY-081AnM)

--- 

## Architektura

### Architektura Frontend

W projekcie zostały użyte:
- Angular
- ngxs jako state-manager
- material-angular

Podjąłem dezyję, aby komponenty o mało rozbudowanej warstwie prezentacji nie miały podziału na osobne pliki `.html`
Osobne pliki z szablonem są wyłącznie na widokach, w których utrzymywanie całości kodu w jednym pliku uznałem jako problematycze.
Takie rozwiązanie jest zgodnę z ideą vertical-slice, gdzie komponent jako dostarczający wartość biznesową realizuje wszystkie niezbędne warstwy.

Do zarządzania stanem wykorzystałem bilbiotekę `ngxs`, w większości to klasy zarządzające stanem zajmują się komunikacją z API Backendowym,
aby uprościć komponenty.

W projekcie wykorzystałem gotowy zestaw kontrolek - `material-angular`.
Do stylizacji użyta została biblioteka `tailwindcss`, która umożliwia generowanie styli do komponentów z użyciem gotowych, predefiniowanych
klas, zamiast duplikować powtarzalne w dedykowanych plikach .css

Jeżeli chodzi o hierarchię klas, projekt jest podzielony na moduły - ![fe_class_hierarchy](/docs/arch/fe/hierarchy.png)
- auth
- dish-configuration
- nutrition-diary
- nutritionist
- products
- nutritionist-collaboration
- user-profile

Każdy z modułów wykorzystuje własny stan, oraz serwis do komunikacji z backendem

### Czego się nauczyłem

- Do obróbki plików csv [csvkit](https://csvkit.readthedocs.io/en/latest/cli.html) jest świetnym narzędziem. Z pomocą CLI można bardzo szybko realizować dużo operacji związanych z konwersją, filtrowaniem i wiele wiele innych
- Używanie ngxs (lub innych rozwiązań do zarządzania stanem aplikacji FE) należy stosować pragmatycznie. W przypadku prostych komponentów nie obciążających łącza poprzez częste odpytywanie backendu nie ma wartości z ich wykorzystania a dodaje to dodatkowej złożoności
- Podejście vertical-slice świetnie umożlwia punktowe optymalizacje/poprawki/naprawy błędów. Jest to bardzo efektywne. Po pracy z takimi plikami zawierającymi całą funkcjonalność, praca w architekturze rozbitej na wiele modułów wydaje się jest o wiele trudniejsza :) 
- Podejście vertical-slice nie do końca łączy się z wzorcem hexagonal-architecture, przez co chociażby zastępowanie portu komunikującego się z bazą danych hashmapą w celu optymalizacji czasu wykonywania testów aplikacji jest nieintuicyjne.
- Poprawiłem umiejętności związane z UX, uważam, że GUI aplikacji jest dosyć intuicyjne i wygląda całkiem nieźle
- Przechowywanie snapshotów danych w postaci dokumentowej zajmuje sporo miejsca. W przypadku aplikacji dużych skali, optymalniej byłoby skorzystać z wersjonowania oraz przechowywania informacji o wersji, do której odwołuje się dana relacje
- Rozwój umiejętności TDD i BDD

---

### Architektura Backend

#### Struktura katalogów oraz przyjęte konwencje
Projekt wykorzystuje podejście vertical-slice. Dziękuję za artykuły repozytoria oraz wszelakiej maści materiały, którymi mogłem się inspirować w realizacji podejścia w ten sposób Oskarowi Dudycz. https://github.com/oskardudycz/

![backend_hierarchy](/docs/arch/be/hierarchy.png)
Solucja składa się z 4 projektów:
- Omniom.DatabaseMigrator - Projekt obsługuje migracje schematu baz postgres. Wykorzystałem bilbiotekę FluentMigrator do zarządzania uruchamianymi skryptami migracyjnymi.
- Omniom.WebAPI - Projekt odpowiedzialny za przygotowanie i uruchomienie aplikacji, wystawienie Web Api oraz inicjalizacja wszystkich zależności
- Omniom.Tests - Testy jednostkowe, integracyjne
- Omniom.Domain - Core projektu, logika biznesowa, komunikacja z bazą danych, realizacja oczekiwanych funkcjonalności.


Kod odpowiedzialny za realizację poszczególnych funkcjonalności w głównej mierze mieści się w pojedynczych plikach per funkcjonalność. ![hierarchia_modułu_katalogu](/docs/arch/be/catalogue-hierarchy.png)

W projekcie skorzystałem z wzorca CQS, aby rozróżnić operacje pobierające dane od operacji modyfikujących stan aplikacji.
Skorzystałem z interfejsów ICommand, IQuery do oznaczania komend i zapytań.

W przypadku potrzeby wykonania operacji transakcyjnie, wykorzystałem wzorzec dekorator (przykład dostępny w pliku `SaveMealNutritionEntriesCommand.cs`). Takie podejście umożliwia izolację logiki od operacji związanych z persystencją, oraz umożliwia rozbudowę interakcji z zystemem o dodatkowe zachowania w ramach potrzeb.

Do budowy Rest API skorzystałem z .NET Minimal API.
Takie rozwiązanie świetnie łączy się z ideą vertical-slice, gdzie w pojedynczym pliku można trzymać kod odpowiedzialny za kompleksową realizację funkcjonalności.

Pierwszy raz miałem okazję pracować w projekcie, gdzie kod odpowiedzialny za całą funkcjonalność jest przechowywane w jednym pliku. Praca w takiej konwencji ma wiele plusów, modyfikacja funkcjonalności sprowadza się do jednego miejsca, a co za tym idzie jest mniejsze ryzyko pominięcia części wymaganych zmian podczas rozwoju systemu.
![example_single_feature_file](/docs/arch/be/feature-file-example.png) 

#### Testy w aplikacji

Aplikacja w głównej mierze składa się z prostych CRUD'ów, które stanowią przelotkę do bazy danych. Wiele logiki w aplikacji to w głównej mierze logika walidacyjna.

W związku z tym, podjąłem decyzję, iż najbardziej odpowiednimi rodzajami testów będą testy na warstwie http.
Do utworzenia takich testów wykorzystałem `WebApplicationFactory`, inicjalizacja modułu jest tworzona raz w pliku `OmniomApp` a następnie wykorzystywana w plikach testów integracyjnych.


### Podjęte decyzje i ich argumentacja
- dane dotyczące produktów są trzymane w odrębnym kontenerze bazy postgres, wynika to z licencji na jakiej openfoodsapi udostępnia swoje produkty. W przypadku wdrożenia aplikacji, baza produktów powinna zostać udostępniona dalej wraz z produktami które zostały dodane w ramach aplikacji
- dane dotyczące produktów oraz posiłków są trzymane w postaci dokumentowej, wynika to z faktu iż odwołania do tych danych nie powinny być mutowalne. Zastosowałem takie podejście w ramach zabezpieczenia przed dodaniem funkcjonalności umożlwiających modyfikację bazy produktowej, co spowodowałoby modyfikację wpisów bazujących na danych z bazy produktowej (np modyfikacja historycznych wpisów w dzienniku żywieniowym). Alternatywnym rozwiązaniem byłoby wersjonowanie produktów i odwoływanie się do konkretnych wersji, aczkolwiek z racji że to MVP skorzystałem z prostszego rozwiązania

---

## Uruchomienie projektu 

Do uruchomienia projektu potrzebny jest zainstalowany silnik dockera.

Repozytorium należy skopiować za pomoca:
```
git clone https://github.com/Shakkozu/omniom.git
```

następnie przejść do katalogu głównego aplikacji `omniom` oraz uruchomić komendę

```
docker compose up --build
```


**Uruchomione zostaną 4 kontenery:**
- angular-app - Klient angularowy aplikacji
- omniom-api - .NET API obsługujące żądania aplikacji klienckiej
- products-catalogue-db - Kontener z bazą danych postgres zawierającą dane dot. produktów (został odseparowany, aby umożliwić łatwe udostępnienie bazy produktów dalej na podstawie licencji z OpenFoodsApi)
- omniom-db - Kontener postgres z główną bazą danych aplikacji


Aplikacja webowa jest udostępniona na porcie `10005`, a więc aplikacja jest dostępna pod adresem:
```
http://localhost:10005/
```


Aplikacja uruchomiona z poziomu dockera zawiera przygotowanych wcześniej na potrzeby prezentacji użytkowników z wypełnionymi danymi
Hasło dla wszystkich użytkowników jest jednakowe - `zaq1@WSX`
Poniżej emaile dla 
```
legolas.greenleaf@mirkwood.org - użytkownik
frodo.baggins@shire.com - dietetyk
admin@example.com - administrator
```

---

## Powód powstania
Do utworzenia tego projektu zainspirował mnie kalkulator kalorii [Fitatu](https://www.fitatu.com/).

Korzystam z niego na codzień i uważam że kierunek rozwoju w celu roszerzenia zestawu funkcjonalności o współpracę z dietetykami jest słuszny, w związku z tym chciałbym spróbować stworzyć taki system żeby rozwinąć swoje umiejetności 

## Główne założenia

Zestaw założeń, wedle których planuję zaprojektować system:
- baza produktowa powinna być zasilona na starcie systemu, żeby użytkownik po rejestracji mógł od razu korzystać z funkcjonalności kalkulatora kalorii
- rejestracja dietetyków w systemie jest koordynowana przez administratora manualnie
- dietetyk może skonfigurować swój zestaw posiłków/przepisów, aby budować jadłopisy dla swoich klientów
- system koordynuje współpracę dietetyka z klientem, udostępniając dietetykowi informacje na temat wagi, pomiarów oraz historii odżywiania klientów

### Możliwości komercjalizacji projektu
Zakładam że projekt w przypadku wdrożenia na rynek mógłby zarabiać na podstawie:
- pobierania prowizji od opłaty uiszczanej dietetykowi za nawiązanie współpracy przez użytkownika aplikacji
- możliwości wykupowania promowania ogłoszeń przez dietetyków korzystających z systemu

## Baza produktowa
Baza produktów zostanie zasilona z [openfoodfacts](https://pl.openfoodfacts.org/)
Na start aplikacji skupię się jedynie na produktach dostępnych w polskiej wersji serwisu openfoodfacts.

--- 
## Założenia projektowe
Projekt jest realizowany w ramach konkursu [100commitow](https://100commitow.pl/) i ma na celu wspomóc budowanie nawyku codziennego poprawiania warsztatu technicznego.

### MVP
Aby zaprezentować system w postaci poprawnej na czas zakonczenia konkursu, lista dostępnych funkcjonalności zostanie okrojona w idei tworzenia MVP. 

W związku z tym w początkowej fazie projektu pominięte zostaną:
- stworzenie oddzielnej aplikacji mobilnej do korzystania dla użytkowników,
- integracja z serwerem uwierzytelniania,
- integracja z bramką płatniczą

### Architektura

System będzie się opierał na aplikacji SPA (angular) oraz .NET CORE
Projekt będzie realizowany w oparciu o podejście `vertical-slice` oraz `CQRS` aby poprawić umiejętności w tym zakresie.
Takie podejście umożliwi izolację każdej ścieżki biznesowej i wprowadzania punktowych optymalizacji w ramach potrzeb

#### Diagram architektury C4

##### C2 - Container level
![Context level](assets/c2.png)

##### C3 - Component level
![Context level](docs/c3.jpg)


### Lista funkcjonalności do zrealizowania w MVP

- **Uwierzytelnianie**
    - [x] Rejestracja użytkowników
    - [x] Logowanie użytkowników
- **Katalog Produktów**
    -  [x] Zasilenie bazy produktowej importem
    -  [x] Wyświetlanie listy produktów
- **Katalog dań**
    -  [x] Wyświetlanie listy dań
    -  [x] dodawanie prywatnych przepisów dań (instrukcja przygotowania, lista składników, liczba porcji)
- **Profil Użytkownika**
    -  [x] Ustalanie dziennego zapotrzebowania kalorycznego, wraz z rozwarstwieniem na makroskładniki
    -  [x] Wyświetlanie podsumowania przyjętych kalorii oraz makroskładników w okresach dziennych
- **Jadłospis**
    - [x] Konfiguracjia liczby posiłków w ciągu dnia
    - [x] Dodawanie listy zjedzonych produktów do posiłku
    - [x] Dodawanie dań do posiłku
    - [x] Dostosowywanie gramatur zjedzonych produktów/dań
    - [x] Usuwanie dania/produktu z listy zjedzonych pproduktów
    - [x] Przeglądanie historycznych posiłków
- **Konfiguracja Profilu Dietetyka**
    - [x] Przegląd zarejestrowanych dań
    - [x] Konfiguracja jadłospisów na podstawie przygotowanych wcześniej dań
    - [ ] Przypisywanie jadłospisów do klientów
- **Nawiązywanie współprac**
    - [ ] Podejmowanie współprac pomiędzy dietetykiem a klientem

### Funkcjonalności do realizacji w kolejnych etapach projektu

- **Uwierzytelnianie**
    - Zmiana danych osobowych
    - Odzyskiwanie hasła
- **Katalog Produktów**
    - Dodawanie prywatnych produktów do bazy danych
- **Profil Użytkownika**
    - Aktualizacja danych dotyczących sylwetki (waga + pomiary ciała)
    - Generowanie raportów z postępami
- **Konfiguracja Profilu Dietetyka**
    - Generowanie raportów listy produktów potrzebnych do jadłospisu
    - Przegląd historiii jadłospisów przypisanych do klienta
    - Przegląd zarejestrowanych dań
    - Wyświetlanie monitorowania stanu zdrowia klientów z aktywną współpracą
- **Nawiązywanie współprac**
    - Przedłużanie współpracy
    - Anulowanie współpracy
- **Prowadzenie współprac**
    - Proponowanie jadłospisu klientom
    - Monitorowanie stanu zdrowia klientów
- **Chat**
    - Komunikacja pomiędzy użytkownikami (w głównej mierzy pomiędzy klientami oraz dietetykami)
    - Lista konswersacji

- **Ogłoszenia**
    - Dodawanie szkiców ogłoszeń przez dietetyka
    - Akceptacja ogłoszeń przez administratora
    - Zgłaszanie uwag do proponowanego ogłoszenia przez administratora
    - Publikacja Ogłoszeń

- **Katalog ogłoszeń**
    - Wyświetlanie listy ogłoszeń
    - Promowanie ogłoszeń

- **Moduł zakupów**
    - Zakup promowania ogłoszenia
    - Zakup współpracy z dietetykiem
    - Wyświetlanie listy zakupów dla użytkownika
    - Wyświetlanie listy zakupów dla administratora

- **Płatności**
    - Możliwość uiszczania opłat z pomocą bramki płatniczej za zakupy
    - Wyświetlanie listy płatności przez administratora

