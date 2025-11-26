
import { TOKEN_KIND, KeyToken } from "../../src/token/KeyToken";
import { Operation } from "../../src/constant/Operation";

// describeによるグループ化(テストの可読性とメンテナンス性の向上)
describe("------------------------------KeyToken------------------------------", () => {
    test("ケース : TOKEN_KIND の値が正しいか", () => {
        expect(TOKEN_KIND.DIGIT).toBe("digit");
        expect(TOKEN_KIND.DECIMAL).toBe("decimal");
        expect(TOKEN_KIND.OP).toBe("op");
        expect(TOKEN_KIND.EQUAL).toBe("equal");
        expect(TOKEN_KIND.CLEAR).toBe("clear");
    });

    test("ケース : 数字 KeyTokenが正しく生成できるか", () => {
        const token: KeyToken = {kind: TOKEN_KIND.DIGIT,
            value: 1,
        };

        expect(token.kind).toBe("digit");
        expect(token.value).toBe(1);
    });

    test("ケース : 小数点 KeyTokenが正しく生成できるか", () => {
        const token: KeyToken = {
            kind: TOKEN_KIND.DECIMAL,
        };

        expect(token.kind).toBe("decimal");
    });

    test("ケース : 演算子 KeyTokenが正しく生成できるか", () => {
        const token: KeyToken = {
            kind: TOKEN_KIND.OP,
            value: Operation.Add,
        };

        expect(token.kind).toBe("op");
        expect(token.value).toBe(Operation.Add);
    });

    test("ケース : 「=」 KeyTokenが正しく生成できるか", () => {
        const token: KeyToken = {
            kind: TOKEN_KIND.EQUAL,
        };

        expect(token.kind).toBe("equal");
    });

    test("ケース : 「C」 KeyTokenが正しく生成できるか", () => {
        const token: KeyToken = {
            kind: TOKEN_KIND.CLEAR,
        };

        expect(token.kind).toBe("clear");
    });
});