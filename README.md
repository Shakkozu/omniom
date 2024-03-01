![Logo](assets/logo_small.png)
# Omniom

System umożliwiający prowadzenie jadłospisu oraz monitorowania aktualnego stanu zdrowia (wagi, pomiarów), rozszerzony o funkcjonalność koordynowania współpracy pomiędzy dietetykami oraz użytkownikami aplikacji, którzy monitorują swoje posiłki i sylwetkę

---

## Powód powstania
Do utworzenia tego projektu zainspirował mnie kalkulator kalorii [Fitatu](https://www.fitatu.com/).

Korzystam z niego na codzień i uważam że kierunek rozwoju w celu roszerzenia zestawu funkcjonalności o współpracę z dietetykami jest słuszny, w związku z tym chciałbym spróbować stworzyć taki system żeby rozwinąć swoje umiejetności 

## Główne założenia

Zestaw założeń, wedle których planuję zaprojektować system:
- baza produktowa powinna być zasilona na starcie systemu, żeby użytkownik po rejestracji mógł od razu korzystać z funkcjonalności kalkulatora kalorii
- rejestracja dietetyków w systemie jest koordynowana przez administratora manualnie
- system koordynuje współpracę dietetyka z klientem, udostępniając dietetykowi informacje na temat wagi, pomiarów oraz historii odżywiania klientów
- dietetyk może skonfigurować swój zestaw posiłków/przepisów, aby budować jadłopisy dla swoich klientów

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
Takie podejście umożliwi izolacjĘ każdej ścieżki biznesowej i wprowadzania punktowych optymalizacji w ramach potrzeb

#### Diagram architektury C4

C2 - Context level
![Context level](assets/c2.png)

### Lista funkcjonalności do zrealizowania w MVP

@todo