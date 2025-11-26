
import { NumberFormatter } from "../../src/support/NumberFormatter";
import { Config } from "../../src/constant/Config";

describe("------------------------------NumberFormatter------------------------------", () => {
    const formatter = new NumberFormatter(Config.MAX_EXP_DIGITS);

    test("ケース: 値が NaN であれば、「エラー」を表示できるか", () => {
        expect(formatter.formatForDisplay(NaN)).toBe("エラー");
    });

    test("ケース: 小数点以下8桁が丸めた結果になっているか", () => {
        expect(formatter.formatForDisplay(19.9999998)).toBe("2.0000000e+1");
        // 「9.9999999」+「9.9999999」=
    });

    test("ケース: マイナスの値でも丸めた結果になっているか", () => {
        expect(formatter.formatForDisplay(-19.9999998)).toBe("-2.0000000e+1");
        // 「-9.9999999」+「-9.9999999」=
    });

    test("ケース: 計算結果が小数7桁境界であっても期待結果通りに表示されるか", () => {
        expect(formatter.formatForDisplay(1.00000000)).toBe("1");
        // 「0.9999999」+「0.0000001」=
    });

    test("ケース: 末尾の「0」が削除されるか", () => {
        expect(formatter.formatForDisplay(1.234000)).toBe("1.234");
    });

    test("ケース: 小数点以降が「0」だけの場合、「0」は削除されるか", () => {
        expect(formatter.formatForDisplay(1.000)).toBe("1");
    });

    test("ケース: 小さな値でも末尾「0」が削除されるか", () => {
        expect(formatter.formatForDisplay(0.1000)).toBe("0.1");
    });

    test("ケース: 計算結果が8桁を超える場合、指数表記で表示されるか", () => {
        expect(formatter.formatForDisplay(100000000)).toMatch("1.0000000e+8");
        // 「99,999,999」+「1」=
    });

    test("ケース: 指数表記で表示された場合、小数点以下の0も表示されているか", () => {
        expect(formatter.formatForDisplay(100000099)).toMatch("1.0000010e+8");
        // 「99,999,999」+「100」=
    });
});