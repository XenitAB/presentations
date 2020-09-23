---
marp: true
theme: gaia
_class: lead
color: black
paginate: true
backgroundColor: #fff
backgroundImage: url('./assets/xenit/background_white.jpg')
footer: "![width:50px height:50px](./assets/xenit/logo_green.jpg)"
style: |
  section {
    font-family: 'Lucida Sans';
  }
  section h1 {
    color: #02D35F;
  }
---

<!-- _paginate: false -->

# DevOps med Xenit

En introduktion till DevOps

<!--
Presenter notes.
-->

---

<!-- _paginate: false -->
<!-- _class: lead -->

# Agenda

- Introduktion (15 min)
- Varför DevOps-kulturen och var kommer den ifrån (30 min)
- Paus (15 min)
- Hur jobbar företag för att främja kulturen (30 min)
- Vilka verktyg och arbetssätt möjliggör kulturen (30 min)

<!--
Presenter notes.
-->

---

![bg right](./assets/xenit/xenit_office_01.jpg)

# Introduktion

Vilka är vi?

- Xenit AB
- Philip Laine
- Simon Gottschlag

<!--
Presenter notes.
-->

---

![bg left](./assets/xenit/xenit_office_01.jpg)

# Xenit AB

Vi realiserar dina digitala drömmar:

Med säkra och moderna tjänster skapar vi frihet.

<!--
Vårt syfte är att skapa frihet för människor. Våra tjänster möjliggör distansarbete, samarbete mellan kontor och ger frihet i val av enheter, arbetstider och arbetsplats.

Kunder så som: Afry, Lindex, HSB
-->

---

![bg right](./assets/xenit/PL.jpg)

# Introduktion

## Philip Laine

DevOps specialist

<!--
Presentation av Philip
-->

---

![bg left](./assets/xenit/SG.jpg)

# Introduktion

## Simon Gottschlag

CTO

<!--
Presentation av Simon
-->

---

![bg right](./assets/unsplash/josh-calabrese-Ev1XqeVL2wI-unsplash.jpg)

# Varför DevOps

Mer värde snabbare genom rätt kultur och verktyg

- Gladare utvecklare
- Mer värde för pengarna
- Bättre produkter
- Alla har sina åsikter

<!--
Software is cool but useless if nobody wants it

- Feature development is slow
- Deployment to production is slow
- Feedback from end user is slow
-->

---

![bg left](./assets/unsplash/zoe-reeve-9hSejnboeTY-unsplash.jpg)

# Vad är DevOps

"De blinda männen beskriver en elefant"

- Verktyg
- Kultur
- Filosofi
- Arkitektur
- Planering

<!--
Alla beskriver det olika.

De blinda männen skall beskriva en elefant:
- Den som känner på snabeln: Det är som en orm
- Den som känner på örat: Det är som en fläkt
- Den som känner på benet: Det är som ett träd
- Den som känner på magen: Det är som en vägg
- Den som känner på bete: Det är som ett spjut
- Den som känner på svansen: Det är som ett rep
-->

---

![bg right](./assets/unsplash/hannah-busing-Zyx1bK9mqmA-unsplash.jpg)

# Vad är DevOps

DevOps är mötesplatsen för:

- människor
- processer
- produkter

För att möjliggöra kontinuerlig leverans av värde till slutanvändare.

<!--
Mer information...
-->

---

# Produktivitet

<!-- Måste justeras efter dagens siffror -->

| Företag       | Frekvens  | Ledtid  | Pålitlighet |
| ------------- | --------- | ------- | ----------- |
| Amazon        | 23000/dag | Minuter | Hög         |
| Google        | 5500/dag  | Minuter | Hög         |
| Netflix       | 500/dag   | Minuter | Hög         |
| Facebook      | 1/dag     | Timmar  | Hög         |
| Twitter       | 3/vecka   | Timmar  | Hög         |
| Vanliga bolag | 1/kvartal | Månader | Låg         |

<!--
Mer information...
-->

---

# Framgångsfaktorer 1

- Använd versionshantering för allt
- Automatisera deployment och tester
- Implementera continuous integration / continuous delivery
- Använd trunk-based development-metoder
- Injecera säkerhet i alla steg
- Löst kopplad arkitektur
- Arkitektur för att möjliggöra autonoma team

<!--
Mer information...
-->

---

# Framgångsfaktorer 2

- Samla in och implemenmtera feedback från kunder
- Synliggör flödet av arbete genom värdeströmmen
- Arbeta i små intervall (batches)
- Främja och möjliggör experiment

<!--
Mer information...
-->

---

# Framgångsfaktorer 3

- Enkel change management
- Använd data från övervakning för att ta beslut
- Arbeta proaktivt med att upprätthålla hälsan på systemen
- Jobba med WIP (work-in-process) begränsningar
- Visualisera hur arbete utförs

<!--
Mer information...
-->

---

# Framgångsfaktorer 4

- Främjar kulturen:
  - Informationsflöden genom organisationen
  - Samarbete och tillit
  - Korsfunktionella team
- Investera i att alla lär sig och utvecklas

<!--
Mer information...
-->

---

# Wall of Confusion

![bg](./assets/wall-of-confusion.png)

<!--
Presenter notes.
- There is more to it than just the app
  - We have dependencies, os, etc.
- How do we avoid throwing the app over the wall?
- What tools are there that we can use
-->

---

# Mjukvara

- Svårt att jobba med DevOps om din produkt är trubbig
- Låt kulturen påverka hur du designar mjukvara
- Värt att tänka på:
  - Separation av ansvar
  - Kofiguration vs Logik
  - Hur mycket "vet" din applikation?

---

# Docker

![bg w:60%](./assets/docker-vs-vm.png)

<!--
Presenter notes.

- Docker is a tool that simplifies working with Linux containers.
- A container is an efficient way to snapshot code, dependencies and OS into a single binary.
-->

---

# Exempel

```Dockerfile
FROM node:slim
RUN mkdir /app
WORKDIR /app
COPY . .
CMD [ "node", "main.js" ]
```

```shell
docker build --tag webapp .
docker run webapp
```

<!--
Presenter notes.

- Snapshots allows for an image to always work.
- Configuration should be kept separate.
-->

---

# Flera Applikationer

<!--
Presenter notes.
-->

---

# Kubernetes

<!--
Presenter notes.
-->

---

# Resurser

- Books

  - [The Phoenix Project](https://www.goodreads.com/book/show/17255186-the-phoenix-project)
  - [The Unicorn Project](https://www.goodreads.com/book/show/44333183-the-unicorn-project)
  - [The Goal](https://www.goodreads.com/book/show/113934.The_Goal)
  - [Accelerate](https://www.goodreads.com/book/show/35747076-accelerate)

- Websites

- Podcasts

- Tools

<!--
Presenter notes.
-->

---
