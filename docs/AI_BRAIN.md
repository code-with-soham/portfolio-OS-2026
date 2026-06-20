# Local AI Brain Architecture (VS-31)

The Portfolio OS utilizes a localized "AI Brain" designed to simulate a conversational interface capable of controlling the OS, fetching local knowledge, and answering recruiter questions natively inside the browser.

## 1. Intent Engine (`src/ai/brain/intentEngine.js`)
Parses incoming user text to detect their overarching goal. It uses fuzzy matching and regex against a predefined set of intents (`intents.js`) such as "Open App", "Change Theme", "Tell me about Skills", or "Play Music".

## 2. Entity Extractor (`src/ai/brain/entityExtractor.js`)
Once an intent is determined, this module extracts specific parameters. For instance, if the intent is "Open App", the entity extractor finds which app (e.g., "Browser", "Terminal") by cross-referencing OS app registries.

## 3. Context Manager (`src/ai/brain/contextManager.js`)
Maintains conversation history and current OS state. It allows the AI to respond contextually (e.g., if a user asks "Close it", the context manager knows what "it" refers to based on the active window).

## 4. Action Executor (`src/ai/actions/actionRegistry.js`)
The bridge between the AI's logic and the actual OS functions. It dispatches Zustand store updates (like `useWindowStore.getState().openWindow('browser')`) or triggers API calls based on the parsed intents.

## 5. Knowledge Base (`src/ai/knowledge/`)
A collection of static JSON files containing deep contextual data about:
- **Profile** (`profile.json`): Bio, education, contact info.
- **Projects** (`projects.json`): Details, tech stacks, and links for portfolio projects.
- **Skills** (`skills.json`): Technical proficiencies and experiences.
This is the core data the AI queries when asked about the developer's background.

## 6. Response Generator (`src/ai/brain/responseGenerator.js`)
Formats the final output sent to the chat interface. It turns raw data (like a JSON object of a project) into natural language, often leveraging markdown formatting (bolding, lists, links) to be rendered by `ReactMarkdown`.

## 7. Analytics Integration
The AI Brain silently logs interactions to the `useAnalyticsStore`, allowing recruiters' questions and engagement levels to be tracked and eventually surfaced in the Analytics Center.
