# AI-Driven Development Workflow

This document defines the agentic coding workflow for the Baozi HSK 3 project. It outlines how AI agents and human developers collaborate to build, verify, and maintain the application in a structured, predictable manner.

## Core Workflow Loop

The development process follows a strict 4-step loop: **Spec → Dev → Verify → Build**

### 1. Spec (Planning & Definition)
Before any code is written, the requirements must be explicitly defined.
- **Action**: The human provides a goal (e.g., "Add a search feature to the Vocabulary tab").
- **Agent Task**: The AI agent analyzes the request, reads existing specs (e.g., `docs/DESIGN_SPEC.md` and relevant `docs/tabs/*.md`), and *updates the spec* with the proposed changes (UI layout, data models, behavior flow).
- **Rule**: No code changes are made until the spec clearly outlines the feature.

### 2. Dev (Implementation)
Once the spec is updated and agreed upon, implementation begins.
- **Action**: The AI agent implements the code strictly adhering to the updated spec.
- **Agent Task**: 
  - Write or modify React components (using existing Tailwind `ios-card` and mobile-first principles).
  - Update data models or learning logic (`lib/`).
  - Add or update Playwright E2E tests in the `tests/` directory to cover the new functionality.

### 3. Verify (Testing & Linting)
Code must be validated before it is considered complete.
- **Action**: Run the unified verification suite.
- **Command**: `npm run verify`
  - Runs `npm run typecheck` (`tsc --noEmit`) to catch TypeScript errors.
  - Runs `npm run lint` (`eslint .`) to enforce code style.
  - Runs `npm run test:e2e` (`playwright test`) to run end-to-end browser tests.
- **Agent Task**: If `npm run verify` fails, the AI agent must autonomously read the error logs, diagnose the issue, apply a fix, and re-run the verification until it passes.

### 4. Build (Production Readiness)
The final step ensures the application builds successfully for production deployment.
- **Action**: Run the Next.js build process.
- **Command**: `npm run build`
- **Agent Task**: Verify that the production build succeeds without static generation errors or route misconfigurations.

## E2E Testing Guidelines (Playwright)
- Place all tests in the `tests/` directory.
- Test names should clearly describe the behavior (e.g., `'vocabulary progressive hints work correctly'`).
- Tests must interact with the application as a real user would (e.g., clicking 'I Know', 'Don't Know', and verifying text changes or page navigation).
- During development, you can use `npm run test:e2e:ui` to open the Playwright UI mode for easier debugging.

## Invoking the Agent
When interacting with the AI agent, use prompts that trigger this workflow:
*Example:* "I want to add a feature to reset progress on the Dashboard. Please follow the AI Workflow to spec it out, implement it, and verify it."
