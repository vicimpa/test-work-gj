import { deserializer, serializer } from ".";
import { expect, it, test } from "bun:test";

const random = (min = 1, max = 300) => {
  return Math.random() * (max - min) + min | 0;
};

const rsort = <T>(array: T[]) => {
  const copy = array.slice();
  const output: T[] = [];

  while (copy.length) {
    output.push(
      ...copy.splice(random(0, copy.length), 1)
    );
  }

  return output;
};

const array = <T>(length: number, fn: (index: number) => T) => {
  return Array.from({ length }, (_, i) => fn(i));
};

const oneTest = (input: number[]) => {
  const json = JSON.stringify(input);
  const serial = serializer(input);
  const result = deserializer(serial);

  expect(input, "Валидность").toEqual(result);
  expect(true, "Степерь сжатия меньше 50%").toBe(.5 >= serial.length / json.length);
};

test("Простейшие короткие", () => {
  oneTest([2, 3, 5, 7, 11, 13, 17, 19, 23, 29]);
});

test("Случайные 50 чисел", () => {
  oneTest(array(50, () => random()));
});

test("Случайные 100 чисел", () => {
  oneTest(array(100, () => random()));
});

test("Случайные 500 чисел", () => {
  oneTest(array(500, () => random()));
});

test("Случайные 1000 чисел", () => {
  oneTest(array(1000, () => random()));
});

test("Граничные - все числа 1 знака", () => {
  oneTest(array(100, () => random(1, 9)));
});

test("Все числа из 2х знаков", () => {
  oneTest(array(100, () => random(10, 99)));
});

test("Все числа из 3х знаков", () => {
  oneTest(array(100, () => random(100, 300)));
});

test("Каждого числа по 3 - всего чисел 900", () => {
  const src = array(300, (i) => i + 1);
  const nums = rsort([...src, ...src, ...src]);
  oneTest(nums);
});