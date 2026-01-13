# 🗓️ Angular ERP Timeline

A high-performance, reactive production scheduling timeline built with Angular 21 and Signals. This project allows production managers to visualize work orders across different work centers, manage schedules through an interactive grid, and maintain high situational awareness with real-time UI indicators.

🚀 Key Features
Reactive Timeline Grid: Utilizes Angular Signals for high-performance rendering of thousands of grid lines and work order bars.

Dynamic Zooming: Supports "Day," "Week," and "Month" views, automatically recalculating all positions via computed signals.

Contextual UI Markers: Includes a custom "Current Month" milestone badge and a mouse-tracking "Ghost Bar" for intuitive scheduling.

Color-Coded Statuses: Work order bars are visually categorized by status (Open, In progress, Blocked, Complete) for immediate recognition.

Smart Auto-Scroll: Automatically centers the view on the current date upon loading or changing zoom levels.

## 🛠️ Getting Started

Follow these steps to get your local development environment up and running.

Prerequisites
Node.js: Version 18.x or higher.

Angular CLI: Version 18.x or higher.

Package Manager: npm or yarn.

Installation
Clone the repository:

`git clone https://github.com/yfzwinnie/Work-Order-Schedule-Timeline.git`

Install the dependencies

`npm install`

Running the Application
Start the development server:

`npm start`

Access the UI: Open your browser and navigate to http://localhost:4200/

## 🤖 AI-Assisted Development

This project was developed using a "Thought Partner" approach with AI. By utilizing Generative AI, I was able to accelerate the architectural design and solve complex CSS/Mathematical translation challenges in the SVG and Grid systems.

How I Utilized AI
Mathematical Translations: AI helped calculate the matrix() transformations for SVG icons and the pixel-per-day logic for date positioning.

Component Architecture: Used AI to brainstorm the "Dumb/Smart" component split, ensuring the WorkOrderBar remains performant by only reacting to signal inputs.

Refinement Iterations: I provided visual screenshots of the desired UI, and the AI helped translate those visual styles into specific SCSS variables and clip-path properties.

Example Prompts Used
"How do I rotate an SVG path if the current transform is a complex matrix?"

"Create an Angular computed signal to calculate a work order bar's width based on a pixelsPerDay input."

"I want the current month marker to look like a rounded lavender pill badge centered on the first day of the month."

"How do I make the timeline scroll container automatically center on a specific pixel position when a signal changes?"

## 🛠️ Tech Stack

Framework: Angular 21 (Standalone Components, Signals).

Styling: SCSS (CSS Variables for dynamic grid scaling).

Icons: Inline SVGs with dynamic CSS transforms.

Data Handling: RxJS for data streams and Signals for UI state.

## 🔮 @Upgrades

To move this project from a prototype to a production-ready ERP tool, the following features are prioritized:

1. ♿ Accessibility (A11y)
   Keyboard Navigation: Implement tab-navigation to allow users to move between work orders and open the edit drawer using only a keyboard.

ARIA Labels: Add dynamic aria-label attributes to work order bars describing the order name, status, and dates for screen readers.

2. 👻 Advanced Hover Interaction
   Ghost Bar Logic: Implement a "Ghost Bar" that appears when hovering over empty grid space, snapping to the nearest day to preview where a new order would be created.

Contextual Tooltips: Show a "Click to Add" label that follows the cursor within the ghost bar boundaries.

3. 💾 Local Storage Persistence
   State Recovery: Implement a service to save the user's current timescale and scrollPosition to localStorage so the view persists after a page refresh.

Mock Data Sync: Cache generated mock data so work orders remain consistent across sessions.

4. 🧪 Robust Testing
   Unit Tests: Write Jasmine/Karma tests for the date-to-pixel calculation logic to ensure no "off-by-one" errors occur across different timezones.

E2E Tests: Implement Cypress or Playwright tests to simulate a user changing the zoom level and verifying the "Current Month" marker is still visible and correctly positioned.
