import { Module } from '../../../../../packages/oors';
import { wrapHandler } from '../../../../../packages/oors-router/src/libs/helpers';
import TaskRepositoryClass from './repositories/Task';

class TodoModule extends Module {
  name = 'todo';

  async setup() {
    const [{ bindRepository }, { router }] = await this.dependencies([
      'oors.mongoDb',
      'oors.router',
    ]);

    const TaskRepository = bindRepository(new TaskRepositoryClass());

    router.get('/tasks', wrapHandler(() => TaskRepository.findMany().then(c => c.toArray())));

    this.export({
      TaskRepository,
    });
  }
}

export default TodoModule;
