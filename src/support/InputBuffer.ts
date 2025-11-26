
export class InputBuffer {
    constructor(private readonly maxDigits: number, private value = "") { }

    public pushDigit(digit: string): void {
        // 小数点は桁数制限に含めない
        // なぜ: 8桁入力制限にするため　/ 前提条件: 9桁目が入力された時　①
        if (this.digitCount() >= this.maxDigits) {
            return;
        }

        // なぜ: 小数点入力制限のため（１個のみ） / 前提条件: 小数点が入力されている時　②
        if (digit === "." && this.value.includes(".")) {
            return;
        }

        // 先頭が "0" で次に数字が入力された場合 → 上書き　③
        if (this.value === "0" && digit !== "0") {
            this.value = digit;
            return;
        }

        this.value += digit;
    }

    public pushDecimal(): void {
        // なぜ： "0."のように"0"補完をするため / 前提条件： 小数点が入力された時
        if (this.value === "") {
            this.value = "0.";
        } else if (!this.value.includes(".")) {   // 値があれば値と"."を「 10. 」
            this.value += ".";
        }
        console.log(this.value);
    }

    public clear(): string {
        return this.value = "";
    }

    public toNumber(): number {
        // 「this.valueが falsy（空文字, null, undefined など）」のときは、代わりに 0 を使う(number型で返す)
        return Number(this.value || 0);
    }

    public toString(): string {
        return this.value;
    }

    // なぜ: 「./-」 を除いた数値の長さを取得するため。 前提条件: 「./-」 が入力されている状態
    public digitCount(): number {
        return this.value.replace(/[.\-]/g, "").length;
    }

    // なぜ： 小数点入力（0. など）、空・NaN・符号だけで = 押下してもクリアされないために
    // 直訳：「小数点・空・NaN・符号」 を含まない文字列を「値があるかどうかの確認」を false で返す関数
    // 「小数点・空・NaN・符号」を含む条件にしている↓↓
    public hasValue(): boolean {
        const trimmed = this.value.toString();   // 文字列を返し(文字列判定)
        // 「-」単独や空文字は無効とみなす()
        if (trimmed === "" || trimmed === "-") {
            // Number() では "" は 「0」扱いの為、true になってしまう。
            return false;
        }
        const t = Number(trimmed);       // number型へ またNumber()の仕様で "." はNaN
        return !isNaN(t);                    // NaNではないものを返す → NaNなので false を返す
    }


    // trimmed === "-"　いらない？
}