
import { Calculator } from "../../src/calculator/Calculator";
import { Operation } from "../../src/constant/Operation";
import { IDisplay } from "../../src/display/IDisplay";
import { TOKEN_KIND } from "../../src/token/KeyToken";
import { Config } from "../../src/constant/Config";
import { createDisplayMock } from "../utils/MockAndDom";
import { setupTestDOM } from "../utils/MockAndDom";

describe("------------------------------Calculator------------------------------", () => {
    let calculator: Calculator;
    let mockDisplay: jest.Mocked<IDisplay>;   // Jest のモック関数に置き換えられた型

    beforeEach(() => {
        // テスト用に DOM を再構築
        setupTestDOM();

        // モックの作成(RenderDisplayの偽物)
        // モック は Calculator のロジックだけをテスト（単体テスト）
        mockDisplay = createDisplayMock();

        // DOM を作成してから、インスタンス化する
        calculator = new Calculator(mockDisplay);
    });


    describe("--------------------handleDigit**数字入力**--------------------", () => {
        test("ケース: 数字ボタン（1）が押下できるか", () => {
            calculator.handleDigit(1);
            //「 toHaveBeenCalledWith() 」**モック関数が特定の引数で呼び出されたかどうかを検証するマッチャ** 種類、色々あり
            expect(mockDisplay.render).toHaveBeenCalledWith("1");
        });

        test("ケース: 数字ボタン（2）が押下できるか", () => {
            calculator.handleDigit(2);
            expect(mockDisplay.render).toHaveBeenCalledWith("2");
        });

        test("ケース: 数字ボタン（3）が押下できるか", () => {
            calculator.handleDigit(3);
            expect(mockDisplay.render).toHaveBeenCalledWith("3");
        });

        test("ケース: 数字ボタン（4）が押下できるか", () => {
            calculator.handleDigit(4);
            expect(mockDisplay.render).toHaveBeenCalledWith("4");
        });

        test("ケース: 数字ボタン（5）が押下できるか", () => {
            calculator.handleDigit(5);
            expect(mockDisplay.render).toHaveBeenCalledWith("5");
        });

        test("ケース: 数字ボタン（6）が押下できるか", () => {
            calculator.handleDigit(6);
            expect(mockDisplay.render).toHaveBeenCalledWith("6");
        });

        test("ケース: 数字ボタン（7）が押下できるか", () => {
            calculator.handleDigit(7);
            expect(mockDisplay.render).toHaveBeenCalledWith("7");
        });

        test("ケース: 数字ボタン（8）が押下できるか", () => {
            calculator.handleDigit(8);
            expect(mockDisplay.render).toHaveBeenCalledWith("8");
        });

        test("ケース: 数字ボタン（9）が押下できるか", () => {
            calculator.handleDigit(9);
            expect(mockDisplay.render).toHaveBeenCalledWith("9");
        });

        test("ケース: 同じ数字を複数回押しても連続表示されるか", () => {
            calculator.handleDigit(1);
            calculator.handleDigit(1);
            calculator.handleDigit(1);
            //「 toHaveBeenLastCalledWith() 」**モック関数が最後に呼び出された際の引数で呼び出されたかどうかを検証するマッチャ**
            expect(mockDisplay.render).toHaveBeenLastCalledWith("111");
        });

        test("ケース: 異なる数字を複数回押しても連続表示されるか", () => {
            calculator.handleDigit(3);
            calculator.handleDigit(7);
            calculator.handleDigit(1);
            expect(mockDisplay.render).toHaveBeenLastCalledWith("371");
        });

        test("ケース: 計算結果表示後に数字を押下すると新計算が始まるか", () => {
            calculator.handleDigit(2);
            calculator.handle({ kind: TOKEN_KIND.OP, value: Operation.Add });
            calculator.handleDigit(3);
            calculator.handle({ kind: TOKEN_KIND.EQUAL });

            calculator.handleDigit(7);
            expect(mockDisplay.render).toHaveBeenLastCalledWith('7');
        });

        test("ケース: 「C」を選択すると黒のディスプレイにクリア(0)が表示され、その後の最初の計算で負の数を扱えるか", () => {
            calculator.handleDigit(2);
            calculator.handle({ kind: TOKEN_KIND.CLEAR });
            calculator.handle({ kind: TOKEN_KIND.OP, value: Operation.Subtract });
            calculator.handleDigit(7);

            expect(mockDisplay.render).toHaveBeenCalledWith('-7');
        });

        test("ケース: 0で割ったときに「エラー」と表示された後に、数字を押下すると正しく反映されるか", () => {
            calculator.handleDigit(5);
            calculator.handle({ kind: TOKEN_KIND.OP, value: Operation.Divide });
            calculator.handleDigit(0);
            calculator.handle({ kind: TOKEN_KIND.EQUAL });

            calculator.handleDigit(7);
            expect(mockDisplay.render).toHaveBeenLastCalledWith('7');
        });

        test("ケース:小数点(.)が押下できるか", () => {
            calculator.handle({ kind: TOKEN_KIND.DECIMAL });
            expect(mockDisplay.render).toHaveBeenCalledWith("0.");
        });
    });


    describe("--------------------handleOperator**演算子入力**--------------------", () => {
        test("ケース: 一つ目の値が負の数として計算を行えるか", () => {
            calculator.handle({ kind: TOKEN_KIND.OP, value: Operation.Subtract });
            calculator.handleDigit(7);

            expect(mockDisplay.render).toHaveBeenCalledWith('-7');
        });

        test("ケース: 演算子が連続で押下された時、最後に押下された演算子が反映されるか", () => {
            calculator.handleDigit(7);
            calculator.handle({ kind: TOKEN_KIND.OP, value: Operation.Add });
            calculator.handle({ kind: TOKEN_KIND.OP, value: Operation.Multiply });
            calculator.handleDigit(7);
            calculator.handle({ kind: TOKEN_KIND.OP, value: Operation.Multiply });

            expect(mockDisplay.render).toHaveBeenLastCalledWith('49');
        });

        test("ケース: 連続して異なる演算が行われた場合正しく実行されるか", () => {
            calculator.handleDigit(7);
            calculator.handle({ kind: TOKEN_KIND.OP, value: Operation.Multiply });
            calculator.handleDigit(7);
            calculator.handle({ kind: TOKEN_KIND.OP, value: Operation.Add });

            expect(mockDisplay.render).toHaveBeenCalledWith('49');
        });

        test("ケース: 連続して同じ演算が行われた場合正しく実行されるか(+ リアルタイム反映)", () => {
            calculator.handleDigit(7);
            calculator.handle({ kind: TOKEN_KIND.OP, value: Operation.Add });
            calculator.handleDigit(7);
            calculator.handle({ kind: TOKEN_KIND.OP, value: Operation.Add });
            calculator.handleDigit(7);
            calculator.handle({ kind: TOKEN_KIND.OP, value: Operation.Add });

            expect(mockDisplay.render).toHaveBeenCalledWith('21');
        });
    });


    describe("--------------------handleEqual**計算実行**--------------------", () => {
        test("ケース: 一つ目の数字が入力された後に「=」を押下するとその数字が保持され表示されるか", () => {
            calculator.handleDigit(7);
            calculator.handle({ kind: TOKEN_KIND.EQUAL });

            expect(mockDisplay.render).toHaveBeenLastCalledWith('7');
        });

        test("ケース: 何も入力されていない状態で「=」を押下すると「0」と表示されるか", () => {
            calculator.handle({ kind: TOKEN_KIND.EQUAL });

            const result = document.getElementById('result');
            expect(result?.textContent).toBe('0');
        });

        test("ケース: 通常計算「=」が正しく実行されるか", () => {
            calculator.handleDigit(3);
            calculator.handle({ kind: TOKEN_KIND.OP, value: Operation.Add });
            calculator.handleDigit(2);
            calculator.handle({ kind: TOKEN_KIND.EQUAL });
            expect(mockDisplay.render).toHaveBeenLastCalledWith('5');
        });

        test("ケース: 連続して「=」が押下された時に正しく実行されるか", () => {
            calculator.handleDigit(3);
            calculator.handle({ kind: TOKEN_KIND.OP, value: Operation.Add });
            calculator.handleDigit(2);
            calculator.handle({ kind: TOKEN_KIND.EQUAL });

            expect(mockDisplay.render).toHaveBeenLastCalledWith('5');

            calculator.handle({ kind: TOKEN_KIND.EQUAL });
            expect(mockDisplay.render).toHaveBeenLastCalledWith('7');

            calculator.handle({ kind: TOKEN_KIND.EQUAL });
            expect(mockDisplay.render).toHaveBeenLastCalledWith('9');
        });

        test("ケース: 一つ目の数字と演算子だけが入力された後に「=」を押すとエラーが表示されるか", () => {
            calculator.handleDigit(7);
            calculator.handle({ kind: TOKEN_KIND.OP, value: Operation.Add });
            calculator.handle({ kind: TOKEN_KIND.EQUAL });

            expect(mockDisplay.renderError).toHaveBeenCalledWith(Config.ERROR_MESSAGE);
        });

        test("ケース: 最初に「.」が入力された後に「=」を押下すると「.」が保持され表示されるか", () => {
            calculator.handle({ kind: TOKEN_KIND.DECIMAL });
            calculator.handle({ kind: TOKEN_KIND.EQUAL });
            expect(mockDisplay.render).toHaveBeenCalledWith("0.");
        });

        test("ケース: 演算子だけが入力された後に「=」を押下すると「0」のまま表示されるか", () => {
            calculator.handle({ kind: TOKEN_KIND.OP, value: Operation.Add });
            calculator.handle({ kind: TOKEN_KIND.EQUAL });
            const result = document.getElementById('result');
            expect(result?.textContent).toBe('0');
        });

        test("ケース: 入力された順番通りの演算子で計算されるか（左から順計算）", () => {
            calculator.handleDigit(2);
            calculator.handle({ kind: TOKEN_KIND.OP, value: Operation.Add });
            calculator.handleDigit(3);
            calculator.handle({ kind: TOKEN_KIND.OP, value: Operation.Multiply });
            calculator.handleDigit(4);
            calculator.handle({ kind: TOKEN_KIND.EQUAL });

            expect(mockDisplay.render).toHaveBeenLastCalledWith('20');
        });

        test("ケース: 小数点が含まれる場合の処理を正しく実行できるか", () => {
            calculator.handleDigit(9);
            calculator.handle({ kind: TOKEN_KIND.OP, value: Operation.Add });
            calculator.handleDigit(1);
            calculator.handle({ kind: TOKEN_KIND.DECIMAL });
            calculator.handleDigit(5);
            calculator.handle({ kind: TOKEN_KIND.EQUAL });

            expect(mockDisplay.render).toHaveBeenLastCalledWith('10.5');
        });

        test("ケース: 計算結果が境界値であっても表示できるか（ディスプレイで表示できる最大値が表示できるか）", () => {
            calculator.handleDigit(99999998);
            calculator.handle({ kind: TOKEN_KIND.OP, value: Operation.Add });
            calculator.handleDigit(1);
            calculator.handle({ kind: TOKEN_KIND.EQUAL });
            expect(mockDisplay.render).toHaveBeenCalledWith("99999999");
        });

        test("ケース: 計算結果が境界値+1のときに期待結果通りに表示されるか", () => {
            calculator.handleDigit(99999999);
            calculator.handle({ kind: TOKEN_KIND.OP, value: Operation.Add });
            calculator.handleDigit(1);
            calculator.handle({ kind: TOKEN_KIND.EQUAL });
            expect(mockDisplay.render).toHaveBeenCalledWith("1.0000000e+8");
        });
    });


    describe("--------------------handleCrear**クリア処理**--------------------", () => {
        test("ケース: 「C」を選択すると黒のディスプレイにクリア(0)が表示されるか", () => {
            calculator.handleDigit(7);
            calculator.handle({ kind: TOKEN_KIND.CLEAR });

            const result = document.getElementById('result');
            expect(result?.textContent).toBe('0');
        });
    });


    describe("--------------------handleError**エラー処理**--------------------", () => {
        test("ケース: 0で割ったときに「エラー」と表示されるか(try-catch-finally)", () => {
            calculator.handleDigit(7);
            calculator.handle({ kind: TOKEN_KIND.OP, value: Operation.Divide });
            calculator.handleDigit(0);
            calculator.handle({ kind: TOKEN_KIND.EQUAL });

            expect(mockDisplay.renderError).toHaveBeenCalledWith(Config.ERROR_MESSAGE);
        });
    });


    describe("--------------------**機能確認**--------------------", () => {
        test("ケース: ボタン連打や操作の途中キャンセルでもアプリがクラッシュしないか", () => {
            calculator.handleDigit(9);
            calculator.handle({ kind: TOKEN_KIND.OP, value: Operation.Add });
            calculator.handle({ kind: TOKEN_KIND.OP, value: Operation.Add });
            calculator.handle({ kind: TOKEN_KIND.OP, value: Operation.Add });
            expect(mockDisplay.render).toHaveBeenCalledWith("9");
        });

        test("ケース: 表示画面が常に正しくレイアウトされているか", () => {
            calculator.handleDigit(99999999);
            calculator.handle({ kind: TOKEN_KIND.OP, value: Operation.Add });
            calculator.handleDigit(99999999);
            calculator.handle({ kind: TOKEN_KIND.EQUAL });
            expect(mockDisplay.render).toHaveBeenCalledWith("2.0000000e+8");
        });
    });

});   // describe「--Calculator--」の締め }