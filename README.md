# Study Synergy Loop

A modern learning platform with personalized AI-powered course recommendations, free course suggestions, and productivity tools.

## ✨ AI-Powered Features (Groq)

- **Personalized Learning Path:**
  - Enter your topic, experience, duration, and goal.
  - Get a custom learning path and 4 AI-recommended courses, powered by Groq.
  - No star ratings are shown for these AI recommendations—just clear, actionable suggestions.

- **Free Udemy Course Suggestions:**
  - Groq AI suggests 4 free Udemy courses for your chosen topic.
  - Each course includes title, description, instructor, and star ratings for popularity and quality.
  - Stars are shown based on the AI's assessment of course popularity and rating.

## Running the Groq Server

The application uses a Groq proxy server to handle AI-powered recommendations securely. Follow these steps to run the server:

### Prerequisites
1. Obtain a Groq API key from [Groq Cloud](https://console.groq.com)
2. Set up your environment variable:
```sh
# Create a .env file in the root directory
GROQ_API_KEY=your_api_key_here
```

### Starting the Server
Run the Groq server using:
```sh
npm run groq:server
```

The server will start on port 4001 by default. You can modify the port by setting the `PORT` environment variable.

### Server Details
- **Endpoint**: POST `/api/groq`
- **Port**: 4001 (default)
- **CORS**: Enabled for cross-origin requests
- **Authentication**: Requires Groq API key in environment variables

## Project info

**URL**: https://lovable.dev/projects/f754e6a0-18e5-4312-a9d2-57650e6add7a

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/f754e6a0-18e5-4312-a9d2-57650e6add7a) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:
- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- Groq (for AI recommendations)

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/f754e6a0-18e5-4312-a9d2-57650e6add7a) and click on Share -> Publish.

## I want to use a custom domain - is that possible?

We don't support custom domains (yet). If you want to deploy your project under your own domain then we recommend using Netlify. Visit our docs for more details: [Custom domains](https://docs.lovable.dev/tips-tricks/custom-domain/)

## 🍏 Apple-Inspired Animated Notifications

This app uses a custom AnimatedToaster notification system with Framer Motion for beautiful, Mac-like bounce and pop effects. Notifications appear in the top-right with glassmorphism, shadow, and smooth transitions.

- Trigger notifications anywhere using the `useAnimatedToaster` hook and `showToast` function.
- Example:
  ```tsx
  const { showToast } = useAnimatedToaster();
  showToast({ type: "success", title: "Welcome!", message: "You have logged in." });
  ```
- Login/logout and other key actions are animated for a delightful user experience.

### Custom Animation
- Notification entrance: bounce-in
- Icon: pop-in
- Fully responsive and dark mode ready

### How to Customize
- Edit `src/components/ui/AnimatedToaster.tsx` for logic and style.
- Animation CSS is in `src/index.css`.
- Place the `<AnimatedToaster toasts={toasts} />` component at the root of your app.

## Sample Login Credentials
```sh
Email: abc@gmail.com
Password: abc@gmail.com
```

## Using the Devfile for Development

This project includes a devfile.yaml that allows you to quickly set up a consistent development environment. The devfile defines all the necessary tools and commands to build and test the code as you generate it.

### What is a Devfile?

A devfile is a YAML configuration file that defines a portable development environment. It's designed to work with cloud development platforms like OpenShift DevSpaces, GitHub Codespaces, and other cloud IDEs.

### Available Commands

The devfile includes the following commands:

- **install-dependencies**: Installs all project dependencies
- **start-dev**: Starts the development server
- **build**: Builds the production version of the application
- **build-dev**: Builds the development version of the application
- **lint**: Runs ESLint for code quality
- **run-tests**: Runs all tests using Vitest
- **build-server**: Builds the server components
- **start-server**: Starts the server
- **start-groq-server**: Starts the Groq proxy server

### Using the Devfile

1. **With a compatible IDE or platform**:
   - Open the project in a devfile-compatible environment
   - The environment will automatically configure based on the devfile.yaml

2. **With OpenShift DevSpaces or CodeReady Workspaces**:
   - Import the project
   - The IDE will detect the devfile and set up the workspace

3. **With GitHub Codespaces**:
   - Open the repository in GitHub Codespaces
   - The devfile will be used to configure the environment

### Running Tests

To run tests as you develop:

```sh
# Run all tests once
npm test

# Run tests in watch mode
npm run test:watch
```

## About
This project crafted with LoveableAI, Amazon Q, Groq Cloud. You can modify and extend it as needed for your own learning or development goals.