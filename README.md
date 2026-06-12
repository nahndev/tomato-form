# TOMATO (302) - Form Service

## Overview

TOMATO is a workflow-driven form platform designed to facilitate communication and collaboration across departments within an organization.

It enables teams to create structured processes where multiple users can contribute, review, approve, and enrich information throughout the lifecycle of a form submission.

All submissions are organized and tracked through management boards, providing visibility and control over business processes.

---

## Core Features

### Form Builder

Create and customize forms for a wide range of business processes.

Features include:

- Support for multiple field types and data formats
- Multi-step workflows
- Conditional logic and branching
- User assignments and role-based interactions
- Approval and confirmation stages
- Collaboration between multiple participants within the same process

---

### Shared Data Management

Manage centralized datasets that can be reused across forms and workflows.

Examples:

- Employees
- Departments
- Projects
- Customers
- Vendors

Capabilities:

- Reusable reference data
- Relationships between datasets
- Automatic synchronization and updates
- Workflow automation based on shared data

---

### Management Boards

Organize and monitor form submissions through configurable boards.

Features include:

- Board-based organization
- Advanced search and filtering
- Status tracking
- Process monitoring
- Team collaboration and oversight

---

## Typical Workflow

1. A manager creates a form and defines the workflow.
2. User A submits initial information.
3. User B reviews or provides additional details.
4. User C receives notifications and continues the process.
5. The submission progresses through predefined workflow stages.
6. All activities are tracked and managed through boards.

---

## Purpose

TOMATO aims to become a unified platform for internal business processes, replacing fragmented communication channels with structured, traceable, and collaborative workflows.

---

# Project Structure

Using [CLAUDE](./CLAUDE.md) for frontend and backend development.

- `website/` - React frontend application
- `server/` - NestJS backend application

# Ports

- Frontend: `http://localhost:3021`
- Backend: `http://localhost:3022`
