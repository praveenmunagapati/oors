import { Module } from 'oors';
import File from './services/File';
import FileRepository from './repositories/File';
import router from './router';
import createUploadMiddleware from './middlewares/upload';
import uploadSchema from './schemas/upload';

class FileStorage extends Module {
  static schema = {
    type: 'object',
    properties: {
      uploadDir: {
        type: 'string',
      },
    },
    required: ['uploadDir'],
  };

  name = 'oors.fileStorage';

  initialize({ uploadDir }) {
    this.uploadMiddleware = createUploadMiddleware({
      dest: uploadDir,
    });

    this.router = router({
      uploadMiddleware: this.uploadMiddleware,
    });

    this.export({
      createUploadMiddleware,
    });
  }

  async setup() {
    const [{ bindRepository }] = await this.dependencies(['oors.mongoDb']);

    const fileRepository = bindRepository(new FileRepository());
    const file = new File({
      uploadDir: this.getConfig('uploadDir'),
      FileRepository: fileRepository,
      validateUpload: this.manager.compileSchema(uploadSchema),
    });
    fileRepository.File = file;

    this.export({
      File: file,
      FileRepository: fileRepository,
    });
  }
}

export default FileStorage;
