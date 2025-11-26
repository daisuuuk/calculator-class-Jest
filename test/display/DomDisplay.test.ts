
import { RenderDisplay } from "../../src/display/DomDisplay";
import { setupTestDOM } from "../utils/MockAndDom";


describe("------------------------------RenderDisplay------------------------------", () => {
    let display: RenderDisplay;

    beforeEach(() => {
        // テスト用に DOM を再構築
        setupTestDOM();

        // DOM を作成してから、インスタンス化する
        display = new RenderDisplay();
    });

    test("ケース: render() が 正しく反映されるか", () => {
        display.render("123");
        const element = document.getElementById("result");
        expect(element?.textContent).toBe("123");
    });

    test("ケース: renderError() が 正しく反映されるか", () => {
        display.renderError("エラー");
        const element = document.getElementById("result");
        expect(element?.textContent).toBe("エラー");
    });

    test("ケース: displayHistoryOne() が 正しく反映されるか", () => {
        display.displayHistoryOne("1");
        const element = document.getElementById("history-one");
        expect(element?.textContent).toBe("1");
    });

    test("ケース: displayHistoryOperator() が 正しく反映されるか", () => {
        display.displayHistoryOperator("+");
        const element = document.getElementById("history-operator");
        expect(element?.textContent).toBe("+");
    });

    test("ケース: displayHistoryTwo() が 正しく反映されるか", () => {
        display.displayHistoryTwo("2");
        const element = document.getElementById("history-two");
        expect(element?.textContent).toBe("2");
    });
});