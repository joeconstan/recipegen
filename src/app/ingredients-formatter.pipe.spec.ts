import { IngredientsFormatterPipe } from './ingredients-formatter.pipe';

describe('IngredientsFormatterPipe', () => {
  it('create an instance', () => {
    const pipe = new IngredientsFormatterPipe();
    expect(pipe).toBeTruthy();
  });
});
