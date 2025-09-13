# Overview
Chronicle is a decentralized application that leverages blockchain technology to create a permanent, immutable, and censorship-resistant public archive. It solves the problem of digital content being ephemeral and controlled by central parties by providing a trustless platform for storing information. It's for individuals wanting to preserve memories, communities wanting to record their history, and creators exploring new forms of media. Its value lies in providing true permanence and user ownership over digital expression.

# Core Features

### 1. Time Capsule Creation
* **What it does:** Allows a user to write a message, set a future unlock date, and seal it on the blockchain.
* **Why it's important:** It creates a novel, trustless mechanism for sending information into the future, guaranteed by code rather than a corporation.
* **How it works at a high level:** The user submits their message and a future timestamp to a smart contract. The contract stores this data and uses a `require` statement to prevent it from being read until `block.timestamp` surpasses the unlock time.

### 2. Story Chain Contribution
* **What it does:** Allows users to either start a new collaborative narrative or add a new entry to an existing one.
* **Why it's important:** It enables a new form of "unstoppable media," where a collective story can be built over time without a central author or platform that can alter or delete it.
* **How it works at a high level:** The user submits their contribution and a `storyId` to the smart contract. The contract appends this new entry to the specified story thread, making it immediately readable.

### 3. Public Archive Viewing
* **What it does:** Provides a public, read-only interface to browse all unlocked time capsules and view the full history of all story chains.
* **Why it's important:** It makes the collective archive a public good, accessible to anyone without requiring permission.
* **How it works at a high level:** The frontend reads the array of all entries from the smart contract. For each entry, it attempts to call the `readEntry` function. If the call succeeds, it displays the content. If the call fails due to a time-lock, the UI displays a "Locked" status with the unlock date.

# User Experience

### User Personas
* **The Futurist (Individual):** Wants to send a message to their future self or create a digital inheritance for their family. They value permanence and security.
* **The Historian (DAO/Community):** Wants to create a permanent, unalterable record of their group's decisions, history, and lore. They value transparency and censorship resistance.
* **The Creator (Artist/Writer):** Wants to experiment with new forms of collaborative and persistent storytelling that couldn't exist on traditional platforms.

### Key User Flows
1.  **Creating a Time Capsule:**
    * User lands on the site and connects their wallet.
    * Navigates to the "Create Capsule" section.
    * Fills in a message and selects an unlock date from a calendar.
    * Clicks "Seal Capsule" and approves the transaction in their wallet.
2.  **Contributing to a Story:**
    * User connects their wallet.
    * Navigates to the "Stories" archive and selects a story to contribute to.
    * Writes their entry in a text field.
    * Clicks "Add to Story" and approves the transaction.

### UI/UX Considerations
* **Simplicity:** The interface should be minimal and clean, focusing the user on writing and exploring.
* **Clarity:** Abstract away blockchain jargon. Instead of "gas fees," use "network fee." Clearly show transaction states (Pending, Confirmed, Failed).
* **Feedback:** Provide immediate visual feedback when a user successfully seals a capsule or adds to a story.

# Technical Architecture

### System Components
* **Smart Contract (Backend Logic):** A **Solidity** contract deployed on an Ethereum L2 (e.g., **Arbitrum**, **Base**). This is the single source of truth.
* **Frontend (Client Application):** A web application built with **Next.js** or **Vite** + **React**.
* **Wallet Integration:** **Wagmi** and **viem** for interacting with the smart contract, and **RainbowKit** for a seamless "Connect Wallet" experience.
* **Node Provider:** A service like **Alchemy** or **Infura** for reliable read access to the blockchain.

### Data Models
* **Onchain `Entry` Struct:** The core data structure stored in the smart contract.
    ```solidity
    struct Entry {
        address creator;
        string content;
        uint256 creationTimestamp;
        uint256 unlockTimestamp; // 0 for story entries
        uint256 storyId; // 0 for capsules
    }
    ```

