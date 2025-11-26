
import { KeyMapper } from "../../src/input/KeyMapper";
import { TOKEN_KIND } from "../../src/token/KeyToken";
import { Operation } from "../../src/constant/Operation";

// public resolve(target: HTMLElement): KeyToken | undefined { ... } の引数target作成
function mockButton(key: string): HTMLElement {
    const btn = document.createElement("button");
    btn.dataset.key = key;
    btn.innerText = key;
    return btn;
}

describe("------------------------------KeyMapper------------------------------", () => {
    // テストの準備や初期化を各テストの前に毎回行う(変数の初期化、モックの作成など)→これにより、各テストケースが同じ状態からスタートできる
    // beforeEach(() => {
    const mapper = new KeyMapper();

    test("ケース: 数字 を正しく取得できるか", () => {
        const btn = mockButton("5");
        const token = mapper.resolve(btn);

        expect(token).toEqual({ kind: TOKEN_KIND.DIGIT, value: 5 });
    });

    test("ケース: 小数点 を正しく取得できるか", () => {
        const btn = mockButton(".");
        const token = mapper.resolve(btn);

        expect(token).toEqual({ kind: TOKEN_KIND.DECIMAL });
    });

    test("ケース: 「+」 を正しく取得できるか", () => {
        const btn = mockButton("+");
        const token = mapper.resolve(btn);

        expect(token).toEqual({ kind: TOKEN_KIND.OP, value: Operation.Add });
    });

    test("ケース: 「-」 を正しく取得できるか", () => {
        const btn = mockButton("-");
        const token = mapper.resolve(btn);

        expect(token).toEqual({ kind: TOKEN_KIND.OP, value: Operation.Subtract });
    });

    test("ケース: 「*」 を正しく取得できるか", () => {
        const btn = mockButton("*");
        const token = mapper.resolve(btn);

        expect(token).toEqual({ kind: TOKEN_KIND.OP, value: Operation.Multiply });
    });

    test("ケース: 「/」 を正しく取得できるか", () => {
        const btn = mockButton("/");
        const token = mapper.resolve(btn);

        expect(token).toEqual({ kind: TOKEN_KIND.OP, value: Operation.Divide });
    });

    test("ケース: 「=」 を正しく取得できるか", () => {
        const btn = mockButton("=");
        const token = mapper.resolve(btn);

        expect(token).toEqual({ kind: TOKEN_KIND.EQUAL });
    });

    test("ケース: 「C」 を正しく取得できるか", () => {
        const btn = mockButton("C");
        const token = mapper.resolve(btn);

        expect(token).toEqual({ kind: TOKEN_KIND.CLEAR });
    });

    test("ケース: 「dataset.key」がない場合、「innerText」 を取得できるか", () => {
        const btn = document.createElement("button");
        btn.innerText = "7";   // この２行で「data-key」 なしのパターン作成
        const token = mapper.resolve(btn);
        
        expect(token).toEqual({ kind: TOKEN_KIND.DIGIT, value: 7 });
    });
    // });
});