import {loginSchema, taskSchema} from '../src/utils/validation';

describe('validation schemas', () => {
  it('validates login email and password', () => {
    const result = loginSchema.safeParse({
      email: 'user@test.com',
      password: 'secret1',
    });
    expect(result.success).toBe(true);
  });

  it('rejects empty task title', () => {
    const result = taskSchema.safeParse({title: '', description: ''});
    expect(result.success).toBe(false);
  });
});
