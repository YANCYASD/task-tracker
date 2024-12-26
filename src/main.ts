import { JsonDb } from "./DB/JsonDb";
import { TaskService } from "./service/taskService";
import { TaskStatus } from "./types/task";

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
        if (!args[0]) throw new Error("Description is required");
        await taskService.add(args[0]);
      }
      break;
    case "update":
      {
        if (!args[0]) throw new Error("Id(number) is required");
        if (!args[1]) throw new Error("Description is required");
        await taskService.update(Number(args[0]), args[1]);
      }
      break;
    case "delete":
      {
        if (!args[0]) throw new Error("Id(number) is required");
        await taskService.delete(Number(args[0]));
      }
      break;
    case "mark-in-progress":
      {
        if (!args[0]) throw new Error("Id(number) is required");
        await taskService.markInProgress(Number(args[0]));
      }
      break;
    case "mark-done":
      {
        if (!args[0]) throw new Error("Id(number) is required");
        await taskService.markInDone(Number(args[0]));
      }
      break;
    case "list":
      {
        if (!["done", "todo", "in-progress", undefined].includes(args[0]))
          throw new Error("Status is error");
        await taskService.list(args[0] as TaskStatus | undefined);
      }
      break;
    default:
      break;
  }
}

main();
