
import { IDisplay } from "./IDisplay";

export class RenderDisplay implements IDisplay {
    // ！マーク：「Non-null assertion operator（非nullアサーション演算子）」
    // 型は 「 HTMLElement 」になる。
    // private displayResultEl = document.getElementById("result")!;
    public displayResultEl = document.getElementById("result") as HTMLElement;

    // div の箱内で３つの要素を持っている為、一応明示的に「HTMLDivElement」
    public historyElOne = document.getElementById("history-one") as HTMLDivElement;
    public historyOperator = document.getElementById("history-operator") as HTMLDivElement;
    public historyElTwo = document.getElementById("history-two") as HTMLDivElement;

    render(text: string): void {
        this.displayResultEl.textContent = text;
    }
    renderError(message: string): void {
        this.displayResultEl.textContent = message;
    }

    displayHistoryOne(historyone: string): void {
        this.historyElOne.textContent = historyone;
    }
    displayHistoryOperator(historyoperator: string): void {
        this.historyOperator.textContent = historyoperator;
    }
    displayHistoryTwo(historytwo: string): void {
        this.historyElTwo.textContent = historytwo;
    }
}