### Introduction

In this project i show how work a voices assistant and how do a voice assistant in the web as Google assistant or Alexa.

We develop all the phase that this interfaces using to understand us and one phase more, sentyment analyisis.

You can see a litle introduction with the next [Slides](https://speakerdeck.com/borjagodoy/esta-web-si-que-sabe-como-hablarme "Slides").

### How use

#### Backend

In the beging you need take a API key for tone analyze, you can follow the next [instrucctions](https://cloud.ibm.com/apidocs/tone-analyzer "instructions")

when you have the apikey, create in the backend folder a .env file

`cd backend && touch .env`

And write the env variable.

`TONE_TOKEN=YOUR TONE ANALYZER KEY`

Install npm dependencies

`npm install`

and start the server

`npm start`

#### Frontend
Before to start the app you need create a agent in [Dialog Flow](https://dialogflow.cloud.google.com/ "Dialog Flow") and take the `API CLIENT` of agent in the settings of the agent.
when you have this token, you need create a .env file in the frontend folder.
`cd frontend && touch .env`

And write the env variable.

`VUE_APP_DIALOG_KEY=YOUR CLIENT KEY`

The frontend is a VUE app. To start the frontend you need go to the frontend folder
install dependencies

`npm install`

and start the vue cli server

`npm run serve`

**[wip] i'm working in do a separate the implementation by branchs**