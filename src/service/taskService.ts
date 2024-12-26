import { JsonDb } from "../DB/JsonDb";
import { iTask, TaskStatus } from "../types/task";

export class TaskService {
  private jsonDb: JsonDb;
  constructor(jsonDb: JsonDb) {
    this.jsonDb = jsonDb;
  }

  async add(description: iTask["description"]) {
    const task = await this.jsonDb.create(description);
    console.log(`Task added successfully (ID: ${task.id})`);
  }

  async update(id: iTask["id"], description: iTask["description"]) {
    const task = await this.jsonDb.updateById(id, { description });
    console.log(task);
  }

  async delete(id: iTask["id"]) {
    const task = await this.jsonDb.deleteById(id);
    console.log(task);
  }

  async markInProgress(id: iTask["id"]) {
    const task = await this.jsonDb.updateById(id, {
      status: TaskStatus.IN_PROGRESS,
    });
    console.log(task);
  }

  async markInDone(id: iTask["id"]) {
    const task = await this.jsonDb.updateById(id, {
      status: TaskStatus.DONE,
    });
    console.log(task);
  }

  async list(status?: TaskStatus) {
    const tasks = await this.jsonDb.findAll();
    if (status) {
      const filteredTasks = tasks.filter((task) => task.status === status);
      console.log(filteredTasks);
    } else {
      console.log(tasks);
    }
  }
}
