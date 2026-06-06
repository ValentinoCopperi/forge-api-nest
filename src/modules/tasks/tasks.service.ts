import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/shared/prisma';

@Injectable()
export class TasksService {

    constructor(private readonly prisma: PrismaService) {}

    private readonly tasks: { id: number, title: string, userId: number }[] = [];

    getAllTasks() {
        return this.prisma.user.findMany();
    }


    createTask(data: { title: string, userId: number }) {
        const newTask = {
            id: this.tasks.length + 1,
            title: data.title,
            userId: data.userId
        };
        this.tasks.push(newTask);
        return newTask;
    }


}
