# ANYLearn: AI-Powered Course Generation Platform

![ANYLearn](assets\ANYLearn.webp)

ANYLearn is designed to simplify and accelerate the learning process by generating course outlines and detailed content through AI. Users enter a topic, state their learning goal, and provide their background level, and the system responds with a structured set of subtopics and complete course sections generated via a language model API. The application supports full course management, including creation, editing, deletion, and exporting/importing courses, all wrapped in a responsive and user-friendly interface.

---

## Table of Contents

- [Project Description](#project-description)
- [User Guide](#user-guide)
  - [Application Overview](#application-overview)
  - [Common Workflows](#common-workflows)
  - [Step-by-Step Instructions](#step-by-step-instructions)
- [Developer Guide](#developer-guide)
  - [Project Structure](#project-structure)
  - [Setup Instructions](#setup-instructions)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
    - [Development Build Process](#development-build-process)
    - [Production Build Process](#production-build-process)
    - [Contributing Guidelines](#contributing-guidelines)
- [Features](#features)
- [Technologies Used](#technologies-used)

---

## User Guide

### Application Overview

ANYLearn offers a seamless learning experience by combining AI-driven content generation with an intuitive course management system. The platform:

- **Generates course outlines:** Leverages a language model to create a logical progression of subtopics.
- **Builds detailed course sections:** Automatically generates content for each subtopic including explanations and practical exercises.
- **Provides recommendations:** Suggests courses based on user interests and completed courses.
- **Offers interactive navigation:** Includes features like a dynamic sidebar, search functionality, and real-time notifications.

### Common Workflows

1. **Course Generation:**

   - Enter your course topic, learning goal, and background level.
   - Click the "Generate Course" button.
   - View the AI-generated subtopics and corresponding detailed course content.

2. **Course Navigation & Management:**

   - Use the sidebar to navigate between your courses.
   - Edit course names, delete unwanted courses, or export courses as JSON files.
   - Access recommendations to explore new learning opportunities.

3. **Searching & Recommendations:**
   - Use the search bar to quickly locate courses.
   - Click on a recommended course to prefill the course creation form with suggested topics and goals.

### Step-by-Step Instructions

1. **Creating a New Course:**

   - Navigate to the home screen and click on the input field.
   - Enter the course topic, your learning goal, and your current background level.
   - Press the "Generate Course" button to initiate AI-driven course outline generation.
   - Once generated, the course is displayed on the course page where you can click on subtopics to view detailed content.

2. **Navigating Courses:**

   - Use the sidebar to see a list of your courses.
   - Click on any course name to load its detailed content.
   - Edit or delete courses directly from the sidebar as needed.

3. **Using Search and Recommendations:**

   - Open the search overlay by clicking the search icon or using the keyboard shortcut.
   - Type in your query to filter through available courses.
   - Select a course from the filtered list or opt for a new course recommendation.

4. **Managing Course Data:**
   - Export courses to save your progress as a JSON file.
   - Import previously saved courses to restore your work.
   - Access the settings page for additional course management options, including bulk deletion.

---

## Developer Guide

### Project Structure

- **backend/**
  - `main.py`: Contains the FastAPI server with endpoints for generating subtopics, course content, and recommendations. It handles LLM API requests and environment variable configuration.
  - `requirements.txt`: Lists Python dependencies required for the backend server.
- **frontend/**
  - **public/**: Contains static assets such as SVG icons used throughout the Angular application.
  - **src/**
    - **app/**: Main Angular application code including components (home, course, settings, sidebar, etc.), services (course, notification, search, shortcut, sidebar), and routing configuration.
    - **styles/**: Custom CSS files including Tailwind CSS, custom fonts, and syntax highlighting themes.

### Setup Instructions

#### Prerequisites

- **Backend:**
  - Python and pip.
  - Required Python packages listed in `backend/requirements.txt`.
- **Frontend:**
  - Node.js and npm.
  - Angular CLI installed globally.

#### Installation

1. **Backend:**

   - Navigate to the `backend/` directory.
   - Install dependencies:
     ```bash
     pip install -r requirements.txt
     ```
   - Create a `.env` file with the following environment variables:
     - `API_KEY`: Your API key for the language model provider.
     - `PROVIDER_URL`: URL endpoint for the LLM provider.
     - `LLM_MODEL`: Model identifier to use for generating content.

2. **Frontend:**
   - Navigate to the `frontend/` directory.
   - Install dependencies:
     ```bash
     npm install
     ```

#### Development Build Process

- **Backend:**
  - Run the FastAPI server:
    ```bash
    fastapi dev main.py
    ```
- **Frontend:**
  - Start the Angular development server:
    ```bash
    npm run start
    ```
  - Open your browser and navigate to `http://localhost:4200/`.

#### Production Build Process

1. **Frontend:**
   - Build the Angular application for production:
     ```bash
     npm run build
     ```
   - For Server-Side Rendering (SSR), run:
     ```bash
     npm run serve:ssr:ANYLearn
     ```
2. **Backend:**
   - Run the FastAPI server:
     ```bash
     fastapi run main.py
     ```
   - Deploy the FastAPI application on your production server ensuring environment variables are securely set.

#### Contributing Guidelines

- **Code Style:** Follow consistent coding standards as seen in existing files.
- **Pull Requests:** Make sure your contributions are well-documented with clear commit messages.
- **Testing:** Ensure all changes pass unit tests and integration tests.
- **Documentation:** Update this README and any other relevant documentation if you introduce new features or modify existing functionality.
- **Branching:** Use feature branches for new development and create pull requests for review.

---

## Features

- **AI-Driven Course Generation:**

  - Generates comprehensive course outlines and detailed content sections using an advanced language model.
  - Provides a logical progression from basic to advanced subtopics.

- **Course Management:**
  - Create, edit, and delete courses effortlessly.
  - Export and import courses in JSON format for backup or sharing purposes.
- **Interactive UI Components:**
  - Responsive design built with Angular, Tailwind CSS, and DaisyUI.
  - Sidebar navigation, dynamic notifications, and search functionality enhance user experience.
- **Real-Time Recommendations:**
  - Generates tailored course recommendations based on user inputs and previously completed courses.
- **Modern Web Technologies:**
  - Backend built with FastAPI ensures fast and reliable API responses.
  - Frontend leverages Angular's powerful component-based architecture with SSR support for improved performance and SEO.

---

## Technologies Used

- **Backend:** Python, FastAPI
- **Frontend:** Angular, TypeScript, Tailwind CSS, DaisyUI
- **Additional Tools:** Prism.js for syntax highlighting, Clipboard.js for copy functionality
