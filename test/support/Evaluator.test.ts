
import { Evaluator } from "../../src/support/Evaluator";
import { Operation } from "../../src/constant/Operation";
import { DivisionByZeroError } from "../../src/error/DivisionByZeroError";

describe("------------------------------Evaluator------------------------------", () => {
    const evaluator = new Evaluator();

    test("ケース: 四則演算(加算) を正しく処理できるか", () => {
        expect(evaluator.operatorSwitch(10, Operation.Add, 5)).toBe(15);
    });

    test("ケース: 四則演算(減算) を正しく処理できるか", () => {
        expect(evaluator.operatorSwitch(10, Operation.Subtract, 5)).toBe(5);
    });

    test("ケース: 四則演算(乗算) を正しく処理できるか", () => {
        expect(evaluator.operatorSwitch(10, Operation.Multiply, 5)).toBe(50);
    });

    test("ケース: 四則演算(除算) を正しく処理できるか", () => {
        expect(evaluator.operatorSwitch(10, Operation.Divide, 5)).toBe(2);
    });

    test("ケース: 「0」で割った時に throw が投げられるか", () => {
        expect(() => evaluator.operatorSwitch(10, Operation.Divide, 0)).toThrow(DivisionByZeroError);
        expect(() => evaluator.operatorSwitch(10, Operation.Divide, 0)).toThrow("Divide by zero");
    });
});