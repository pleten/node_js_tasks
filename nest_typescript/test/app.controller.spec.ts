import { Test, TestingModule } from '@nestjs/testing';
import { TeaController } from '../src/tea/tea.controller';
import { CreateTeaDto } from '../src/tea/dto/create-tea.dto';
import { TeaService } from '../src/tea/tea.service';

describe('AppController', () => {
  let teaController: TeaController;
  let createdTea;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [TeaController],
      providers: [TeaService],
    }).compile();

    teaController = app.get<TeaController>(TeaController);
  });

  describe('root', () => {
    it('should create and return new tea record', async () => {
      const newTea: CreateTeaDto = {
        name: 'Green Tea',
        origin: 'Ceylon',
        rating: 8,
      };
      createdTea = await teaController.create(newTea);
      expect(createdTea.id).toBeTruthy();
      expect(createdTea.name).toBe('Green Tea');
      expect(createdTea.origin).toBe('Ceylon');
      expect(createdTea.rating).toBe(8);
    });

    it('should return valid tea list', async () => {
      const newTea: CreateTeaDto = {
        name: 'Green Tea',
        origin: 'Ceylon',
        rating: 8,
      };
      createdTea = await teaController.create(newTea);
      const expectedResult = {
        teas: [createdTea],
        pagination: {
          page: 1,
          pageSize: 100,
          total: 1,
        },
      };
      const response = await teaController.findAll();
      expect(response).toEqual(expectedResult);
    });
  });
});
