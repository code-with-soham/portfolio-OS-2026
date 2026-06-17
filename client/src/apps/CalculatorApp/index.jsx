import { useState, useEffect } from 'react';
import { 
  NavigationRegular, 
  HistoryRegular, 
  DeleteRegular, 
  CalculatorRegular,
  MathFormulaRegular,
  CodeRegular
} from '@fluentui/react-icons';
import './CalculatorApp.css';

export default function CalculatorApp() {
  const [mode, setMode] = useState('Standard'); // Standard, Scientific, Programmer
  const [showMenu, setShowMenu] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState([]);
  
  // Calc State
  const [currentVal, setCurrentVal] = useState('0');
  const [previousVal, setPreviousVal] = useState(null);
  const [operator, setOperator] = useState(null);
  const [equation, setEquation] = useState('');
  const [awaitingNextVal, setAwaitingNextVal] = useState(false);

  // Programmer Mode base
  const [base, setBase] = useState(10); // 2, 8, 10, 16

  useEffect(() => {
    const savedHistory = localStorage.getItem('calc_history');
    if (savedHistory) {
      try { setHistory(JSON.parse(savedHistory)); } catch (e) {}
    }
  }, []);

  const saveHistory = (eq, res) => {
    const newHist = [{ equation: eq, result: res }, ...history].slice(0, 20);
    setHistory(newHist);
    localStorage.setItem('calc_history', JSON.stringify(newHist));
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('calc_history');
  };

  const handleNum = (numStr) => {
    if (awaitingNextVal) {
      setCurrentVal(numStr);
      setAwaitingNextVal(false);
    } else {
      setCurrentVal(currentVal === '0' ? numStr : currentVal + numStr);
    }
  };

  const handleDot = () => {
    if (awaitingNextVal) {
      setCurrentVal('0.');
      setAwaitingNextVal(false);
    } else if (!currentVal.includes('.')) {
      setCurrentVal(currentVal + '.');
    }
  };

  const handleClear = () => {
    setCurrentVal('0');
    setPreviousVal(null);
    setOperator(null);
    setEquation('');
  };

  const handleDelete = () => {
    if (awaitingNextVal) return;
    setCurrentVal(currentVal.length > 1 ? currentVal.slice(0, -1) : '0');
  };

  const handleOp = (op) => {
    if (operator && !awaitingNextVal) {
      handleEqual();
    }
    setPreviousVal(currentVal);
    setOperator(op);
    setEquation(`${currentVal} ${op}`);
    setAwaitingNextVal(true);
  };

  const calculate = (a, b, op) => {
    const numA = parseFloat(a);
    const numB = parseFloat(b);
    if (isNaN(numA) || isNaN(numB)) return '';
    switch (op) {
      case '+': return (numA + numB).toString();
      case '-': return (numA - numB).toString();
      case '*': return (numA * numB).toString();
      case '/': return numB === 0 ? 'Error' : (numA / numB).toString();
      default: return b;
    }
  };

  const handleEqual = () => {
    if (!operator || !previousVal) return;
    const res = calculate(previousVal, currentVal, operator);
    const eq = `${previousVal} ${operator} ${currentVal} =`;
    setCurrentVal(res);
    setEquation(eq);
    setPreviousVal(null);
    setOperator(null);
    setAwaitingNextVal(true);
    saveHistory(eq, res);
  };

  // Scientific Single Operand
  const handleSci = (func) => {
    let num = parseFloat(currentVal);
    if (isNaN(num)) return;
    let res = 0;
    let eq = '';
    switch (func) {
      case 'sin': res = Math.sin((num * Math.PI) / 180); eq = `sin(${num})`; break; // assumes deg
      case 'cos': res = Math.cos((num * Math.PI) / 180); eq = `cos(${num})`; break;
      case 'tan': res = Math.tan((num * Math.PI) / 180); eq = `tan(${num})`; break;
      case 'log': res = Math.log10(num); eq = `log(${num})`; break;
      case 'ln': res = Math.log(num); eq = `ln(${num})`; break;
      case 'sqrt': res = Math.sqrt(num); eq = `sqrt(${num})`; break;
      case 'sqr': res = Math.pow(num, 2); eq = `sqr(${num})`; break;
      case '1/x': res = 1 / num; eq = `1/(${num})`; break;
      case 'fact': 
        let f = 1; for(let i=1; i<=Math.floor(num); i++) f*=i; 
        res = f; eq = `fact(${num})`; break;
    }
    const finalRes = res.toString();
    setCurrentVal(finalRes);
    setEquation(eq + ' =');
    setAwaitingNextVal(true);
    saveHistory(eq + ' =', finalRes);
  };

  // Programmer Conversions
  const getProgVal = (baseOut) => {
    if (currentVal === 'Error') return '0';
    let num10;
    if (base === 10) num10 = parseInt(currentVal, 10);
    else if (base === 16) num10 = parseInt(currentVal, 16);
    else if (base === 8) num10 = parseInt(currentVal, 8);
    else if (base === 2) num10 = parseInt(currentVal, 2);
    
    if (isNaN(num10)) return '0';
    return num10.toString(baseOut).toUpperCase();
  };

  const handleProgNum = (char) => {
    if (awaitingNextVal) {
      setCurrentVal(char);
      setAwaitingNextVal(false);
    } else {
      setCurrentVal(currentVal === '0' ? char : currentVal + char);
    }
  };

  const renderStandardKeypad = () => (
    <div className="calc-keypad standard">
      <button className="calc-btn op" onClick={() => setCurrentVal('0')}>CE</button>
      <button className="calc-btn op" onClick={handleClear}>C</button>
      <button className="calc-btn op" onClick={handleDelete}>⌫</button>
      <button className="calc-btn op" onClick={() => handleOp('/')}>÷</button>

      <button className="calc-btn" onClick={() => handleNum('7')}>7</button>
      <button className="calc-btn" onClick={() => handleNum('8')}>8</button>
      <button className="calc-btn" onClick={() => handleNum('9')}>9</button>
      <button className="calc-btn op" onClick={() => handleOp('*')}>×</button>

      <button className="calc-btn" onClick={() => handleNum('4')}>4</button>
      <button className="calc-btn" onClick={() => handleNum('5')}>5</button>
      <button className="calc-btn" onClick={() => handleNum('6')}>6</button>
      <button className="calc-btn op" onClick={() => handleOp('-')}>-</button>

      <button className="calc-btn" onClick={() => handleNum('1')}>1</button>
      <button className="calc-btn" onClick={() => handleNum('2')}>2</button>
      <button className="calc-btn" onClick={() => handleNum('3')}>3</button>
      <button className="calc-btn op" onClick={() => handleOp('+')}>+</button>

      <button className="calc-btn" onClick={() => setCurrentVal((parseFloat(currentVal) * -1).toString())}>+/-</button>
      <button className="calc-btn" onClick={() => handleNum('0')}>0</button>
      <button className="calc-btn" onClick={handleDot}>.</button>
      <button className="calc-btn eq" onClick={handleEqual}>=</button>
    </div>
  );

  const renderScientificKeypad = () => (
    <div className="calc-keypad scientific">
      <button className="calc-btn op" onClick={() => handleSci('sin')}>sin</button>
      <button className="calc-btn op" onClick={() => handleSci('cos')}>cos</button>
      <button className="calc-btn op" onClick={() => handleSci('tan')}>tan</button>
      <button className="calc-btn op" onClick={() => handleSci('pi')}>π</button>
      <button className="calc-btn op" onClick={() => handleSci('e')}>e</button>

      <button className="calc-btn op" onClick={() => handleSci('sqr')}>x²</button>
      <button className="calc-btn op" onClick={() => handleSci('1/x')}>1/x</button>
      <button className="calc-btn op" onClick={() => handleSci('sqrt')}>√x</button>
      <button className="calc-btn op" onClick={() => handleSci('fact')}>n!</button>
      <button className="calc-btn op" onClick={() => handleOp('/')}>÷</button>

      <button className="calc-btn op" onClick={() => handleSci('log')}>log</button>
      <button className="calc-btn" onClick={() => handleNum('7')}>7</button>
      <button className="calc-btn" onClick={() => handleNum('8')}>8</button>
      <button className="calc-btn" onClick={() => handleNum('9')}>9</button>
      <button className="calc-btn op" onClick={() => handleOp('*')}>×</button>

      <button className="calc-btn op" onClick={() => handleSci('ln')}>ln</button>
      <button className="calc-btn" onClick={() => handleNum('4')}>4</button>
      <button className="calc-btn" onClick={() => handleNum('5')}>5</button>
      <button className="calc-btn" onClick={() => handleNum('6')}>6</button>
      <button className="calc-btn op" onClick={() => handleOp('-')}>-</button>

      <button className="calc-btn op" onClick={handleClear}>C</button>
      <button className="calc-btn" onClick={() => handleNum('1')}>1</button>
      <button className="calc-btn" onClick={() => handleNum('2')}>2</button>
      <button className="calc-btn" onClick={() => handleNum('3')}>3</button>
      <button className="calc-btn op" onClick={() => handleOp('+')}>+</button>

      <button className="calc-btn op" onClick={handleDelete}>⌫</button>
      <button className="calc-btn" onClick={() => setCurrentVal((parseFloat(currentVal) * -1).toString())}>+/-</button>
      <button className="calc-btn" onClick={() => handleNum('0')}>0</button>
      <button className="calc-btn" onClick={handleDot}>.</button>
      <button className="calc-btn eq" onClick={handleEqual}>=</button>
    </div>
  );

  const renderProgrammerKeypad = () => {
    const isHex = base === 16;
    const isDec = base === 10 || isHex;
    const isOct = base === 8 || isDec;
    
    return (
      <div className="calc-keypad programmer">
        <button className="calc-btn op" disabled={!isHex} onClick={() => handleProgNum('A')}>A</button>
        <button className="calc-btn op" disabled={!isHex} onClick={() => handleProgNum('B')}>B</button>
        <button className="calc-btn op" onClick={() => setCurrentVal('0')}>CE</button>
        <button className="calc-btn op" onClick={handleClear}>C</button>
        <button className="calc-btn op" onClick={handleDelete}>⌫</button>

        <button className="calc-btn op" disabled={!isHex} onClick={() => handleProgNum('C')}>C</button>
        <button className="calc-btn op" disabled={!isHex} onClick={() => handleProgNum('D')}>D</button>
        <button className="calc-btn" disabled={!isOct} onClick={() => handleProgNum('7')}>7</button>
        <button className="calc-btn" disabled={!isDec} onClick={() => handleProgNum('8')}>8</button>
        <button className="calc-btn" disabled={!isDec} onClick={() => handleProgNum('9')}>9</button>

        <button className="calc-btn op" disabled={!isHex} onClick={() => handleProgNum('E')}>E</button>
        <button className="calc-btn op" disabled={!isHex} onClick={() => handleProgNum('F')}>F</button>
        <button className="calc-btn" disabled={!isOct} onClick={() => handleProgNum('4')}>4</button>
        <button className="calc-btn" disabled={!isOct} onClick={() => handleProgNum('5')}>5</button>
        <button className="calc-btn" disabled={!isOct} onClick={() => handleProgNum('6')}>6</button>

        <button className="calc-btn op" onClick={() => handleOp('<<')}>&lt;&lt;</button>
        <button className="calc-btn op" onClick={() => handleOp('>>')}>&gt;&gt;</button>
        <button className="calc-btn" onClick={() => handleProgNum('1')}>1</button>
        <button className="calc-btn" onClick={() => handleProgNum('2')}>2</button>
        <button className="calc-btn" disabled={!isOct} onClick={() => handleProgNum('3')}>3</button>

        <button className="calc-btn op" onClick={() => handleOp('AND')}>AND</button>
        <button className="calc-btn op" onClick={() => handleOp('OR')}>OR</button>
        <button className="calc-btn op" onClick={() => handleOp('XOR')}>XOR</button>
        <button className="calc-btn" onClick={() => handleProgNum('0')}>0</button>
        <button className="calc-btn eq" onClick={() => {}}>Not Impl.</button>
      </div>
    );
  };

  return (
    <div className="calculator-app" onClick={() => setShowMenu(false)}>
      <div className="calc-header">
        <button className="calc-icon-btn" onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }}>
          <NavigationRegular />
        </button>
        <div className="calc-mode-title">{mode}</div>
        <button className="calc-icon-btn" onClick={() => setShowHistory(!showHistory)}>
          <HistoryRegular />
        </button>
      </div>

      {showMenu && (
        <div className="calc-mode-menu" onClick={e => e.stopPropagation()}>
          <div className="calc-mode-option" onClick={() => { setMode('Standard'); setShowMenu(false); handleClear(); }}>
            <CalculatorRegular /> Standard
          </div>
          <div className="calc-mode-option" onClick={() => { setMode('Scientific'); setShowMenu(false); handleClear(); }}>
            <MathFormulaRegular /> Scientific
          </div>
          <div className="calc-mode-option" onClick={() => { setMode('Programmer'); setShowMenu(false); handleClear(); setBase(10); }}>
            <CodeRegular /> Programmer
          </div>
        </div>
      )}

      <div className="calc-display">
        <div className="calc-prev-val">{equation}</div>
        <div className="calc-curr-val">{currentVal}</div>
      </div>

      {mode === 'Programmer' && (
        <div className="calc-prog-bases">
          <div className={`calc-prog-base ${base === 16 ? 'active' : ''}`} onClick={() => { setCurrentVal(getProgVal(16)); setBase(16); }}>
            <span className="calc-prog-label">HEX</span>
            <span className="calc-prog-value">{getProgVal(16)}</span>
          </div>
          <div className={`calc-prog-base ${base === 10 ? 'active' : ''}`} onClick={() => { setCurrentVal(getProgVal(10)); setBase(10); }}>
            <span className="calc-prog-label">DEC</span>
            <span className="calc-prog-value">{getProgVal(10)}</span>
          </div>
          <div className={`calc-prog-base ${base === 8 ? 'active' : ''}`} onClick={() => { setCurrentVal(getProgVal(8)); setBase(8); }}>
            <span className="calc-prog-label">OCT</span>
            <span className="calc-prog-value">{getProgVal(8)}</span>
          </div>
          <div className={`calc-prog-base ${base === 2 ? 'active' : ''}`} onClick={() => { setCurrentVal(getProgVal(2)); setBase(2); }}>
            <span className="calc-prog-label">BIN</span>
            <span className="calc-prog-value">{getProgVal(2)}</span>
          </div>
        </div>
      )}

      {mode === 'Standard' && renderStandardKeypad()}
      {mode === 'Scientific' && renderScientificKeypad()}
      {mode === 'Programmer' && renderProgrammerKeypad()}

      <div className={`calc-history-pane ${showHistory ? 'open' : ''}`}>
        <div className="calc-history-header">
          History
          <button className="calc-icon-btn" style={{width: 32, height: 32}} onClick={clearHistory}>
            <DeleteRegular />
          </button>
        </div>
        <div className="calc-history-list">
          {history.length === 0 ? (
            <div style={{padding: '20px', color: '#888', textAlign: 'center'}}>There's no history yet</div>
          ) : (
            history.map((h, i) => (
              <div key={i} className="calc-history-item" onClick={() => setCurrentVal(h.result)}>
                <div className="calc-history-equation">{h.equation}</div>
                <div className="calc-history-result">{h.result}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
