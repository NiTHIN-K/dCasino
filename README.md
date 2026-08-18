# dCasino

dCasino is a portfolio demonstration of a browser-based lottery experience built with React, wallet connectivity, and a Solidity contract. It explores the complete path from wallet state and chain awareness in the client to round settlement in an on-chain contract.

## What it demonstrates

- Browser wallet connection, account changes, and chain changes.
- A React interface for participant state, round history, balances, and wallet details.
- A two-participant lottery round with a verifiable-randomness request.
- Contract event consumption and in-app status feedback.
- Separation between presentation components, wallet handling, and contract interaction.

## Architecture

```text
Browser wallet → React interface → Lottery contract → randomness coordinator → round settlement
```

The client reads browser-wallet state and displays the round experience. The Solidity example records entries, requests randomness when a round is full, and sends the balance to the selected participant after fulfillment.

## Run locally

Requires Node.js 18 or newer and a browser wallet extension.

```bash
npm ci
npm start
```

Create a production build with:

```bash
npm run build
```

## Scope and safety

This repository is a learning and portfolio demonstration, not a production gambling application. It does not include deployment automation, contract configuration for current networks, formal review, or safeguards required for handling real funds.

The included contract uses historical test-network configuration and hardcoded values for illustration. Do not deploy it or send funds to it. Any real-world implementation would require a full contract redesign, independent security review, current network configuration, legal review, and responsible-use controls.

## Project structure

- `src/App.js` manages wallet detection, account state, and chain state.
- `src/Casino.js` and `src/components/` render the game experience.
- `src/ContractConsumer.js` bridges contract events to the interface.
- `solidity/Lottery.sol` contains the experimental lottery contract.

## License

Released under the [MIT License](LICENSE).
