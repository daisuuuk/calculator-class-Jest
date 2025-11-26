
export class NumberFormatter {
    constructor(private readonly maxDigits: number) { }

    public formatForDisplay(number: number): string { /* 末尾0削除・指数切替 */
        if (isNaN(number)) {
            return "エラー";
        }

        // なぜ: 10のdigits乗(倍率) → 丸めたい桁数(8位)を指定するため / 前提条件: 小数点以下桁数の多い値がある時
        const factor = 10 ** this.maxDigits;
        // なぜ: factor倍して整数にしたあと四捨五入し、倍率を戻すことで小数点以下を丸めた結果にするため
        const rounded = Math.round(number * factor) / factor;

        // なぜ：末尾の0を削除するため
        let formatted = rounded.toString();
        if (formatted.includes(".")) {
            formatted = formatted.replace(/\.?0+$/, ""); // 小数点以下の不要な0を削除
        }

        // なぜ：桁数オーバー時に指数表記にするため
        if (formatted.replace(".", "").length > this.maxDigits) {
            formatted = rounded.toExponential(this.maxDigits - 1);
        }

        return formatted;
    }
}
