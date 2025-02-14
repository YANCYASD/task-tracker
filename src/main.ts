import { JsonDb } from "./DB/JsonDb";
import { TaskService } from "./service/taskService";
import { TaskStatus } from "./types/task";

function validateArg(
  args: string[],
  index: number,
  errorMessage: string,
): string {
  if (!args[index]) throw new Error(errorMessage);
  return args[index];
}

function validateNumberArg(
  args: string[],
  index: number,
  errorMessage: string,
): number {
  const arg = validateArg(args, index, errorMessage);
  return Number(arg);
}

function validateTaskStatus(arg: string | undefined): TaskStatus | undefined {
  if (!["done", "todo", "in-progress", undefined].includes(arg))
    throw new Error("Status is error");
  return arg as TaskStatus | undefined;
}

async function main() {
  const jsonDb = new JsonDb();
  await jsonDb.init();
  const taskService = new TaskService(jsonDb);
  const cmdArgs = process.argv.slice(2);
  const action = cmdArgs[0];
  const args = cmdArgs.slice(1);
  switch (action) {
    case "add":
      {
        const description = validateArg(args, 0, "Description is required");
        await taskService.add(description);
      }
      break;
    case "update":
      {
        const id = validateNumberArg(args, 0, "Id(number) is required");
        const description = validateArg(args, 1, "Description is required");
        await taskService.update(id, description);
      }
      break;
    case "delete":
      {
        const id = validateNumberArg(args, 0, "Id(number) is required");
        await taskService.delete(id);
      }
      break;
    case "mark-in-progress":
      {
        const id = validateNumberArg(args, 0, "Id(number) is required");
        await taskService.markInProgress(id);
      }
      break;
    case "mark-done":
      {
        const id = validateNumberArg(args, 0, "Id(number) is required");
        await taskService.markInDone(id);
      }
      break;
    case "list":
      {
        const status = validateTaskStatus(args[0]);
        await taskService.list(status);
      }
      break;
    default:
      break;
  }
}

main();
