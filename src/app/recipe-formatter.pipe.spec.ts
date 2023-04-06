import { RecipeFormatterPipe } from './recipe-formatter.pipe';

describe('RecipeFormatterPipe', () => {
  it('create an instance', () => {
    const pipe = new RecipeFormatterPipe();
    expect(pipe).toBeTruthy();
  });
});
