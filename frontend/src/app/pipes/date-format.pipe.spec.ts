import { DateFormatPipe } from './date-format.pipe';

describe('DateFormatPipe', () => {
  it('format date', () => {
    const pipe = new DateFormatPipe();
    expect(pipe).toBeTruthy();
    expect(pipe.transform(new Date(1691164518))).toBe(
      '1691164518 (Aug 05, 2023 12:55:18 JST)'
    );
  });
});
