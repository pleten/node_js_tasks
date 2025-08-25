import { ProfileService } from './profile.service';
import { Profile } from './entities/profile.entity';

describe('Profile Service', () => {

  beforeAll(() => jest.useFakeTimers());

  afterEach(() => jest.getRealSystemTime());

  describe('Profile', () => {
    it('should return newly created user', () => {
      const profileService = new ProfileService();
      jest.setSystemTime(new Date(1_000_000));
      const user = {
        email: 'test@example.com',
        displayName: 'John Doe',
        age: 20,
      };
      const createduser = profileService.create(user);
      expect(createduser).toHaveProperty('id');
      expect(createduser.id).toBe(1_000_000);
      expect(createduser.email).toBe('test@example.com');
      expect(createduser.displayName).toBe('John Doe');
      expect(createduser.age).toBe(20);
    });

    it('should throw error on email duplicate', () => {
      const profileService = new ProfileService();
      const user = {
        email: 'test@example.com',
        displayName: 'John Doe',
        age: 20,
      };
      profileService.create(user);
      try {
        profileService.create({
          email: 'test@example.com',
          displayName: 'John Doe',
          age: 20,
        });
      } catch (e) {
        expect(e.message).toBe('Email is already registered');
      }
    });

    it('should return profile by id', () => {
      const profileService = new ProfileService();
      jest.setSystemTime(new Date(1_000_000));
      const user = {
        email: 'test@example.com',
        displayName: 'John Doe',
        age: 20,
      };
      profileService.create(user);
      expect(profileService.findById(1_000_000)).toEqual({
        id: 1_000_000,
        ...user
      });
    });

    it('should throw error for not existing id', () => {
      const profileService = new ProfileService();
      try {
        profileService.findById(111);
      } catch (e) {
        expect(e.message).toBe('Profile not found');
      }
    });

    it('should return all profiles', () => {
      const profileService = new ProfileService();
      jest.setSystemTime(new Date(1_000_000));
      const user1 = {
        email: 'test@example.com',
        displayName: 'John Doe',
        age: 20,
      };
      profileService.create(user1);
      jest.setSystemTime(new Date(1_001_000));
      const user2 = {
        email: 'test2@example.com',
        displayName: 'Jane Doe',
      }
      profileService.create(user2);
      expect(profileService.findAll()).toEqual([
        {id: 1_000_000, ...user1},
        {id: 1_001_000, ...user2},
      ]);
    });
  });
});
