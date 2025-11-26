
import { KeyToken, TOKEN_KIND } from "../token/KeyToken";
import { Operation } from "../constant/Operation";

export class KeyMapper {
    // なぜ： keyMap に格納していくため : 型は KeyToken型
    private readonly keyMap = new Map<string, KeyToken>();

    constructor() {
        // 数値のセット: ループで
        for (let i = 0; i <= 9; i++) {
            this.keyMap.set(i.toString(), { kind: TOKEN_KIND.DIGIT, value: i });

            // 演算子・「=」・「C」のセット
            this.keyMap.set(".", { kind: TOKEN_KIND.DECIMAL });
            this.keyMap.set("+", { kind: TOKEN_KIND.OP, value: Operation.Add });
            this.keyMap.set("-", { kind: TOKEN_KIND.OP, value: Operation.Subtract });
            this.keyMap.set("*", { kind: TOKEN_KIND.OP, value: Operation.Multiply });
            this.keyMap.set("/", { kind: TOKEN_KIND.OP, value: Operation.Divide });
            this.keyMap.set("=", { kind: TOKEN_KIND.EQUAL });
            this.keyMap.set("C", { kind: TOKEN_KIND.CLEAR });
        }
    }

    public resolve(target: HTMLElement): KeyToken | undefined {
        // 「target.dataset.key」は html の data-key 内を参照 <button data-key="5"> → "5"
        // 「??」 null合体演算子：左が null or undefined の場合に右を使う
        // 「target.innerText」は ボタンの中の文字 <button>5</button> → "5"
        const key = target.dataset.key ?? target.innerText;
        return this.keyMap.get(key);
    }
}