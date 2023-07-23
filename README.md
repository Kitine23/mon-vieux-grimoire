# mon-vieux-grimoire

## Table of Contents

- [About](#about)
- [Getting Started](#getting_started)
- [Usage](#usage)
- [Contributing](../CONTRIBUTING.md)

## About <a name = "about"></a>

Ce projet a pour but de développer le back-end d'un site de notation de livres. Le site "Mon vieux Grimoire" permet aux membres d'ajouter un nouveau livre et de mettre une note visible par le public.

## Getting Started <a name = "getting_started"></a>

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See [deployment](#deployment) for notes on how to deploy the project on a live system.

### Prerequisites

You need to have node 18 installed in your machine

```
nvm use 18
```

### Installing

```
npm install
```

Environment variables :

Create `.env` file in root directory to add :

- `PORT`: (express port number)
- `JWT_TOKEN`: (secret to generate JWT token)
- `MONGODB_URI`: (connection url to mongodb DB)

## Usage <a name = "usage"></a>

Run development server:

```
npm run dev
```

Run production server:

```
npm start
```
