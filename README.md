# Interactive Prompt Playground

A simple web app to experiment interactively with OpenAI's GPT models (gpt-3.5-turbo and gpt-4) by adjusting prompt parameters and seeing how outputs change.

---

## Features

- Choose between `gpt-3.5-turbo` and `gpt-4` models.
- Input custom **system prompt** and **user prompt**.
- Adjust parameters:
  - Temperature (`0.0` to `2.0`)
  - Max Tokens (number of tokens in the output)
  - Presence Penalty (controls topic novelty)
  - Frequency Penalty (reduces repetition)
  - Optional Stop Sequence
- View generated output instantly.
- Basic error handling for API issues.

---

## Getting Started

### Prerequisites

- Normal static HTML/JS app.
- A valid OpenAI API key. Get yours at [https://platform.openai.com/account/api-keys](https://platform.openai.com/account/api-keys).

### Installation

1. Clone or download this repository.

2. Open `app.js` and replace the placeholder API key string:
   ```js
   const API_KEY = 'YOUR_OPENAI_API_KEY';
   ```

3. Maintain env file or directly give it here to test it.
