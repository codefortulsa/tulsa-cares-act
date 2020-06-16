<p align="center">
  <img width="64" height="64" src='./src/img/eviction.svg?raw=true' alt="Food for Thought OK" />
</p>

<h3 align="center">
  <b>See if an address in Tulsa County is eligible for eviction relief under the CARES act at <a href="https://tbd.org">tbd.org</a></b>
</h3>

In partnership with [Housing Solutions](https://www.facebook.com/pages/category/Cause/Housing-Solutions-Tulsa-105568634392642/), Code for Tulsa has assembled this responsive web app allowing families to understand their rights during the eviction moratorium.

> In an effort to help renters amid the coronavirus pandemic and skyrocketing unemployment, the March 27 CARES Act banned eviction filings for all federally backed rental units nationwide, more than a quarter of the total.
>
> [Despite Federal Ban, Landlords Are Still Moving to Evict People During the Pandemic](https://www.propublica.org/article/despite-federal-ban-landlords-are-still-moving-to-evict-people-during-the-pandemic)
> -ProPublica

---

---

- [Back-end Tech](#back-end-tech)
- [Front-end Tech](#front-end-tech)
- [Getting Started](#getting-started)
- [Deployment](#deployment)

---

---

## Back-end Tech

**This project was built with [Firebase](https://firebase.google.com/) tools and some [Google APIs](https://developers.google.com/apis-explorer/). Specifically:**

- **[Firebase Hosting](https://firebase.google.com/products/hosting)**: For static, single-page web app deployment
- **[Google Sheets API](https://developers.google.com/sheets/api/)**: The "database" is pulled from a client managed Google Sheet document. A view only copy of this spreadsheet [available here](https://docs.google.com/spreadsheets/d/1nIg6BaErJ6qB3v1jS16geJaYOJWZWvjLGh5OcEGlylg/edit#gid=1291644415)

## Front-end Tech

**This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app) and primarily relies on the following technologies:**

- **[React](https://reactjs.org/)**: A JavaScript library for building user interfaces
- **[Typescript](https://www.typescriptlang.org/)**: A typed superset of JavaScript that compiles to plain JavaScript.
- **[StyledComponents](https://styled-components.com/)**: Use the best bits of ES6 and CSS to style your apps without stress 💅🏾
- **[React Router](https://reacttraining.com/react-router/)**: Declarative routing for React
- **[react-i18next](https://react.i18next.com/)**: Internationalization for react done right. Using the [i18next](https://www.i18next.com/) i18n ecosystem.

### Learn More about React

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

## Getting started

**If you'd like to run a local version of the app, follow these instructions below:**

> **Please note before cloning:** You'll need special access to the firebase project to get things working properly—even locally. Please reach out if you're looking to contribute to this project or investigate further.

- Clone the repo, and in the root directory run `yarn install` to download all project depencies. (_You may need to get [Yarn](https://yarnpkg.com/en/) if you haven't already..._)
- Run `yarn start` to spin up a locally running version of the site.
- Make sure you have either placed the _`.env`_ file from Code for Tulsa's 1Pass account into your root directory, OR edit the environment variables in _`App.tsx`_ to link to appropriate API keys and resources.

> Your _`.env`_ file should look a little something like:
>
> ```
> REACT_APP_GOOGLE_SHEET_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
> REACT_APP_GOOGLE_SHEET_NAME=Locations
>
> REACT_APP_GOOGLE_API_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
> REACT_APP_GOOGLE_ANALYTICS_TRACKING_CODE=UA-xxxxxxxxx-x
> ```

## Deployment

> **Please note before deploying:** You'll need to have [Firebase CLI](https://firebase.google.com/docs/cli) installed. The account you sign into Firebase CLI with will also need permission for this Firebase project. Please reach out with any access requests.

To deploy the production site, run:

```BASH
npm run deploy
```
