const boardElement = document.getElementById('board');
const currentPlayerElement = document.getElementById('currentPlayer');
const blackCountElement = document.getElementById('blackCount');
const whiteCountElement = document.getElementById('whiteCount');
const resetButton = document.getElementById('resetButton');

const ROWS = 4;
const COLS = 4;
const EMPTY = 0;
const BLACK = 1;
const WHITE = 2;

let board = [];
let currentPlayer = BLACK;

// ゲームボードの初期化
function initializeBoard() {
    board = Array.from({ length: ROWS }, () => Array(COLS).fill(EMPTY));
    board[1][1] = WHITE;
    board[1][2] = BLACK;
    board[2][1] = BLACK;
    board[2][2] = WHITE;
    drawBoard();
    updateInfo();
}

// ゲームボードを描画
function drawBoard() {
    boardElement.innerHTML = '';
    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.row = r;
            cell.dataset.col = c;
            cell.addEventListener('click', handleCellClick);
            
            if (board[r][c] !== EMPTY) {
                const disc = document.createElement('div');
                disc.classList.add('disc');
                if (board[r][c] === BLACK) {
                    disc.classList.add('black');
                } else {
                    disc.classList.add('white');
                }
                cell.appendChild(disc);
            }
            boardElement.appendChild(cell);
        }
    }
}

// セルがクリックされた時の処理
function handleCellClick(event) {
    const row = parseInt(event.target.dataset.row);
    const col = parseInt(event.target.dataset.col);
    
    if (board[row][col] !== EMPTY) return;
    
    const flippedDiscs = getFlippableDiscs(row, col, currentPlayer);
    
    if (flippedDiscs.length > 0) {
        placeDisc(row, col);
        flipDiscs(flippedDiscs);
        
        currentPlayer = (currentPlayer === BLACK) ? WHITE : BLACK;
        
        updateInfo();
        
        // パス判定
        if (!canMove(currentPlayer)) {
            alert(`パス！${(currentPlayer === BLACK) ? '白' : '黒'}の番です。`);
            currentPlayer = (currentPlayer === BLACK) ? WHITE : BLACK;
            if (!canMove(currentPlayer)) {
                endGame();
            }
        }
    }
}

// コマを配置する
function placeDisc(row, col) {
    board[row][col] = currentPlayer;
    drawBoard();
}

// ひっくり返せるコマを取得
function getFlippableDiscs(row, col, player) {
    const opponent = (player === BLACK) ? WHITE : BLACK;
    const directions = [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1],          [0, 1],
        [1, -1], [1, 0], [1, 1]
    ];
    
    let flippable = [];
    
    directions.forEach(([dr, dc]) => {
        let path = [];
        let r = row + dr;
        let c = col + dc;
        
        while (r >= 0 && r < ROWS && c >= 0 && c < COLS && board[r][c] === opponent) {
            path.push({ r, c });
            r += dr;
            c += dc;
        }
        
        if (r >= 0 && r < ROWS && c >= 0 && c < COLS && board[r][c] === player) {
            flippable = flippable.concat(path);
        }
    });
    
    return flippable;
}

// コマをひっくり返す
function flipDiscs(discs) {
    discs.forEach(({ r, c }) => {
        board[r][c] = currentPlayer;
    });
    drawBoard();
}

// 手番の更新
function updateInfo() {
    currentPlayerElement.textContent = (currentPlayer === BLACK) ? '黒' : '白';
    
    let blackCount = 0;
    let whiteCount = 0;
    
    board.forEach(row => {
        row.forEach(cell => {
            if (cell === BLACK) blackCount++;
            if (cell === WHITE) whiteCount++;
        });
    });
    
    blackCountElement.textContent = blackCount;
    whiteCountElement.textContent = whiteCount;
}

// 移動できる場所があるかチェック
function canMove(player) {
    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            if (board[r][c] === EMPTY) {
                if (getFlippableDiscs(r, c, player).length > 0) {
                    return true;
                }
            }
        }
    }
    return false;
}

// ゲーム終了
function endGame() {
    let blackCount = parseInt(blackCountElement.textContent);
    let whiteCount = parseInt(whiteCountElement.textContent);
    
    let winner = '';
    if (blackCount > whiteCount) {
        winner = '黒の勝ち！🎉';
    } else if (whiteCount > blackCount) {
        winner = '白の勝ち！🎉';
    } else {
        winner = '引き分け！🤝';
    }
    
    alert(`ゲーム終了！\n${winner}`);
}

// リセットボタンのイベントリスナー
resetButton.addEventListener('click', initializeBoard);

// ゲーム開始
initializeBoard();