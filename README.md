# JaaS — Jouko as a Service

Suomenkielinen varauskonsepti Joukon kuljetuspalvelulle ja yleisremonttiavulle. Staattinen HTML/CSS/JavaScript-sivusto GitHub Pagesiin. Ei build-riippuvuuksia.

## Kokeile paikallisesti

Node.js 22 tai uudempi:

```sh
npm run dev
```

Avaa http://127.0.0.1:4173. Tarkistukset: `npm test`. Julkaisutiedostot: `npm run build` → `dist/`.

## Varauspolku

1. Valitse kuljetuspalvelu tai yleisremonttiapulainen.
2. Kuljetus: valitse tavarat, kirjoita osoitteet ja merkitse lähtö ja määränpää Leaflet/OpenStreetMap-kartalle. Pisteitä voi siirtää vetämällä tai antaa koordinaatteina. Kartta alkaa Helsingistä, mutta sitä voi siirtää muualle. Osoitteita ei geokoodata. Viiva ei ole ajoreitti.
3. Remonttiapu: kuvaile työ vapaasti.
4. Valitse kalenterista päivä ja arvioitu kesto.
5. Tarkista yhteenveto ja lataa varausluonnos tekstitiedostona.

## GitHub Actions ja Pages

Repositorion **Settings → Pages → Build and deployment → Source: GitHub Actions** täytyy valita kerran. Tämän jälkeen jokainen `main`-push ajaa testit, rakentaa staattisen sivuston ja julkaisee sen Pagesiin. Pull requestit ajavat testit ja buildin julkaisematta. Työnkulun voi käynnistää myös Actions-välilehdeltä (**Check and deploy Pages → Run workflow**).

Tavoiteosoite: https://backtooth.github.io/JaaS/

Työnkulku: `.github/workflows/pages.yml`. Sivusto käyttää suhteellisia resurssipolkuja, joten Pagesin `/JaaS/`-alihakemisto toimii ilman reititysasetuksia.

## Konseptin rajat

**Tämä ei vastaanota oikeita varauksia.** Tietoja ei lähetetä Joukolle, tallenneta palvelimelle tai selaimen pysyvään muistiin. Kalenteri ei tunne Joukon saatavuutta. Luonnos säilyy vain avoimen sivun muistissa; lataus tallentaa sen käyttäjän laitteelle. Sivun päivittäminen aloittaa uuden luonnoksen.

Karttatiilet haetaan OpenStreetMapilta, Leaflet unpkg-CDN:stä ja kirjasimet Google Fontsilta. Nämä palvelut saavat tavanomaisia verkkopyyntötietoja. Työn kuvausta tai osoitekenttiä ei lähetetä niille. Koordinaatit voi syöttää myös kartan latautumatta. Kirjasimille on paikalliset varavaihtoehdot.

Ennen oikeaa käyttöönottoa tarvitaan sovittu varauspyyntöjen vastaanottokanava ja yhteystiedot, palvelin varauksille, saatavuuskalenteri, vahvistukset sekä hinnat ja palvelun ehdot. Henkilötietoja ei pidä tallentaa julkiseen GitHub-repoon tai Actions-lokeihin.