### APIs and Integrations
* The primary "API" is the **ABI** (Application Binary Interface) of the deployed smart contract.
* The frontend integrates with browser-based Ethereum wallets (e.g., MetaMask, Coinbase Wallet) via the injected provider.

### Infrastructure Requirements
* **L2 Network Access:** For deploying the smart contract.
* **Web Hosting:** A static web host like **Vercel** or **Netlify** for the frontend application.

# Development Roadmap

### MVP Requirements (Phase 1: The Time Capsule)
* **Smart Contract:**
    * Implement the `Entry` struct.
    * Create a `createCapsule` payable function.
    * Create a `readEntry` view function with the time-lock `require` check.
    * Implement an `EntryCreated` event.
* **Frontend:**
    * Set up wallet connection.
    * A single page with a form to call `createCapsule`.
    * A simple, chronologically sorted list that displays all entries and their locked/unlocked status.

### Future Enhancements (Phase 2 and Beyond)
* **Phase 2 (Story Chains):**
    * Update the smart contract with `startStory` and `addToStory` functions.
    * Build out the frontend UI to browse, read, and contribute to distinct story chains.
* **Phase 3 (Archive Exploration):**
    * Add search, filtering (by creator, date), and pagination to the public archive view.
* **Phase 4 (Scaling & Rich Media):**
    * Integrate **IPFS** for storing larger content (images, longer texts). The smart contract would only store the IPFS hash, drastically reducing gas costs.

# Logical Dependency Chain

1.  **Contract Foundation:** Develop and thoroughly test the core `Chronicle.sol` smart contract with only the **time capsule functionality** (`createCapsule`, `readEntry`). Deploy it to a testnet. This is the non-negotiable first step.
2.  **Frontend Scaffolding:** Initialize the Next.js project and integrate wallet connectivity. Ensure a user can successfully connect and their address is displayed. This provides the container for all future work.
3.  **Create Flow (Write):** Build the UI form for creating a capsule. Wire up the "Seal Capsule" button to call the `createCapsule` function on the deployed contract. This achieves the "write" part of the DApp.
4.  **Read Flow (Read):** Build the UI component that reads all entries from the contract. Implement the logic to display the "locked" status correctly. This completes the full, end-to-end MVP loop and creates a usable product.
5.  **Iteration:** After the MVP is functional, begin work on Phase 2 (Story Chains), which depends on the stable foundation of the MVP.

# Risks and Mitigations

### Technical Challenges
* **Risk:** Onchain storage costs could become prohibitive for long messages, even on an L2.
* **Mitigation:** For the MVP, enforce a strict character limit on messages. Clearly define IPFS integration as the scaling solution in the roadmap.
* **Risk:** A bug in the smart contract could lead to locked funds or broken logic.
* **Mitigation:** Write a comprehensive test suite using **Foundry**. Adhere to well-established security patterns (e.g., Checks-Effects-Interactions).

### Figuring out the MVP that we can build upon
* **Risk:** Scope creep—trying to build both time capsules and story chains simultaneously, resulting in an incomplete product.
* **Mitigation:** Be ruthless in defining the MVP. The **only** goal for Phase 1 is a working time capsule feature. All other ideas are deferred to the "Future Enhancements" section. A simple, complete feature is better than two complex, broken ones.

### Resource Constraints
* **Risk:** Limited development time (e.g., in a hackathon setting) can prevent building a polished product.
* **Mitigation:** Aggressively leverage existing tools. Use **RainbowKit** for wallet UI, a component library like **Shadcn/UI** for the frontend, and **Foundry's** built-in testing features to accelerate development. Prioritize function over form for the MVP.

# Appendix

* **Research:** The concept is inspired by the need for permanent digital records in an increasingly centralized web, drawing on the principles of the "Permanent Record" and decentralized archiving projects.
* **Technical Specifications:** The `content` field will be of type `string memory`. The fee for creation will be a fixed value (e.g., 0.001 ETH) for the MVP.