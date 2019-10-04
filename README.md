# tychess

Tychess is a TypeScript chess implementation.

### Features, tech stack and a bit of a sales pitch:
* All computations run fully client-side. No backend processing required.
* A responsive, mobile & desktop friendly frontend.
    * Powered by React and Bootstrap.
* Comes with its own chess game model, the heart of the application.
    * Includes game rules, player move validation, the state of a game detection, FEN processing and so on.
* External chess engine support.
    * Integrates out-of-the-box with Stockfish running as a web worker.
    * Any other kind of a player, be it a chess engine, a remote client - or anything really - is easily pluggable. All that is required is to implement a simple interface and to pass it to tychess. Everything else is taken care of.
* High test coverage.
    * From unit to functional tests. Using Jest, React Testing Library and Cypress.
* A rather nice, clean codebase - you be the judge.

This is an MVP release. Tychess has everything that is required to play a full game of chess against a human/an engine or to watch two computer players compete with each other.

## Building & running

Requirements: git, node, npm.

### Get it running locally from a shell:
1. `git clone https://github.com/tpamula/tychess.git`
2. `cd tychess`
3. `npm install`
4. `npm start`

A dev server should start on `http://localhost:3000` by default.

### Tests
Once the dependencies are installed, Jest tests can be started with `npm run test`.

To start Cypress make sure the server is running and then type `npm run cypress:open`. Cypress is set to point to the same url that the dev server starts on. 
