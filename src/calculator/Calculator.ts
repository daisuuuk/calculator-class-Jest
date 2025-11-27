
import { IDisplay } from "../display/IDisplay";
import { KeyToken, TOKEN_KIND } from "../token/KeyToken";
import { CalcState } from "../constant/CalcState";
import { Config } from "../constant/Config";
import { Operation } from "../constant/Operation";
import { NumberFormatter } from "../support/NumberFormatter";
import { Evaluator } from "../support/Evaluator";
import { InputBuffer } from "../support/InputBuffer";
import { DivisionByZeroError } from "../error/DivisionByZeroError";


export class Calculator {
  private state: CalcState = CalcState.Ready;
  private left: number | null = null;
  private operator: Operation | null = null;
  // 直前の結果(連続「=」用)
  private lastResult: number | null = null;
  private lastOperator: Operation | null = null;

  constructor(
    private readonly display: IDisplay,
    private readonly formatter = new NumberFormatter(Config.MAX_EXP_DIGITS),
    private readonly evaluator = new Evaluator(),
    private readonly buffer = new InputBuffer(Config.MAX_EXP_DIGITS),
  ) { }

  /*********************************************
   * @file typesc/
   * @date 2025/11/15
   * @param token 押下されたボタンの値
   * @return なし
   * @detail 押下されたボタンに応じた関数を処理する関数
   ********************************************/
  public handle(token: KeyToken): void {
    switch (token.kind) {
      case TOKEN_KIND.DIGIT:
        this.handleDigit(token.value);
        break;
      case TOKEN_KIND.DECIMAL:
        this.buffer.pushDecimal();
        this.display.render(this.buffer.toString());
        break;
      case TOKEN_KIND.OP:
        this.handleOperator(token.value);
        break;
      case TOKEN_KIND.EQUAL:
        this.handleEqual();
        break;
      case TOKEN_KIND.CLEAR:
        this.handleClear();
        break;
      default:
        break;
    }
  }

  /*********************************************
   * @file typesc/
   * @date 2025/11/15
   * @param num 入力された値(数字)の格納先
   * @return なし
   * @detail 押下された数値をセットする関数
   ********************************************/
  public handleDigit(num: number): void {

    switch (this.state) {
      /**
       * 前提条件：最初の入力時
       */
      case CalcState.Ready: {
        this.buffer.pushDigit(num.toString());
        this.display.render(this.buffer.toString());
        this.display.displayHistoryOne(this.buffer.toString());
        this.state = CalcState.InputtingFirst;
        break;
      }

      /**
       * 【InputtingFirst】前提条件：「最初の入力時」に続く...(左辺入力中)
       * 【InputtingSecond】前提条件：右辺入力中
       */
      case CalcState.InputtingFirst: {
        this.buffer.pushDigit(num.toString());
        this.display.render(this.buffer.toString());
        this.display.displayHistoryOne(this.buffer.toString());
        break;
      }

      case CalcState.InputtingSecond: {
        this.buffer.pushDigit(num.toString());
        this.display.render(this.buffer.toString());
        this.display.displayHistoryTwo(this.buffer.toString());
        break;
      }

      /**
       * 前提条件：演算子が押された後(右辺入力へ)
       */
      case CalcState.OperatorEntered: {
        this.buffer.pushDigit(num.toString());
        this.display.render(this.buffer.toString());
        this.display.displayHistoryTwo(this.buffer.toString());
        this.state = CalcState.InputtingSecond;
        break;
      }

      /**
       * なぜ：新計算を開始するため / 計算結果表示後（「=」押下後）に数字が押下された時
       */
      case CalcState.ResultShown: {
        this.display.displayHistoryOne(this.buffer.clear());
        this.display.displayHistoryOperator(this.buffer.clear());
        this.display.displayHistoryTwo(this.buffer.clear());
        this.buffer.clear();
        this.operator = null;
        this.left = null;
        this.buffer.pushDigit(num.toString());
        this.display.render(this.buffer.toString());
        this.display.displayHistoryOne(this.buffer.toString());
        this.state = CalcState.InputtingFirst;
        break;
      }

      /**
       * なぜ: "エラー"表示後に復帰をするため / 前提条件: "エラー"が表示されている時
       */
      case CalcState.Error: {
        this.buffer.clear();
        this.operator = null;
        this.left = null;

        this.buffer.pushDigit(num.toString());
        this.display.render(this.buffer.toString());
        this.display.displayHistoryOne(this.buffer.toString());
        this.state = CalcState.InputtingFirst;
        break;
      }

      default:
        break;
    }
  }

