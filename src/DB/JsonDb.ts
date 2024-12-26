import path from "node:path";
import fs from "node:fs/promises";
import { iTask, TaskStatus } from "../types/task";

class FileSystem {
  private filePath: string;
  public isAccess: boolean = false;
  constructor(filePath: string = path.resolve(__dirname, "db.json")) {
    this.filePath = filePath;
  }

  async getFilePath() {
    return this.filePath;
  }

  async writeFile(data: iTask[]) {
    await fs.writeFile(this.filePath, JSON.stringify(data));
  }

  async readFile(): Promise<iTask[]> {
    if (!this.isAccess) throw new Error("File had losed");
    const data = await fs.readFile(this.filePath, "utf8");
    return JSON.parse(data);
  }

  async checkFile() {
    try {
      await fs.access(this.filePath);
    } catch (err) {
      if (err instanceof Error && "code" in err && err.code === "ENOENT") {
        await this.writeFile([]);
      } else {
        console.error(err);
        throw err;
      }
    } finally {
      this.isAccess = true;
    }
  }
}

export class JsonDb {
  private fileSystem: FileSystem;

  constructor() {
    this.fileSystem = new FileSystem();
  }

  async init() {
    await this.fileSystem.checkFile();
  }

  async findAll(): Promise<iTask[]> {
    return await this.fileSystem.readFile();
  }

  async findById(id: iTask["id"]): Promise<iTask | undefined> {
    const datas = await this.fileSystem.readFile();
    return datas.find((data) => data.id === id);
  }

  async findByStatus(status: iTask["status"]): Promise<iTask[]> {
    const datas = await this.fileSystem.readFile();
    return datas.filter((data) => data.status === status);
  }

  async create(description: iTask["description"]): Promise<iTask> {
    const datas = await this.fileSystem.readFile();
    let maxId = 0;
    if (datas.length !== 0) {
      maxId = Math.max(...datas.map((data) => data.id));
    }
    const newTask: iTask = {
      id: maxId + 1,
      description,
      status: TaskStatus.TODO,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    datas.push(newTask);
    await this.fileSystem.writeFile(datas);
    return newTask;
  }

  async deleteById(id: iTask["id"]): Promise<iTask | null> {
    const datas = await this.fileSystem.readFile();
    const index = datas.findIndex((data) => data.id === id);
    if (index === -1) return null;
    const deletedTask = datas.splice(index, 1)[0];
    await this.fileSystem.writeFile(datas);
    return deletedTask;
  }

  async updateById(
    id: iTask["id"],
    data: Partial<iTask>,
  ): Promise<iTask | null> {
    const datas = await this.fileSystem.readFile();
    const index = datas.findIndex((data) => data.id === id);
    if (index === -1) return null;
    datas[index] = { ...datas[index], ...data, updatedAt: new Date() };
    await this.fileSystem.writeFile(datas);
    return datas[index];
  }
}
