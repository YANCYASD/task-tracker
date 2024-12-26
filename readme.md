```Bash
npm install
npm build
```



```Bash
# Adding a new task
npm run start add "Buy groceries"
# Output: Task added successfully (ID: 1)

# Updating and deleting tasks
npm run start update 1 "Buy groceries and cook dinner"
npm run start delete 1

# Marking a task as in progress or done
npm run start mark-in-progress 1
npm run start mark-done 1

# Listing all tasks
npm run start list

# Listing tasks by status
npm run start list done
npm run start list todo
npm run start list in-progress
```