# Project Specification: Package Tracking Viewer

## 1. Project Overview
Build a simple, professional web application for customers of Yellow Corporation to display a list of orders/parcels along with relevant tracking details.

## 2. Tech Stack & Architectural Rules
* **Framework:** ReactJS (lasr verstion) is mandatory. used react router
* **Language:** Strictly TypeScript. Provide rigorous typing for all API responses and component props.
* **Styling:** Tailwind CSS. Ensure a highly responsive UI/UX supporting both major mobile and desktop layouts.
* **Dependencies:** Use only the latest public stable versions of libraries and tools.
* **Code Quality:** AI-optimized coding style. Keep components strictly functional, utilize modern hooks, and ensure a clean, modular architecture.

## 3. Mandatory Requirements (Task 1)
* Fetch data from the following API Endpoint: `https://my.api.mockaroo.com/orders.json?key=e49e6840`.
* Display a list of orders containing key details such as order status, ETAs, and pickup locations.
* Implement a clean, intuitive UI/UX tailored for this specific use-case.

## 4. Optional Requirement (Task 2): Scaling & i18n
* Briefly describe or partially implement a scaling strategy to support multiple countries and languages.
* *Agent Instruction:* Scaffold an i18n structure (e.g., Next.js dictionary pattern or `next-intl`) to demonstrate capability without over-engineering.

## 5. Deliverables & Documentation
The repository must be hosted on GitHub (or another cloud-based repository) and include a comprehensive README file. The README must contain:
* Clear project setup, run, and deployment instructions.
* A list of project dependencies and architectural design considerations.
* A clearly outlined testing strategy and approach.

## 6. Execution Instructions for AI Agent
1.  Initialize the Next.js project with Tailwind CSS and TypeScript.
2.  Define the TypeScript interfaces based on the provided Mockaroo API endpoint payload.
3.  Build the data-fetching layer (utilizing Server Components where optimal).
4.  Develop the responsive UI components for the parcel list and detail views.
5.  Draft the README.md addressing all required points.
6.  Ensure the final output remains simple, professional, and within the 4-5 hour scope constraint[cite: 22, 23].