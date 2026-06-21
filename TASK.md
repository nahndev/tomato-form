# Build Job feature for my project

## Overview

- Job feature is design to run automated tasks in the background.

## Backend

- [x] Create `Job` schema in the database.

- [x] Create `CronJob` model to scroll same cron jobs.
- [x] Create `JobRunner` service to run jobs in the background.
- [x] Create `JobScheduler` service to schedule jobs based on cron expressions.

- [x] `Job` should include `action`.
- [x] Create `Action` model to define what action should be performed by the job.
- [x] Create `SubmissionCreationAction` model extend from `Action` include `template` and `board` to create `submission` base on template and board.
- [x] When `JobRunner` run a job, create new `JobExecution` record to track the execution of the job.

## Frontend

- [x] In `JobList`, add button to create new job.
- [x] In `JobCreatorDialog`
  - [x] Add form to create new job.
  - [x] Add UI to design cron expression.
  - [x] Default is `SubmissionCreationAction`
  - [x] Add form to select `template` and `board` for `SubmissionCreationAction`.

- [x] In `JobList`, shown list of jobs with their status and next run time.
- [x] In `JobDetail`, show the job details and its execution history.

## Tasks 01

- [x] Schema `Job` should is `CronJob`
- [x] Schema `Job`, `action` -> `actions` (array)
- [x] Every `action` should have `type` field and other field. For example,, `SubmissionCreationAction` should have `template` and `board` field.
- [x] `JobRunner` should run all actions in the job when the job is triggered
- [x] In `JobCreatorDialog`, allow user to add multiple actions for a job.
- [x] `actions` run sequentially.
- [x] Add `ActionRunner` service, every `action` have `type` and return `<Type>ActionRunner` to run the action. For example, `SubmissionCreationAction` return `SubmissionCreationActionRunner` to run the action.
- [x] ActionRunner return result, and the result of previous action can be used in the next action. For example, `SubmissionCreationActionRunner` return created `submission` id, and the next action can use this id to do something.
