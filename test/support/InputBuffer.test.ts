
import { InputBuffer } from "../../src/support/InputBuffer";
import { Config } from "../../src/constant/Config";

describe("------------------------------InputBuffer------------------------------", () => {
    // なぜ：毎回リセットしテストを行うため
    let buffer: InputBuffer;
    beforeEach(() => {
        buffer = new InputBuffer(Config.MAX_EXP_DIGITS);
    });

    test("ケース: ユーザー入力が８桁に制限されているか", () => {
        for (let i = 0; i < 9; i++) {   // 9桁目無視
            buffer.pushDigit("1");
        }

        expect(buffer.toString()).toBe("11111111");
    });

    test("ケース: １つの項の中で「.」の２つ目入力を無視する-パターン1-", () => {
        buffer.pushDigit("1");
        buffer.pushDecimal();
        buffer.pushDecimal();
        expect(buffer.toString()).toBe("1.");
    });

    test("ケース: １つの項の中で「.」の２つ目入力を無視する-パターン2-", () => {
        buffer.pushDigit("3");
        buffer.pushDecimal();
        buffer.pushDigit("7");
        buffer.pushDecimal();
        buffer.pushDigit("1");
        expect(buffer.toString()).toBe("3.71");
    });

    test("ケース: 先頭が 「0」 で次に数字が入力された時、上書きされるか", () => {
        buffer.pushDigit("0");
        buffer.pushDigit("1");
        expect(buffer.toString()).toBe("1");
    });

    test("ケース: pushDecimal()で 最初の入力が「.」で「0.」補完されるか", () => {
        buffer.pushDecimal();
        expect(buffer.toString()).toBe("0.");
    });

    test("ケース: clear()で空文字になるか", () => {
        buffer.pushDigit("1");
        buffer.clear();
        expect(buffer.toString()).toBe("");
    });

    test("ケース: toNumber()で number型になるか", () => {
        buffer.pushDigit("1");
        buffer.pushDigit("2");
        expect(buffer.toNumber()).toBe(12);
    });

    test("ケース: digitCount()で「./-」が押下されたとしても「./-」を含まずにユーザー入力が８桁に制限されているか", () => {
        buffer.pushDigit("2");
        buffer.pushDecimal();
        for (let i = 0; i < 8; i++) {
            buffer.pushDigit("1");
        }
        expect(buffer.digitCount()).toBe(8);
    });

    test("ケース: 「小数点・空・NaN・符号」 を含まない文字列で 値があるかどうか-パターン1-", () => {
        expect(buffer.hasValue()).toBe(false);    // 最初は「false」設定になっているか
        // 数字のケース
        buffer.pushDigit("1");
        expect(buffer.hasValue()).toBe(true);
    });
    test("ケース: 「小数点・空・NaN・符号」 を含まない文字列で 値があるかどうか-パターン2-", () => {
        expect(buffer.hasValue()).toBe(false);    // 最初は「false」設定になっているか
        // それ以外のケース
        buffer.pushDigit(".");
        expect(buffer.hasValue()).toBe(false);
    });
});