  /*********************************************
   * @file typesc/
   * @date 2025/11/15
   * @param op 入力された値(演算子)の格納先
   * @return なし
   * @detail 押下された演算子をセットする関数
   ********************************************/
  public handleOperator(op: Operation): void {
    // InputBufferを用いて取得した「現在の入力」 = 元currentInput 的な役割
    // 条件分岐がstring型が多いのでgetValue()
    const currentString = this.buffer.toString();

    switch (this.state) {
      /**
       * 前提条件: まだ何も演算子が入力されていない状態
       */
      case CalcState.Ready: {
        // なぜ: 「-」を数値の符号として扱うため / 前提条件: preInput, currentInput が空で "-" が押された時
        if (op === Operation.Subtract && currentString === "" && this.left === null) {
          this.buffer.pushDigit("-");
          this.display.render("-");
          this.display.displayHistoryOne("-");
          this.state = CalcState.InputtingFirst
          return;
        }
        return;
      }

      /**
       * 前提条件：左辺入力中
       */
      case CalcState.InputtingFirst: {
        // なぜ: 数字が入力されていない時は演算子を押しても無意味だから / 前提条件: currentInput が空
        // 考え方：左辺入力中にhandleOperator()が押下された場合「InputtingFirst」で処理を行うが、
        // そもそも左辺入力がなければ何もしないから、「InputtingFirst」の中に記載。
        if (currentString === "") {
          this.state = CalcState.Ready;
          return;
        }

        this.left = this.buffer.toNumber();
        this.operator = op;
        this.buffer.clear();
        this.display.displayHistoryOperator(op);
        this.state = CalcState.OperatorEntered;
        return;
      }

      /**
       * 前提条件： 右辺入力中 || 演算子押下済み
       */
      case CalcState.InputtingSecond:
      case CalcState.OperatorEntered: {
        // なぜ: 繰り返し押された演算子を上書きするため / 前提条件: currentInput が空で すでにpreInput に数字が格納されているとき
        if (currentString === "" && this.left !== null) {
          this.operator = op;
          this.display.displayHistoryOperator(op);
          return;
        }

        // なぜ: 計算途中でも正しくディスプレイに表示するため / 前提条件: 演算子 が設定されている時
        if (this.operator) {
          this.handleEqual();
        }

        // なぜ: 新しい計算に備えて準備するため / 前提条件: 演算子ボタンが押された時
        this.operator = op;
        this.buffer.clear();
        this.display.displayHistoryOperator(op);
        this.state = CalcState.OperatorEntered;
        return;
      }

      default:
        return;
    }
  }

