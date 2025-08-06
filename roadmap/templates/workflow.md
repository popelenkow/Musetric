---
read_first_completely: 'roadmap/templates/rules.md'
---

# Task Workflow

This document describes the standard process for managing tasks in the roadmap system.

## Task Commands

When working with roadmap tasks:

- `run planning [descriptive-task-id]` - Execute ONLY the Planning step
- `run coding [descriptive-task-id]` - Execute ONLY the Coding step
- `run checking [descriptive-task-id]` - Execute ONLY the Checking step
- `run [descriptive-task-id]` - Execute the entire task (all steps)

## Creating a New Task

When you need to create a new task:

1. Use `roadmap/templates/task.md` as your template
2. Create the new task file in `roadmap/tasks/[descriptive-task-id].md`
3. Fill in the template placeholders

## Working on a Task

During task execution:

1. Open the relevant task file from `roadmap/tasks/[descriptive-task-id].md`
2. **Planning**: analyze requirements, create specific action items for Coding step
   - Research existing code and identify all files that need changes
   - Replace the `[Will be populated during Planning step]` text in Coding section with detailed action items
   - Each Coding action item must include: `- [ ] [specific action] to [full/path/from/repo/root/to/file.ext]`
   - Always use full paths from repository root, not relative paths
3. **Coding**: implement the actual code changes in the repository
   - Follow the specific action items created in Planning step
   - Mark each item as complete when finished
4. **Checking**: run quality checks and tests

## Completing a Task

When all work is finished:

1. Verify all steps are marked as complete
2. Remove the task file from `roadmap/tasks/`
