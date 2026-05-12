# Accessible Assignment Companion — Specification Document

## Project Overview

Build a responsive web application for college students that combines assignment tracking with gentle gamification through a virtual companion (“pet”).

The application is designed specifically to reduce cognitive overload and create a calmer productivity experience for students, especially those who struggle with executive dysfunction, stress, or overwhelming workloads.

The project should prioritize:

- accessibility
- clean UX
- responsive UI
- low cognitive load
- maintainable frontend architecture
- polished interaction design

This project is frontend-focused and portfolio-oriented.

---

# Core Product Goals

## Primary Goals

- Help students organize assignments clearly
- Reduce visual and cognitive overload
- Encourage task completion through supportive feedback
- Demonstrate accessibility-aware interface design
- Demonstrate frontend implementation skills

## Secondary Goals

- Showcase responsive UI development
- Showcase reusable component design
- Showcase accessibility implementation practices
- Create a strong UX/UI portfolio project

---

# Technical Constraints

## Important Scope Rules

DO NOT implement:

- backend/database systems
- authentication/login
- cloud sync
- multiplayer features
- AI integrations
- calendars
- notifications
- complex gamification systems
- currencies/XP/inventory systems
- advanced animations
- external APIs

This application should remain:

- frontend-only
- lightweight
- focused
- believable
- polished

---

# Recommended Technology Stack

## Framework

- React

## Styling

- Tailwind CSS

## UI Components

Recommended:

- shadcn/ui

Optional:

- Lucide React icons

---

# Accessibility Requirements

Accessibility is a core feature of the application, not an afterthought.

The application must include:

## Accessibility Features

- semantic HTML structure
- keyboard navigability
- visible focus states
- accessible button labels
- sufficient color contrast
- reduced motion support
- scalable text sizing
- responsive layout
- proper heading hierarchy

## Accessibility Testing

The project should be compatible with:

- Lighthouse accessibility audits
- Axe DevTools testing

---

# Application Structure

## Pages

### 1. Landing Page

Purpose:

- introduce the product
- explain the assignment companion concept
- provide a CTA to enter the dashboard

Sections:

- hero section
- short product explanation
- accessibility-focused messaging
- simple feature overview

---

### 2. Dashboard Page

Primary application interface.

Contains:

- assignment overview
- virtual companion section
- filters/categories
- accessibility controls access

---

# Core Features

## Assignment Management

Users can:

- create assignments
- edit assignments
- delete assignments
- mark assignments complete

Each assignment should include:

- title
- class/course name
- due date
- workload level

---

# Workload System

Instead of generic priority labels, use cognitive-load-oriented labels.

## Allowed Workload Levels

- Light
- Moderate
- Heavy
- Overwhelming

These should affect:

- assignment visual indicators
- companion emotional state calculations

---

# Assignment Card Requirements

Each assignment card should display:

- assignment title
- class name
- due date
- workload label
- completion checkbox/button

Optional:

- overdue status indicator

Cards should:

- remain visually clean
- avoid clutter
- prioritize readability

---

# Virtual Companion System

## Purpose

The companion acts as emotional feedback for workload balance and productivity consistency.

The companion should feel:

- supportive
- calming
- non-punitive

Avoid:

- guilt-based interactions
- aggressive negative feedback
- childish aesthetics

---

# Companion Rules

The companion should NOT:

- require feeding
- have inventories
- use currencies
- level up
- contain mini-games
- evolve
- include complex simulation systems

The companion only reacts to:

- completed assignments
- overdue assignments
- overall workload state

---

# Companion States

The companion has 4 emotional states.

## 1. Thriving

Trigger:

- low overdue assignments
- strong completion rate

Visuals:

- happy
- energetic
- relaxed

---

## 2. Stable

Trigger:

- manageable workload
- moderate completion progress

Visuals:

- neutral
- calm

---

## 3. Stressed

Trigger:

- several overdue assignments
- rising workload pressure

Visuals:

- tired
- concerned
- low energy

---

## 4. Overwhelmed

Trigger:

- many overdue assignments
- excessive heavy workload

Visuals:

- exhausted
- withdrawn
- discouraged

---

# Companion Placement

Recommended:

- dashboard sidebar
OR
- dedicated dashboard card

The companion should:

- remain visible
- not dominate the interface
- avoid excessive animation

---

# Animation Guidelines

Allowed:

- subtle floating
- blinking
- breathing
- soft transitions

Avoid:

- exaggerated movement
- distracting motion
- rapid animations

Must support:

- reduced motion accessibility settings

---

# Accessibility Settings Panel

Create a dedicated accessibility/settings modal or panel.

## Required Settings

### 1. Text Scaling

Allow users to increase text size.

---

### 2. High Contrast Mode

Provide improved visual contrast.

---

### 3. Reduced Motion Toggle

Disable non-essential animations/transitions.

---

# Responsive Design Requirements

The application must support:

- desktop
- tablet
- mobile

## Mobile Requirements

- stacked layouts
- touch-friendly controls
- readable spacing
- simplified navigation

---

# UI/UX Design Direction

## Visual Tone

The interface should feel:

- calm
- modern
- supportive
- minimal
- low-stress

Avoid:

- excessive gradients
- clutter
- visually noisy layouts
- gaming-heavy aesthetics

---

# Typography

Prioritize:

- readability
- spacing
- hierarchy
- accessibility

---

# Color Usage

Use:

- soft neutrals
- accessible contrast ratios
- calm accent colors

Avoid:

- oversaturated palettes
- visually overwhelming combinations

---

# Suggested Component Architecture

## Components

### Layout

- Navbar
- Sidebar
- DashboardLayout

### Assignments

- AssignmentCard
- AssignmentList
- AssignmentForm
- WorkloadBadge

### Companion

- CompanionCard
- CompanionStateDisplay

### Accessibility

- AccessibilityPanel
- ToggleSwitch
- TextSizeControls

### Shared

- Button
- Modal
- Card
- EmptyState

---

# Suggested State Structure

Example frontend state categories:

```
assignments
accessibilitySettings
companionState
filters
uiState
```

---

# Companion State Logic

The companion state should be calculated automatically.

Example factors:

- overdue assignment count
- number of completed assignments
- quantity of “Heavy” or “Overwhelming” tasks

Logic should remain simple and understandable.

---

# Suggested Empty States

Examples:

- “No assignments yet.”
- “You’re all caught up.”
- “Your workload looks manageable today.”

Tone should remain:

- supportive
- calm
- encouraging

Avoid:

- shame-based messaging
- stressful language

---

# Portfolio Expectations

The final project should be suitable for:

- UX/UI portfolio presentation
- accessibility-focused portfolio presentation
- frontend/UI developer portfolio presentation

---

# Deliverables

## Required Deliverables

### Functional Web Application

Responsive and interactive frontend.

---

### Accessibility Audit

Include:

- Lighthouse accessibility screenshots
- accessibility notes

---

### Portfolio Case Study

Document:

- problem statement
- user goals
- accessibility considerations
- wireframes
- implementation decisions
- reflection/lessons learned

---

# Non-Goals

This project is NOT intended to:

- become a production SaaS product
- compete with full productivity apps
- contain enterprise-scale functionality

The goal is:

- focused execution
- thoughtful UX
- accessible frontend implementation
- professional portfolio quality