  /*****************************************************
   * @file typesc/
   * @date 2025/11/15
   * @param なし(void)
   * @return なし
   * @detail ２つの入力値を受け取り四則演算子に応じて計算する関数
   ****************************************************/
  public handleEqual(): void {
    switch (this.state) {
      /**
       * 初期状態または入力中
       * 通常計算処理
       */
      case CalcState.Ready:
      case CalcState.InputtingFirst:
      case CalcState.InputtingSecond: {
        // InputBufferを用いて取得した「現在の入力」 = 元currentInput 的な役割
        // 条件分岐がnumber型が多いのでtoNumber()
        let currentNumber = this.buffer.toNumber();

        // なぜ: 数字をそのまま保持するため　/ 前提条件: 数字のみ入力されている時
        // this.buffer（currentInput の代わり）、this.left（preInput の代わり）
        if (this.operator === null && this.buffer.hasValue() && this.left === null) {
          this.display.render(this.buffer.toString());
          this.state = CalcState.ResultShown;
          return;
        }

        // なぜ: 「0」を(そのまま)表示するため　/ 前提条件: 演算子も数値も入力されていない時
        if (this.left === null &&
          !this.buffer.hasValue() &&   // 今回はhasValue()は false を消す想定なので !false で trueという事 // !currentNumber   3箇所
          this.operator === null
        ) {
          this.handleClear();
          this.state = CalcState.Ready;
          return;
        }

        // なぜ: 文字列を数値へ変更するため　/ 前提条件: 1つ目の数字と２つ目の数字が入力されている時
        const PRE_NUMBER = Number(this.left);
        const CURRENT_NUMBER = currentNumber;
        if (isNaN(PRE_NUMBER) || isNaN(CURRENT_NUMBER)) {
          this.display.renderError(Config.ERROR_MESSAGE);
          this.state = CalcState.Error;
          return;
        }

        try {
          /**
           * 共通の計算処理（通常計算処理 と 「=」連続対応）
           */
          this.performEvaluation(PRE_NUMBER, this.operator as Operation, CURRENT_NUMBER);

          // return;

        } catch (error) {
          /**
           * 共通エラーハンドリング
           */
          this.handleError(error);
        } finally {
          console.log("try-catch-finally終了！！");
        }

        return;
      }

      /**
       * 「=」連続対応
       */
      case CalcState.ResultShown: {
        // なぜ：計算履歴がない場合はそもそも無視するため / 前提条件： 通常処理が行われていない時
        if (this.lastOperator === null || this.lastResult === null) {
          return;
        }

        try {
          /**
           * 共通の計算処理（通常計算処理 と 「=」連続対応）
           */
          this.performEvaluation(Number(this.left), this.lastOperator, this.lastResult);

          // return;

        } catch (error) {
          /**
           * 共通エラーハンドリング
           */
          this.handleError(error);
        } finally {
          console.log("try-catch-finally終了！！");
        }

        return;
      }

      case CalcState.OperatorEntered: {
        // なぜ: ２つ目の数字が入力されていないので計算できないため　/ 前提条件: 一つ目の数字 と 演算子 のみ入力されている時
        if (!this.buffer.hasValue() && this.operator) {
          this.display.renderError(Config.ERROR_MESSAGE);
          this.state = CalcState.Error;
          return;
        }

        return;
      }

    } // switch の締め }
  }   // handleEqual() の締め }

  /*****************************************************
   * @file typesc/
   * @date 2025/11/15
   * @param なし(void)
   * @return なし
   * @detail 表示画面をクリアにする関数
   ****************************************************/
  public handleClear(): void {
    // 初期化
    this.buffer.clear();   // 元currentInput
    this.left = null;      // 元preInput     
    this.operator = null;

    const result = document.getElementById("result") as HTMLElement;
    if (result) {
      result.textContent = Config.NUMBER_ZERO;
    }

    this.display.displayHistoryOne(this.buffer.clear());
    this.display.displayHistoryOperator(this.buffer.clear());
    this.display.displayHistoryTwo(this.buffer.clear());
    this.state = CalcState.Ready;
  }

  /*********************************************************
   * @file typesc/
   * @date 2025/11/15
   * @param error
   * @return なし
   * @detail try-catch-finally の catch の共通「エラー」表記関数
   ********************************************************/
  public handleError(error: unknown): void {
    if (error instanceof DivisionByZeroError) {
      this.display.renderError("エラー");
      console.error("Division by zero detected.");
    } else {
      this.display.renderError("不明なエラー");
      console.error(error);
    }
    this.state = CalcState.Error;
    // this.state = this.errorHandler.handle(error);
  }

  /*******************************************************************
   * @file typesc/
   * @date 2025/11/15
   * @param left
   * @param op 
   * @param right
   * @return なし
   * @detail handleEqual()の共通の計算処理関数（通常計算処理 と 「=」連続対応）
   ******************************************************************/
  public performEvaluation(left: number, op: Operation, right: number): void {
    const evaluatorResult = this.evaluator.operatorSwitch(left, op, right);
    const format = this.formatter.formatForDisplay(evaluatorResult);

    this.lastOperator = op;
    this.lastResult = right;
    this.operator = null;
    this.left = evaluatorResult;

    this.display.render(format);
    if (this.state === CalcState.ResultShown) {   // 連続押下「=」ver
      const historyText = Number(format) - this.lastResult;   // 通常処理 と 連続押下「=」の履歴を分けるために必要
      this.display.displayHistoryOne(historyText.toString());
      this.display.displayHistoryOperator(this.lastOperator);
      this.display.displayHistoryTwo(this.lastResult.toString());
    } else {   // 通常処理 ver
      this.display.displayHistoryOne(format);
      this.display.displayHistoryOperator(this.buffer.clear());
      this.display.displayHistoryTwo(this.buffer.clear());
    }
    this.state = CalcState.ResultShown;
  }

}   // class Calculator の締め }