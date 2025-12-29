
let frames = [];
const TOTAL_FRAMES = 9;
let frameIndex = 0;
let frameDelay = 6;
let frameCounter = 0;
// 背景圖片
let bgImg = null;
let bg2Img = null; // 第二關背景
let bg3Img = null; // 第三關背景
// 吹泡泡動畫
let blowFrames = [];
const BLOW_TOTAL = 11; // bobo blow bubbles 裡有 0..10 共 11 張
let blowIndex = 0;
let blowDelay = 6;
let blowCounter = 0;
let blowSprite = null; // 當使用整張 sprite sheet (bolw.png)

// 動作狀態: 'idle' | 'walk' | 'blow'
let action = 'idle';

// Bobo 面向方向（1 = 右, -1 = 左）
let lastDir = 1;

// 第二角色 Snails
let snailImg = null;
const SNAIL_W = 80;
const SNAIL_H = 80;
let snailX = 0;
let snailY = 0;
const SNAIL_SPACING = 8; // 與 bobo 之間的間距
const SNAIL_LERP = 0.18; // 跟隨平滑程度

// 第三角色 Lobster（固定位置，但會面向 Bobo）
let lobsterImg = null;
const LOBSTER_W = 120;
const LOBSTER_H = 120;
let lobsterX = 0;
let lobsterY = 0;
// Lobster animation frames
let lobsterFrames = [];
const LOBSTER_TOTAL = 4;
let lobsterIndex = 0;
let lobsterDelay = 8;
let lobsterCounter = 0;
// Lobster encounter distance：當 Bobo 距離小於此值時視為遇見
const LOBSTER_STOP_DIST = 150;

// 第四角色 Pa（固定位置，播放動畫並面向 Bobo）
let paImg = null;
const PA_W = 120;
const PA_H = 120;
let paFrames = [];
const PA_TOTAL = 7; // Pa 資料夾 0..6.png
let paIndex = 0;
let paDelay = 8;
let paCounter = 0;
let paX = 0;
let paY = 0;

// 第五角色 Sq（固定位置，播放動畫並面向 Bobo）
let sqImg = null;
const SQ_W = 120;
const SQ_H = 120;
let sqFrames = [];
// 先用 1 張作為預設（若之後你加多張可以改成 >1）
const SQ_TOTAL = 1;
let sqIndex = 0;
let sqDelay = 8;
let sqCounter = 0;
let sqX = 0;
let sqY = 0;

// 角色顯示尺寸
const SPRITE_W = 120;
const SPRITE_H = 120;

let xPos, yPos;
let vx = 0;

// 起始說明畫面（需點擊才能進入遊戲）
let startImg = null;
let showStart = true;

// 關卡狀態：1 為第一關（只顯示 Pa + b.png 背景）
let currentLevel = 1;

// 題庫與測驗狀態
let questionsArr = [];
// 內建題庫：若 questions.csv 載入失敗（例如直接以檔案開啟造成瀏覽器拒絕存取），就使用這組預設題目
const DEFAULT_QUESTIONS = [
	{
		id: '1',
		question: '淡江大學教育科技學系主要結合哪兩個領域？',
		optionA: '教育與科技',
		optionB: '醫學與工程',
		answer: 'A',
		hint: '想想「教育科技」這個名稱本身'
	},
	{
		id: '2',
		question: '教育科技學系是否以培養醫療專業人才為主？',
		optionA: '是',
		optionB: '否',
		answer: 'B',
		hint: '重點在教育而非醫療'
	},
	{
		id: '3',
		question: '教育科技學系學生常培養哪一種能力？',
		optionA: '教學設計與數位教材製作',
		optionB: '化工實驗操作',
		answer: 'A',
		hint: '和教學與學習有關'
	},
	{
		id: '4',
		question: '教育科技學系課程是否完全不需要科技工具？',
		optionA: '是',
		optionB: '否',
		answer: 'B',
		hint: '科技是核心元素之一'
	},
	{
		id: '5',
		question: '下列哪一項較符合教育科技學系的學習內容？',
		optionA: '程式與數位學習應用',
		optionB: '道路與橋梁設計',
		answer: 'A',
		hint: '與學習科技相關'
	},
	{
		id: '6',
		question: '教育科技學系是否只學理論、不做實作？',
		optionA: '是',
		optionB: '否',
		answer: 'B',
		hint: '實作與專題很重要'
	},
	{
		id: '7',
		question: '教育科技學系學生是否需要理解學習理論？',
		optionA: '需要',
		optionB: '不需要',
		answer: 'A',
		hint: '教學設計的基礎'
	},
	{
		id: '8',
		question: '教育科技學系畢業後較不可能從事哪一類工作？',
		optionA: '教育訓練相關工作',
		optionB: '外科醫師',
		answer: 'B',
		hint: '哪個和教育科技最無關'
	}
];
let quizActive = false;
let currentQuestion = null;
let quizOwner = null; // 'lobster' | 'pa' | 'sq'
let answerRevealed = false;
let inputText = '';
let lastAsked = { lobster: 0, pa: 0, sq: 0 };
const ASK_COOLDOWN = 3000; // ms

// 第一關 Pa 問答（使用 questions.csv）
let paTable = null;
let paQuestions = [];
let paQuizActive = false;
let paCurrentQ = null;
let paCorrectCount = 0;
let paFeedback = '';
let paAnsweredIds = new Set();
let paOptionBoxes = [];
let paShowSnailsHint = false; // snails 給予提示
let paMessage = ''; // Pa 的對話提示
let paMessageTime = 0;

// 第二關 Sq 問答（使用 questions.csv，但排除已答過的題目）
let sqQuizActive = false;
let sqCurrentQ = null;
let sqCorrectCount = 0;
let sqFeedback = '';
let sqAnsweredIds = new Set();
let sqOptionBoxes = [];
let sqShowSnailsHint = false; // snails 給予提示
let sqMessage = ''; // Sq 的對話提示
let sqMessageTime = 0;
let sqReadyToTransition = false; // 第二關完成後準備進入第三關

// 第三關 Lobster 問答（沿用 questions.csv，避免重複）
let lobsterQuizActive = false;
let lobsterCurrentQ = null;
let lobsterFeedback = '';
let lobsterAnsweredIds = new Set();
let lobsterOptionBoxes = [];
let lobsterCorrectCount = 0;
let lobsterShowSnailsHint = false;

// 遊戲通關狀態（Sq 答對兩題後進入）
let gameCleared = false;
let lastLevel = 1; // 用於偵測關卡切換

// 泡泡轉場特效
let bubbleTransition = false;
let bubbles = [];
let transitionStartTime = 0;
const TRANSITION_DURATION = 1000; // 2秒，縮短轉場時間
let transitionTargetLevel = 2; // 轉場目標關卡（1->2 或 2->3）

// 關卡開場畫面水平移入
const LEVEL_INTRO_DURATION = 1200; // ms
let levelIntro = { active: false, start: 0, level: 0 };

// 煙火特效（通關後）
let fireworks = [];
let fireworksActive = false;
let fireworksStart = 0;
const FIREWORK_DURATION = 4000;

// 進度條與結局相關狀態
const PROGRESS_BAR_HEIGHT = 18;
const PROGRESS_STOPS = [
	{ t: 0.0, c: [255, 99, 146] },
	{ t: 0.25, c: [255, 168, 88] },
	{ t: 0.5, c: [255, 242, 117] },
	{ t: 0.75, c: [120, 221, 255] },
	{ t: 1.0, c: [189, 128, 255] }
];
let showEndingOverlay = false;
let restartBtn = { x: 0, y: 0, w: 220, h: 56 };

// 垂直運動參數
let vy = 0;
const GRAVITY = 0.6;
const JUMP_V = -12;
let groundY; // 地面 y 座標
let onGround = true;

function preload() {
	// 載入背景圖片
	bgImg = loadImage('libraries/b.png');
	bg2Img = loadImage('libraries/sbj.png'); // 第二關背景
	bg3Img = loadImage('libraries/unnamed.jpg'); // 第三關背景

	// 載入起始說明圖片
	startImg = loadImage('libraries/ST.png');

	// 載入 questions.csv（Pa 問答用）；若載入失敗則用內建題庫
	paTable = loadTable(
		'questions.csv',
		'csv',
		'header',
		table => {
			paTable = table;
		},
		err => {
			console.warn('載入 questions.csv 失敗，改用內建題庫。', err);
			paTable = null;
			paQuestions = DEFAULT_QUESTIONS.map(q => ({ ...q }));
		}
	);

	for (let i = 0; i < TOTAL_FRAMES; i++) {
		frames[i] = loadImage('bobo/bobo walk/' + i + '.png');
	}

	// 載入整張 sprite sheet（如果存在）
	blowSprite = loadImage('bobo/bobo blow bubbles/bolw.png',
		() => {},
		() => {
			// 若載入失敗則退回到單張檔案載入（容錯）
			for (let i = 0; i < BLOW_TOTAL; i++) {
				blowFrames[i] = loadImage('bobo/bobo blow bubbles/' + i + '.png');
				if (blowFrames[i] && blowFrames[i].resize) {
					blowFrames[i].resize(SPRITE_W, SPRITE_H);
				}
			}
		}
	);

	// 載入 snail 圖片（單張）
	snailImg = loadImage('snails/snails.png');
	
	// 載入 lobster 連續影格（0..3.png），若沒檔案則 lobsterFrames 會是空陣列
	for (let i = 0; i < LOBSTER_TOTAL; i++) {
		lobsterFrames[i] = loadImage('lobster/' + i + '.png');
	}
	// fallback 單張 lobster.png
	lobsterImg = loadImage('lobster/lobster.png');

	// 嘗試載入單張 pa.png（fallback），paFrames 由 Pa/0..6.png 優先
	paImg = loadImage('Pa/pa.png');

	// 載入 Pa 連續影格（0..6.png），若沒檔案則 paFrames 會是空陣列
	for (let i = 0; i < PA_TOTAL; i++) {
		paFrames[i] = loadImage('Pa/' + i + '.png');
	}

	// 載入 Sq（sq/0.png）或更多影格（目前只有 0.png）
	for (let i = 0; i < SQ_TOTAL; i++) {
		sqFrames[i] = loadImage('sq/' + i + '.png');
	}

	// 嘗試載入單張 sq.png 作為 fallback
	sqImg = loadImage('sq/0.png');
}

function setup() {
	createCanvas(windowWidth, windowHeight);
	imageMode(CENTER);
	xPos = width / 2;
	groundY = height * 0.75;
	yPos = groundY;

	// 若成功載入 sprite sheet，則在 setup 時切割成單張影格
	if (blowSprite && blowSprite.width > 0) {
		// 先嘗試以固定 60x60 格子切割（支援多列多行的 sprite sheet）
		let cols = floor(blowSprite.width / SPRITE_W);
		let rows = floor(blowSprite.height / SPRITE_H);
		if (cols * rows >= BLOW_TOTAL && cols > 0 && rows > 0) {
			for (let i = 0; i < BLOW_TOTAL; i++) {
				let cx = i % cols;
				let cy = floor(i / cols);
				blowFrames[i] = blowSprite.get(cx * SPRITE_W, cy * SPRITE_H, SPRITE_W, SPRITE_H);
				if (blowFrames[i] && blowFrames[i].resize) blowFrames[i].resize(SPRITE_W, SPRITE_H);
			}
		} else {
			// 否則退回到平均橫向切割（舊行為），再強制 resize
			let frameW = floor(blowSprite.width / BLOW_TOTAL);
			for (let i = 0; i < BLOW_TOTAL; i++) {
				blowFrames[i] = blowSprite.get(i * frameW, 0, frameW, blowSprite.height);
				if (blowFrames[i] && blowFrames[i].resize) blowFrames[i].resize(SPRITE_W, SPRITE_H);
			}
		}
	}

	// 初始化 snail 位置，放在 bobo 後方
	snailX = xPos - lastDir * (SPRITE_W / 2 + SNAIL_W / 2 + SNAIL_SPACING);
	snailY = yPos;

	// 如載入 snail 圖且可調整大小，先 resize
	if (snailImg && snailImg.resize) snailImg.resize(SNAIL_W, SNAIL_H);

	// 初始化 lobster 位置（固定於畫面右側，貼近地面）
	lobsterX = width * 0.82;
	lobsterY = groundY;

	// resize lobster image（fallback）
	if (lobsterImg && lobsterImg.resize) lobsterImg.resize(LOBSTER_W, LOBSTER_H);

	// resize lobster frames（若有載入 frames）
	for (let i = 0; i < LOBSTER_TOTAL; i++) {
		if (lobsterFrames[i] && lobsterFrames[i].resize) lobsterFrames[i].resize(LOBSTER_W, LOBSTER_H);
	}

	// resize Pa frames（若有載入 frames）
	for (let i = 0; i < PA_TOTAL; i++) {
		if (paFrames[i] && paFrames[i].resize) paFrames[i].resize(PA_W, PA_H);
	}

	// 初始化 pa 位置（固定於畫面左側，貼近地面）
	paX = width * 0.18;
	paY = groundY;

	// resize sq frames（若有載入 frames）
	for (let i = 0; i < SQ_TOTAL; i++) {
		if (sqFrames[i] && sqFrames[i].resize) sqFrames[i].resize(SQ_W, SQ_H);
	}

	// 初始化 sq 位置（固定於畫面中間偏左），放在地面
	sqX = width * 0.5;
	sqY = groundY;

	// 解析 questions.csv 到 paQuestions
	if (paTable) {
		paQuestions = [];
		for (let r = 0; r < paTable.getRowCount(); r++) {
			let row = paTable.getRow(r);
			paQuestions.push({
				id: row.getString('id'),
				question: row.getString('question'),
				optionA: row.getString('optionA'),
				optionB: row.getString('optionB'),
				answer: row.getString('answer'),
				hint: row.getString('hint')
			});
		}
	} else if (!paQuestions || paQuestions.length === 0) {
		// CSV 沒載到時，退回內建題庫
		paQuestions = DEFAULT_QUESTIONS.map(q => ({ ...q }));
	}
}

function pickPaQuestion() {
	if (!paQuestions || paQuestions.length === 0) return null;
	// 避免重複：過濾尚未答過的題目；若全部答過則重置
	let pool = paQuestions.filter(q => !paAnsweredIds.has(q.id));
	if (pool.length === 0) {
		paAnsweredIds.clear();
		pool = paQuestions.slice();
	}
	return random(pool);
}

function startPaQuiz() {
	paCurrentQ = pickPaQuestion();
	if (!paCurrentQ) return;
	paQuizActive = true;
	paFeedback = '';
}

// 第二關 Sq 問答函數
function pickSqQuestion() {
	if (!paQuestions || paQuestions.length === 0) return null;
	// 排除第一關和第二關已答過的題目
	let allAnsweredIds = new Set([...paAnsweredIds, ...sqAnsweredIds]);
	let pool = paQuestions.filter(q => !allAnsweredIds.has(q.id));
	if (pool.length === 0) {
		// 若全部答過，只排除第二關已答過的
		pool = paQuestions.filter(q => !sqAnsweredIds.has(q.id));
		if (pool.length === 0) {
			sqAnsweredIds.clear();
			pool = paQuestions.slice();
		}
	}
	return random(pool);
}

function startSqQuiz() {
	sqCurrentQ = pickSqQuestion();
	if (!sqCurrentQ) return;
	sqQuizActive = true;
	sqFeedback = '';
	sqShowSnailsHint = false;
}

// 第三關 Lobster 問答函數
function pickLobsterQuestion() {
	if (!paQuestions || paQuestions.length === 0) return null;
	if (lobsterCorrectCount >= 2) return null; // 只需要兩題
	// 排除已在 Pa、Sq、Lobster 作答過的題目，盡量不重複
	let allAnsweredIds = new Set([
		...paAnsweredIds,
		...sqAnsweredIds,
		...lobsterAnsweredIds
	]);
	let pool = paQuestions.filter(q => !allAnsweredIds.has(q.id));
	if (pool.length === 0) {
		// 若都答過，重置 Lobster 自己的記錄再取題
		lobsterAnsweredIds.clear();
		pool = paQuestions.slice();
	}
	return random(pool);
}

function startLobsterQuiz() {
	lobsterCurrentQ = pickLobsterQuestion();
	if (!lobsterCurrentQ) return;
	lobsterQuizActive = true;
	lobsterFeedback = '';
	lobsterShowSnailsHint = false;
}

function handleSqAnswer(choice) {
	if (!sqQuizActive || !sqCurrentQ) return;
	if (choice.toUpperCase() === sqCurrentQ.answer.toUpperCase()) {
		sqFeedback = '答對了！';
		sqShowSnailsHint = false;
		sqCorrectCount++;
		sqAnsweredIds.add(sqCurrentQ.id);
		
		if (sqCorrectCount === 1) {
			// 答對第一題，Sq 給提示
			sqMessage = '很棒！再答對一題就過關囉！';
			sqMessageTime = millis();
		}
		
		if (sqCorrectCount >= 2) {
			// 答對兩題，關閉問答，讓 Bobo 跑到右邊界再觸發轉場
			sqQuizActive = false;
			sqCurrentQ = null;
			sqMessage = '恭喜過關！往右跑，就會進到第三關！';
			sqMessageTime = millis();
			sqReadyToTransition = true;
			return;
		}
		// 需要下一題
		sqCurrentQ = pickSqQuestion();
		sqFeedback = '答對了！進入下一題';
	} else {
		sqFeedback = '答錯了';
		sqShowSnailsHint = true; // 啟用 snails 提示
	}
}

function handleLobsterAnswer(choice) {
	if (!lobsterQuizActive || !lobsterCurrentQ) return;
	if (choice.toUpperCase() === lobsterCurrentQ.answer.toUpperCase()) {
		lobsterFeedback = '答對了！';
		lobsterAnsweredIds.add(lobsterCurrentQ.id);
		lobsterCorrectCount++;
		lobsterShowSnailsHint = false;
		if (lobsterCorrectCount >= 2) {
			lobsterQuizActive = false;
			lobsterCurrentQ = null;
			lobsterFeedback = '全部答對了！';
			// 觸發煙火與通關訊息
			fireworksActive = true;
			fireworksStart = millis();
			fireworks = [];
			spawnFirework();
			gameCleared = true;
			showEndingOverlay = true;
			vx = 0;
			return;
		}
		// 還需要下一題
		lobsterCurrentQ = pickLobsterQuestion();
		if (!lobsterCurrentQ) {
			lobsterQuizActive = false;
			lobsterFeedback = '沒有更多題目';
		}
	} else {
		lobsterFeedback = '答錯了，再試一次';
		lobsterShowSnailsHint = true;
	}
}

function handlePaAnswer(choice) {
	if (!paQuizActive || !paCurrentQ) return;
	if (choice.toUpperCase() === paCurrentQ.answer.toUpperCase()) {
		paFeedback = '答對了！';
		paShowSnailsHint = false;
		paCorrectCount++;
		paAnsweredIds.add(paCurrentQ.id);
		
		if (paCorrectCount === 1) {
			// 答對第一題，Pa 給提示
			paMessage = '很棒！再答對一題就可以往右跑去第二關啦！';
			paMessageTime = millis();
		}
		
		if (paCorrectCount >= 2) {
			// 答對兩題，關閉問答，讓 Bobo 跑到右邊界再觸發轉場
			paQuizActive = false;
			paCurrentQ = null;
			paMessage = '太棒了！往右跑出發去第二關！';
			paMessageTime = millis();
			// 不立即觸發泡泡，等待 Bobo 跑到右邊界
			return;
		}
		// 需要下一題
		paCurrentQ = pickPaQuestion();
		paFeedback = '答對了！進入下一題';
	} else {
		paFeedback = '答錯了';
		paShowSnailsHint = true; // 啟用 snails 提示
	}
}

function drawPaQuizOverlay() {
	if (!paQuizActive || !paCurrentQ) return;
	paOptionBoxes = [];
	push();
	// 半透明底色置於上方，不擋住角色
	let boxW = min(width * 0.9, 560);
	let boxH = min(height * 0.35, 220);
	let bx = (width - boxW) / 2;
	let by = 20;
	fill(255, 255, 255, 200);
	stroke(0, 80);
	strokeWeight(2);
	rect(bx, by, boxW, boxH, 12);

	fill(0);
	noStroke();
	textAlign(LEFT, TOP);
	textSize(20);
	let pad = 18;
	let y = by + pad;
	text('題目：' + paCurrentQ.question, bx + pad, y, boxW - pad * 2, boxH - pad * 2);

	y += 65;
	textSize(18);
	let btnW = min(boxW * 0.4, 200);
	let btnH = 52; // 增高以容納較長的選項文字
	let btnGap = 20;
	let btnX = bx + (boxW - btnW * 2 - btnGap) / 2;
	let btnY = y;

	// 選項 A 按鈕
	let btnA_X = btnX;
	let btnA_Y = btnY;
	let hoverA = (mouseX >= btnA_X && mouseX <= btnA_X + btnW &&
	             mouseY >= btnA_Y && mouseY <= btnA_Y + btnH);
	fill(hoverA ? color(100, 200, 100) : color(150, 220, 150));
	stroke(0, 100);
	strokeWeight(2);
	rect(btnA_X, btnA_Y, btnW, btnH, 8);
	fill(0);
	noStroke();
	textAlign(LEFT, CENTER);
	text('(A) ' + paCurrentQ.optionA, btnA_X + 10, btnA_Y + 4, btnW - 20, btnH - 8);

	// 選項 B 按鈕
	let btnB_X = btnX + btnW + btnGap;
	let btnB_Y = btnY;
	let hoverB = (mouseX >= btnB_X && mouseX <= btnB_X + btnW &&
	             mouseY >= btnB_Y && mouseY <= btnB_Y + btnH);
	fill(hoverB ? color(100, 150, 250) : color(150, 180, 255));
	stroke(0, 100);
	strokeWeight(2);
	rect(btnB_X, btnB_Y, btnW, btnH, 8);
	fill(0);
	noStroke();
	textAlign(LEFT, CENTER);
	text('(B) ' + paCurrentQ.optionB, btnB_X + 10, btnB_Y + 4, btnW - 20, btnH - 8);

	paOptionBoxes = [
		{ x: btnA_X, y: btnA_Y, w: btnW, h: btnH, choice: 'A' },
		{ x: btnB_X, y: btnB_Y, w: btnW, h: btnH, choice: 'B' }
	];

	// 提示/回饋文字
	let tipY = btnB_Y + btnH + 12;
	textAlign(LEFT, TOP);
	textSize(16);

	// 如果答錯，顯示 snails 給予提示
	if (paShowSnailsHint && paCurrentQ.hint) {
		// 繪製 snails 在左側（靠近提示文字）- 縮小尺寸
		let snailDrawX = btnX + 20;
		let snailDrawY = tipY + 20;
		let hintSnailW = SNAIL_W * 0.5; // 縮小為原來的一半
		let hintSnailH = SNAIL_H * 0.5;
		push();
		if (snailImg) {
			image(snailImg, snailDrawX, snailDrawY, hintSnailW, hintSnailH);
		}
		pop();

		// snails 旁邊顯示提示文字
		fill(220, 100, 100);
		textAlign(LEFT, TOP);
		textSize(15);
		text('提示：' + paCurrentQ.hint, snailDrawX + hintSnailW + 12, snailDrawY);
	} else {
		fill(40, 120, 40);
		text('可按 A/B 或點擊選項作答', btnX, tipY);
	}
	pop();
}

function drawSqQuizOverlay() {
	if (!sqQuizActive || !sqCurrentQ) return;
	sqOptionBoxes = [];
	push();
	// 半透明底色置於上方，不擋住角色
	let boxW = min(width * 0.9, 560);
	let boxH = min(height * 0.35, 220);
	let bx = (width - boxW) / 2;
	let by = 20;
	fill(255, 255, 255, 200);
	stroke(0, 80);
	strokeWeight(2);
	rect(bx, by, boxW, boxH, 12);

	fill(0);
	noStroke();
	textAlign(LEFT, TOP);
	textSize(20);
	let pad = 18;
	let y = by + pad;
	text('題目：' + sqCurrentQ.question, bx + pad, y, boxW - pad * 2, boxH - pad * 2);

	y += 65;
	textSize(18);
	let btnW = min(boxW * 0.4, 200);
	let btnH = 52; // 增高以容納較長的選項文字
	let btnGap = 20;
	let btnX = bx + (boxW - btnW * 2 - btnGap) / 2;
	let btnY = y;

	// 選項 A 按鈕
	let btnA_X = btnX;
	let btnA_Y = btnY;
	let hoverA = (mouseX >= btnA_X && mouseX <= btnA_X + btnW &&
	             mouseY >= btnA_Y && mouseY <= btnA_Y + btnH);
	fill(hoverA ? color(100, 200, 100) : color(150, 220, 150));
	stroke(0, 100);
	strokeWeight(2);
	rect(btnA_X, btnA_Y, btnW, btnH, 8);
	fill(0);
	noStroke();
	textAlign(LEFT, CENTER);
	text('(A) ' + sqCurrentQ.optionA, btnA_X + 10, btnA_Y + 4, btnW - 20, btnH - 8);

	// 選項 B 按鈕
	let btnB_X = btnX + btnW + btnGap;
	let btnB_Y = btnY;
	let hoverB = (mouseX >= btnB_X && mouseX <= btnB_X + btnW &&
	             mouseY >= btnB_Y && mouseY <= btnB_Y + btnH);
	fill(hoverB ? color(100, 150, 250) : color(150, 180, 255));
	stroke(0, 100);
	strokeWeight(2);
	rect(btnB_X, btnB_Y, btnW, btnH, 8);
	fill(0);
	noStroke();
	textAlign(LEFT, CENTER);
	text('(B) ' + sqCurrentQ.optionB, btnB_X + 10, btnB_Y + 4, btnW - 20, btnH - 8);

	sqOptionBoxes = [
		{ x: btnA_X, y: btnA_Y, w: btnW, h: btnH, choice: 'A' },
		{ x: btnB_X, y: btnB_Y, w: btnW, h: btnH, choice: 'B' }
	];

	// 提示/回饋文字
	let tipY = btnB_Y + btnH + 12;
	textAlign(LEFT, TOP);
	textSize(16);

	// 如果答錯，顯示 snails 給予提示
	if (sqShowSnailsHint && sqCurrentQ.hint) {
		// 繪製 snails 在左側（靠近提示文字）- 縮小尺寸
		let snailDrawX = btnX + 20;
		let snailDrawY = tipY + 20;
		let hintSnailW = SNAIL_W * 0.5; // 縮小為原來的一半
		let hintSnailH = SNAIL_H * 0.5;
		push();
		if (snailImg) {
			image(snailImg, snailDrawX, snailDrawY, hintSnailW, hintSnailH);
		}
		pop();

		// snails 旁邊顯示提示文字
		fill(220, 100, 100);
		textAlign(LEFT, TOP);
		textSize(15);
		text('提示：' + sqCurrentQ.hint, snailDrawX + hintSnailW + 12, snailDrawY);
	} else {
		fill(40, 120, 40);
		text('可按 A/B 或點擊選項作答', btnX, tipY);
	}
	pop();
}

function drawLobsterQuizOverlay() {
	if (!lobsterQuizActive || !lobsterCurrentQ) return;
	lobsterOptionBoxes = [];
	push();
	let boxW = min(width * 0.9, 560);
	let boxH = min(height * 0.35, 220);
	let bx = (width - boxW) / 2;
	let by = 20;
	fill(255, 255, 255, 200);
	stroke(0, 80);
	strokeWeight(2);
	rect(bx, by, boxW, boxH, 12);

	fill(0);
	noStroke();
	textAlign(LEFT, TOP);
	textSize(20);
	let pad = 18;
	let y = by + pad;
	text('題目：' + lobsterCurrentQ.question, bx + pad, y, boxW - pad * 2, boxH - pad * 2);

	y += 65;
	textSize(18);
	let btnW = min(boxW * 0.4, 200);
	let btnH = 52;
	let btnGap = 20;
	let btnX = bx + (boxW - btnW * 2 - btnGap) / 2;
	let btnY = y;

	let btnA_X = btnX;
	let btnA_Y = btnY;
	let hoverA = (mouseX >= btnA_X && mouseX <= btnA_X + btnW &&
	             mouseY >= btnA_Y && mouseY <= btnA_Y + btnH);
	fill(hoverA ? color(100, 200, 100) : color(150, 220, 150));
	stroke(0, 100);
	strokeWeight(2);
	rect(btnA_X, btnA_Y, btnW, btnH, 8);
	fill(0);
	noStroke();
	textAlign(LEFT, CENTER);
	text('(A) ' + lobsterCurrentQ.optionA, btnA_X + 10, btnA_Y + 4, btnW - 20, btnH - 8);

	let btnB_X = btnX + btnW + btnGap;
	let btnB_Y = btnY;
	let hoverB = (mouseX >= btnB_X && mouseX <= btnB_X + btnW &&
	             mouseY >= btnB_Y && mouseY <= btnB_Y + btnH);
	fill(hoverB ? color(100, 150, 250) : color(150, 180, 255));
	stroke(0, 100);
	strokeWeight(2);
	rect(btnB_X, btnB_Y, btnW, btnH, 8);
	fill(0);
	noStroke();
	textAlign(LEFT, CENTER);
	text('(B) ' + lobsterCurrentQ.optionB, btnB_X + 10, btnB_Y + 4, btnW - 20, btnH - 8);

	lobsterOptionBoxes = [
		{ x: btnA_X, y: btnA_Y, w: btnW, h: btnH, choice: 'A' },
		{ x: btnB_X, y: btnB_Y, w: btnW, h: btnH, choice: 'B' }
	];

	let tipY = btnB_Y + btnH + 12;
	textAlign(LEFT, TOP);
	textSize(16);

	// 如果答錯，顯示 snails 提示
	if (lobsterShowSnailsHint && lobsterCurrentQ.hint) {
		let snailDrawX = btnX + 20;
		let snailDrawY = tipY + 20;
		let hintSnailW = SNAIL_W * 0.5;
		let hintSnailH = SNAIL_H * 0.5;
		push();
		if (snailImg) image(snailImg, snailDrawX, snailDrawY, hintSnailW, hintSnailH);
		pop();
		fill(220, 100, 100);
		textAlign(LEFT, TOP);
		textSize(15);
		text('提示：' + lobsterCurrentQ.hint, snailDrawX + hintSnailW + 12, snailDrawY, boxW - (snailDrawX + hintSnailW + 12 - bx) - pad, 60);
	} else {
		fill(40, 120, 40);
		text(lobsterFeedback ? lobsterFeedback : '可按 A/B 或點擊選項作答', btnX, tipY, boxW - 2 * pad, 40);
	}
	pop();
}

function drawSqMessage() {
	if (!sqMessage || millis() - sqMessageTime > 3000) {
		sqMessage = '';
		return;
	}
	
	push();
	// 在 Sq 頭上顯示對話框
	let msgX = sqX;
	let msgY = sqY - SQ_H / 2 - 70;
	let msgW = 320;
	let msgH = 60;
	
	fill(255, 255, 255, 220);
	stroke(0, 100);
	strokeWeight(2);
	rect(msgX - msgW / 2, msgY, msgW, msgH, 10);
	
	// 對話尖角
	triangle(msgX - 10, msgY + msgH, msgX + 10, msgY + msgH, msgX, msgY + msgH + 10);
	
	fill(0);
	noStroke();
	textAlign(CENTER, CENTER);
	textSize(15);
	// 確保文字在框內，使用 text 的寬高限制
	text(sqMessage, msgX - msgW / 2 + 10, msgY + 5, msgW - 20, msgH - 10);
	pop();
}

function startBubbleTransition(targetLevel = 2) {
	bubbleTransition = true;
	transitionTargetLevel = targetLevel;
	transitionStartTime = millis();
	bubbles = [];
	// 轉場開始即把 Bobo 放到畫面左側並停下，避免之後瞬移
	xPos = SPRITE_W / 2 + 20;
	yPos = groundY;
	vy = 0;
	vx = 0;
	snailX = xPos - lastDir * (SPRITE_W / 2 + SNAIL_W / 2 + SNAIL_SPACING);
	snailY = yPos;
	// 生成大量泡泡鋪滿畫面（起始就有泡泡在各處，填滿轉場）
	let bubbleCount = floor((width * height) / 1400); // 再減少泡泡數量，讓轉場更清爽
	for (let i = 0; i < bubbleCount; i++) {
		bubbles.push({
			x: random(-width * 0.1, width * 1.1),
			y: random(height),
			size: random(20, 100),
			speedX: random(1.2, 3),
			speedY: random(-3, -0.5),
			wobble: random(0.8, 1.4),
			alpha: random(180, 255)
		});
	}
}

function updateBubbleTransition() {
	if (!bubbleTransition) return;
	
	let elapsed = millis() - transitionStartTime;
	
	// 更新泡泡位置（由右往左）
	for (let b of bubbles) {
		b.x -= b.speedX;
		b.y += b.speedY;
		b.y += sin(frameCount * 0.04 + b.x * 0.012) * 1.4 * b.wobble; // 微搖晃，像海底泡泡
	}

	// 計算目標關卡背景移入的進度（從右側移入）
	let progress = min(elapsed / TRANSITION_DURATION, 1);
	let bgOffsetX = (1 - progress) * width; // 背景從右側移入
	// 角色在轉場時跟隨目標場景偏移進場
	let actorOffsetX = (transitionTargetLevel === 1) ? 0 : bgOffsetX;

	// 選擇目標關卡背景
	let targetBg = null;
	if (transitionTargetLevel === 2) targetBg = bg2Img;
	else if (transitionTargetLevel === 3) targetBg = bg3Img;

	// 繪製目標關卡背景（伴隨泡泡移入）
	if (targetBg && targetBg.width > 0) {
		push();
		image(targetBg, width / 2 + bgOffsetX, height / 2, width, height);
		pop();
	} else {
		background(205, 230, 255);
	}
	
	// 先鋪一層柔和色塊，讓畫面更像被泡泡填滿
	push();
	noStroke();
	for (let i = 0; i < 6; i++) {
		let t = i / 5;
		let col = sampleGradient(t);
		fill(col[0], col[1], col[2], 30);
		rect(0, (height / 6) * i, width, height / 6 + 1);
	}
	pop();

	// 繪製泡泡（僅繪製在畫面內的泡泡），靠左與轉場後段漸縮，有漸漸破掉感
	push();
	noStroke();
	let fadeFactor = 1 - min(progress, 1) * 0.2; // 保持泡泡存在感
	let fadeOut = constrain((progress - 0.65) / 0.35, 0, 1); // 0.65 之後開始收斂
	let popFactor = 1 - fadeOut; // 越接近完成越小
	for (let b of bubbles) {
		if (b.x > -b.size) {
			let edgeFade = constrain((b.x + b.size) / (b.size * 1.2), 0, 1);
			let sz = b.size * edgeFade * popFactor;
			let alpha = b.alpha * fadeFactor * edgeFade * popFactor;
			fill(200, 230, 255, alpha);
			ellipse(b.x, b.y, sz);
			fill(255, 255, 255, alpha * 0.5);
			ellipse(b.x - sz * 0.2, b.y - sz * 0.2, sz * 0.32);
			// 邊界時給一個微亮泡泡破裂光（轉場尾端亮度降低）
			if (edgeFade < 0.22) {
				let popAlpha = alpha * map(edgeFade, 0, 0.22, 0, 0.6) * popFactor;
				fill(255, 255, 255, popAlpha);
				ellipse(b.x, b.y, sz * 0.55);
			}
		}
	}
	pop();

	// 轉場期間同步顯示目標關主（第二關: Sq，第三關: Lobster）
	if (transitionTargetLevel === 2) {
		let sqDrawX = width / 2 + bgOffsetX;
		let sqDrawY = groundY;
		push();
		translate(sqDrawX, sqDrawY);
		let sqFacing = (xPos >= sqDrawX) ? 1 : -1;
		if (sqFacing < 0) scale(-1, 1);
		if (sqFrames[0]) {
			image(sqFrames[sqIndex], 0, 0, SQ_W, SQ_H);
		} else if (sqImg) {
			image(sqImg, 0, 0, SQ_W, SQ_H);
		}
		pop();
	} else if (transitionTargetLevel === 3) {
		// 更新 Lobster 動畫影格（轉場也運作）
		lobsterCounter++;
		if (lobsterCounter >= lobsterDelay) {
			lobsterCounter = 0;
			lobsterIndex = (lobsterIndex + 1) % LOBSTER_TOTAL;
		}
		let lobDrawX = width / 2 + bgOffsetX;
		let lobDrawY = groundY;
		push();
		translate(lobDrawX, lobDrawY);
		let lobFacing = (xPos >= lobDrawX) ? 1 : -1;
		if (lobFacing < 0) scale(-1, 1);
		if (lobsterFrames[lobsterIndex]) {
			image(lobsterFrames[lobsterIndex], 0, 0, LOBSTER_W, LOBSTER_H);
		} else if (lobsterImg) {
			image(lobsterImg, 0, 0, LOBSTER_W, LOBSTER_H);
		}
		pop();
	}
	
	// 在轉場期間繪製 Bobo 和 Snails（讓它們保持可見）
	// 更新 Bobo 動畫影格
	if (vx !== 0) {
		frameCounter++;
		if (frameCounter >= frameDelay) {
			frameCounter = 0;
			frameIndex = (frameIndex + 1) % TOTAL_FRAMES;
		}
	}
	
	// 繪製 Snails（隨場景偏移）
	push();
	translate(snailX + actorOffsetX, snailY);
	if (lastDir < 0) scale(-1, 1);
	if (snailImg) image(snailImg, 0, 0, SNAIL_W, SNAIL_H);
	pop();
	
	// 繪製 Bobo（隨場景偏移）
	push();
	translate(xPos + actorOffsetX, yPos);
	if (lastDir < 0) scale(-1, 1);
	if (frames[frameIndex]) image(frames[frameIndex], 0, 0, SPRITE_W, SPRITE_H);
	pop();
	
	// 轉場結束：主要條件泡泡全出左側，防呆超時也結束
	let readyToFinish = elapsed >= TRANSITION_DURATION * 0.55;
	let allBubblesGone = readyToFinish && bubbles.every(b => b.x < -100);
	let timeUp = elapsed >= TRANSITION_DURATION + 1200;

	if (allBubblesGone || timeUp) {
		bubbleTransition = false;
		currentLevel = transitionTargetLevel; // 切換到目標關卡
		// Bobo 進入位置：統一停在畫面左側
		xPos = SPRITE_W / 2 + 20;
		yPos = groundY;
		vy = 0;
		vx = 0; // 停在左側，等轉場結束後再行動
		// Snails 也跟著從左側進入
		snailX = xPos - lastDir * (SPRITE_W / 2 + SNAIL_W / 2 + SNAIL_SPACING);
		snailY = yPos;
		// 若是第二關轉第三關，重置旗標
		if (transitionTargetLevel === 3) {
			sqReadyToTransition = false;
		}
		// 轉場結束後移除泡泡
		bubbles = [];
	}
}

// 取得多段彩色漸層顏色
function sampleGradient(t) {
	t = constrain(t, 0, 1);
	for (let i = 0; i < PROGRESS_STOPS.length - 1; i++) {
		let a = PROGRESS_STOPS[i];
		let b = PROGRESS_STOPS[i + 1];
		if (t >= a.t && t <= b.t) {
			let localT = (t - a.t) / (b.t - a.t + 0.0001);
			return [
				lerp(a.c[0], b.c[0], localT),
				lerp(a.c[1], b.c[1], localT),
				lerp(a.c[2], b.c[2], localT)
			];
		}
	}
	let last = PROGRESS_STOPS[PROGRESS_STOPS.length - 1].c;
	return [last[0], last[1], last[2]];
}

function getProgressValue() {
	let p1 = constrain(paCorrectCount, 0, 2) / 2; // 第一關 0~1
	let p2 = constrain(sqCorrectCount, 0, 2) / 2; // 第二關 0~1
	let p3 = constrain(lobsterCorrectCount, 0, 2) / 2; // 第三關 0~1
	return (p1 + p2 + p3) / 3; // 均分三關
}

function drawProgressBar() {
	// 起始畫面不顯示
	if (showStart) return;
	let barW = min(width * 0.85, 640);
	let barH = PROGRESS_BAR_HEIGHT;
	let barX = (width - barW) / 2;
	let barY = height - barH - 18;
	let prog = getProgressValue();

	// 底色
	push();
	noStroke();
	fill(0, 0, 0, 120);
	rect(barX - 10, barY - 10, barW + 20, barH + 24, 14);
	fill(255, 255, 255, 40);
	rect(barX, barY, barW, barH, 10);

	// 彩色漸層進度
	let filledW = barW * prog;
	for (let i = 0; i < filledW; i += 6) {
		let t = i / barW;
		let col = sampleGradient(t);
		fill(col[0], col[1], col[2], 220);
		rect(barX + i, barY, 8, barH, 6);
	}

	// 邊框與刻度
	stroke(255, 255, 255, 140);
	strokeWeight(1.5);
	noFill();
	rect(barX, barY, barW, barH, 10);
	let tickCount = 3;
	for (let i = 1; i < tickCount; i++) {
		let tx = barX + (barW / tickCount) * i;
		stroke(255, 255, 255, 120);
		line(tx, barY - 6, tx, barY + barH + 6);
	}

	// 標籤
	noStroke();
	fill(255);
	textAlign(CENTER, CENTER);
	textSize(14);
	let labels = ['Pa', 'Sq', 'Lobster'];
	for (let i = 0; i < labels.length; i++) {
		let lx = barX + (barW / labels.length) * i + barW / (labels.length * 2);
		text(labels[i], lx, barY - 12);
	}

	// 完成提示
	if (gameCleared) {
		fill(255);
		textSize(16);
		text('恭喜全部完成！', barX + barW + 70, barY + barH / 2 + 2);
	}
	pop();
}

// 煙火產生與繪製
function spawnFirework() {
	let palette = [
		[255, 140, 140],
		[255, 214, 102],
		[144, 218, 255],
		[193, 157, 255],
		[120, 255, 190]
	];
	let baseColor = random(palette);
	let px = random(width * 0.12, width * 0.88);
	let py = random(height * 0.15, height * 0.55);
	let particles = [];
	let count = 38;
	for (let i = 0; i < count; i++) {
		let ang = random(TWO_PI);
		let sp = random(2.5, 7.5);
		particles.push({
			x: px,
			y: py,
			vx: cos(ang) * sp,
			vy: sin(ang) * sp,
			life: random(55, 90),
			color: baseColor
		});
	}
	fireworks.push({ particles });
}

function updateFireworks() {
	if (!fireworksActive) return;
	if (!gameCleared && millis() - fireworksStart > FIREWORK_DURATION) {
		fireworksActive = false;
		return;
	}
	if (random() < 0.08) {
		spawnFirework();
	}
	for (let fw of fireworks) {
		for (let p of fw.particles) {
			p.x += p.vx;
			p.y += p.vy;
			p.vy += 0.05; // 重力
			p.vx *= 0.99;
			p.vy *= 0.99;
			p.life -= 1.5;
		}
		fw.particles = fw.particles.filter(p => p.life > 0);
	}
	fireworks = fireworks.filter(fw => fw.particles.length > 0);
}

function drawFireworks() {
	if (!fireworksActive) return;
	push();
	noStroke();
	for (let fw of fireworks) {
		for (let p of fw.particles) {
			let alpha = map(p.life, 0, 90, 0, 255);
			fill(p.color[0], p.color[1], p.color[2], alpha);
			ellipse(p.x, p.y, 5, 5);
		}
	}
	pop();
}

function drawEndingOverlay() {
	if (!gameCleared && !showEndingOverlay) return;
	// 持續放煙火
	if (!fireworksActive) {
		fireworksActive = true;
		fireworksStart = millis();
	}
	updateFireworks();

	push();
	fill(0, 0, 0, 160);
	noStroke();
	rect(0, 0, width, height);
	pop();

	drawFireworks();

	// 主標題
	push();
	textAlign(CENTER, CENTER);
	fill(255);
	textSize(40);
	text('恭喜闖關成功！', width / 2, height * 0.22);
	textSize(20);
	text('所有 NPC 都來慶祝，看看彩色煙火吧！', width / 2, height * 0.28);
	pop();

	// NPC 排排站
	let npcY = height * 0.58;
	let npcSpacing = width / 6;
	let startX = width / 2 - npcSpacing * 2;
	let npcList = [
		{ img: paFrames[0] || paImg, w: PA_W, h: PA_H },
		{ img: sqFrames[0] || sqImg, w: SQ_W, h: SQ_H },
		{ img: frames[frameIndex], w: SPRITE_W, h: SPRITE_H },
		{ img: snailImg, w: SNAIL_W, h: SNAIL_H },
		{ img: lobsterFrames[lobsterIndex] || lobsterImg, w: LOBSTER_W, h: LOBSTER_H }
	];
	push();
	for (let i = 0; i < npcList.length; i++) {
		let npc = npcList[i];
		let nx = startX + npcSpacing * i;
		if (npc.img) image(npc.img, nx, npcY, npc.w, npc.h);
	}
	pop();

	// 再玩一次按鈕
	restartBtn.w = 220;
	restartBtn.h = 56;
	restartBtn.x = width / 2 - restartBtn.w / 2;
	restartBtn.y = height * 0.72;
	push();
	for (let i = 0; i < restartBtn.w; i += 4) {
		let tt = i / restartBtn.w;
		let col = sampleGradient(tt);
		fill(col[0], col[1], col[2], 240);
		noStroke();
		rect(restartBtn.x + i, restartBtn.y, 6, restartBtn.h, 12);
	}
	stroke(255);
	noFill();
	rect(restartBtn.x, restartBtn.y, restartBtn.w, restartBtn.h, 12);
	fill(0);
	textAlign(CENTER, CENTER);
	textSize(18);
	text('再玩一次', restartBtn.x + restartBtn.w / 2, restartBtn.y + restartBtn.h / 2);
	pop();
}

function drawPaMessage() {
	if (!paMessage || millis() - paMessageTime > 3000) {
		paMessage = '';
		return;
	}
	
	push();
	// 在 Pa 頭上顯示對話框
	let msgX = paX;
	let msgY = paY - PA_H / 2 - 70;
	let msgW = 320;
	let msgH = 60;
	
	fill(255, 255, 255, 220);
	stroke(0, 100);
	strokeWeight(2);
	rect(msgX - msgW / 2, msgY, msgW, msgH, 10);
	
	// 對話尖角
	triangle(msgX - 10, msgY + msgH, msgX + 10, msgY + msgH, msgX, msgY + msgH + 10);
	
	fill(0);
	noStroke();
	textAlign(CENTER, CENTER);
	textSize(15);
	// 確保文字在框內，使用 text 的寬高限制
	text(paMessage, msgX - msgW / 2 + 10, msgY + 5, msgW - 20, msgH - 10);
	pop();
}

function draw() {
	// 檢查關卡切換：進入第二關時將 Bobo 放在左側（sbj.png 左側）
	if (currentLevel !== lastLevel) {
		// 每個新關卡都將 Bobo 放在畫面左側並暫停移動
		xPos = SPRITE_W / 2 + 20;
		yPos = groundY;
		vx = 0;
		vy = 0;
		snailX = xPos - lastDir * (SPRITE_W / 2 + SNAIL_W / 2 + SNAIL_SPACING);
		snailY = yPos;
		// 停用第三關額外滑入動畫，避免重複進場感
		levelIntro = { active: false, start: 0, level: 0 };
		lastLevel = currentLevel;
	}
	// 轉場期間不接受移動輸入，並將速度歸零（保持在左側等待）
	if (bubbleTransition) {
		vx = 0;
	}
	// 起始說明畫面：需點擊才可進入遊戲
	if (showStart) {
		// 背景先鋪滿，避免黑屏
		if (bgImg && bgImg.width > 0) {
			image(bgImg, width / 2, height / 2, width, height);
		} else {
			background(200, 220, 255);
		}

		// 顯示說明圖片（鋪滿畫面）
		if (startImg && startImg.width > 0) {
			image(startImg, width / 2, height / 2, width, height);
		}

		// 可選：輔助文字
		fill(255);
		stroke(0);
		strokeWeight(2);
		textAlign(CENTER, CENTER);
		textSize(28);
		text('點擊畫面以開始', width / 2, height - 60);

		// 繪製 Bobo（主角始終出現在畫面中）
		push();
		translate(xPos, yPos);
		if (lastDir < 0) scale(-1, 1);
		if (action === 'blow') {
			if (blowFrames[blowIndex]) image(blowFrames[blowIndex], 0, 0, SPRITE_W, SPRITE_H);
		} else {
			if (frames[frameIndex]) image(frames[frameIndex], 0, 0, SPRITE_W, SPRITE_H);
		}
		pop();

		// 保持在起始畫面，不進行後續遊戲更新
		return;
	}

	// 若正在轉場，直接繪製轉場畫面並返回，避免上一關與下一關同時繪製
	if (bubbleTransition) {
		updateBubbleTransition();
		drawProgressBar();
		return;
	}

	// 第一關：顯示背景（b.png）與 Pa（置於下方），Bobo 也顯示於畫面中
	if (currentLevel === 1) {
		// 確保 Pa 位置更新（下方置中）
		paX = width / 2;
		paY = groundY;

		// 背景（靜止、不滾動）
		if (bgImg && bgImg.width > 0) {
			image(bgImg, width / 2, height / 2, width, height);
		} else {
			background(200, 220, 255);
		}

		// 更新 Pa 動畫影格（若有）
		paCounter++;
		if (paCounter >= paDelay) {
			paCounter = 0;
			paIndex = (paIndex + 1) % PA_TOTAL;
		}

		// 將 Pa 顯示在畫面下方（以 groundY 對齊），並面向 Bobo（轉場時不顯示）
		if (!bubbleTransition) {
			let cx = width / 2;
			let cy = groundY;
			push();
			translate(cx, cy);
			// 面向判斷：Bobo 在右側則正向，左側則翻轉
			let paFacing = (xPos >= cx) ? 1 : -1;
			if (paFacing < 0) scale(-1, 1);
			if (paFrames[0]) {
				image(paFrames[paIndex], 0, 0, PA_W, PA_H);
			} else if (paImg) {
				image(paImg, 0, 0, PA_W, PA_H);
			}
			pop();
		}

		// 若正在答題，暫停移動
		if (paQuizActive) vx = 0;

		// 第一關允許 Bobo 移動、跳躍，並讓 Snails 跟隨（答題時暫停移動更新）
		if (!paQuizActive) {
			xPos += vx;
			vy += GRAVITY;
			yPos += vy;

			if (yPos >= groundY) {
				yPos = groundY;
				vy = 0;
				onGround = true;
			} else {
				onGround = false;
			}

			const halfW = SPRITE_W / 2;
			xPos = constrain(xPos, halfW, width - halfW);
			if (vx > 0) lastDir = 1; else if (vx < 0) lastDir = -1;

			// Snails 跟隨至 Bobo 後方
			let targetSnailX = xPos - lastDir * (SPRITE_W / 2 + SNAIL_W / 2 + SNAIL_SPACING);
			let targetSnailY = yPos;
			snailX = lerp(snailX, targetSnailX, SNAIL_LERP);
			snailY = lerp(snailY, targetSnailY, SNAIL_LERP);

			// 更新 Bobo 與吹泡泡影格
			if (action === 'blow') {
				blowCounter++;
				if (blowCounter >= blowDelay) {
					blowCounter = 0;
					blowIndex++;
					if (blowIndex >= BLOW_TOTAL) {
						action = 'idle';
						blowIndex = 0;
					}
				}
			} else {
				if (vx !== 0) {
					frameCounter++;
					if (frameCounter >= frameDelay) {
						frameCounter = 0;
						frameIndex = (frameIndex + 1) % TOTAL_FRAMES;
					}
				} else {
					frameIndex = 0;
				}
			}
		}

		// 繪製 Snails（跟隨 Bobo 面向）（轉場時在 updateBubbleTransition 中繪製）
		if (!bubbleTransition) {
			push();
			translate(snailX, snailY);
			if (lastDir < 0) scale(-1, 1);
			if (snailImg) image(snailImg, 0, 0, SNAIL_W, SNAIL_H);
			pop();
		}

		// 繪製 Bobo（主角）（轉場時在 updateBubbleTransition 中繪製）
		if (!bubbleTransition) {
			push();
			translate(xPos, yPos);
			if (lastDir < 0) scale(-1, 1);
			if (action === 'blow') {
				if (blowFrames[blowIndex]) image(blowFrames[blowIndex], 0, 0, SPRITE_W, SPRITE_H);
			} else {
				if (frames[frameIndex]) image(frames[frameIndex], 0, 0, SPRITE_W, SPRITE_H);
			}
			pop();
		}

		// 判斷距離觸發 Pa 問答（僅當尚未完成兩題且未在答題中）
		let paDist = abs(xPos - paX);
		if (!paQuizActive && paCorrectCount < 2 && paDist <= PA_W * 1.2) {
			startPaQuiz();
		}

		// 顯示問答 Overlay（轉場時不顯示）
		if (!bubbleTransition) {
			drawPaQuizOverlay();
		}

		// 顯示 Pa 對話（轉場時不顯示）
		if (!bubbleTransition) {
			drawPaMessage();
		}

		// 更新與繪製泡泡轉場
		updateBubbleTransition();

		// 如果答對兩題且 Bobo 跑到右邊界，觸發泡泡轉場
		if (paCorrectCount >= 2 && !bubbleTransition && xPos >= width - SPRITE_W / 2) {
			startBubbleTransition(2);
		}

		// 進度條
		drawProgressBar();

		// 第一關不進行其他角色與物理更新
		return;
	}

	// 第二關：顯示 sbj.png 背景與 Sq（關主）
	if (currentLevel === 2) {
		// 若正在轉場，直接繪製轉場畫面並跳出，避免同時顯示第二關背景與角色
		if (bubbleTransition) {
			updateBubbleTransition();
			return;
		}
		// 確保 Sq 位置更新（下方置中）
		sqX = width / 2;
		sqY = groundY;

		// 繪製第二關背景
		if (bg2Img && bg2Img.width > 0) {
			image(bg2Img, width / 2, height / 2, width, height);
		} else {
			background(200, 220, 255);
		}

		// 若正在答題，暫停移動
		if (sqQuizActive) vx = 0;

		// 更新 Sq 動畫影格
		sqCounter++;
		if (sqCounter >= sqDelay) {
			sqCounter = 0;
			sqIndex = (sqIndex + 1) % SQ_TOTAL;
		}

		// 繪製 Sq（置於下方中間，面向 Bobo）
		let cx = width / 2;
		let cy = groundY;
		push();
		translate(cx, cy);
		let sqFacing = (xPos >= cx) ? 1 : -1;
		if (sqFacing < 0) scale(-1, 1);
		if (sqFrames[0]) {
			image(sqFrames[sqIndex], 0, 0, SQ_W, SQ_H);
		} else if (sqImg) {
			image(sqImg, 0, 0, SQ_W, SQ_H);
		}
		pop();

		// 判斷距離觸發 Sq 問答（僅當尚未完成兩題且未在答題中）
		let sqDist = abs(xPos - sqX);
		if (!sqQuizActive && sqCorrectCount < 2 && sqDist <= SQ_W * 1.2) {
			startSqQuiz();
		}

		// 第二關允許 Bobo 移動、Snails 跟隨
		if (!sqQuizActive) {
			xPos += vx;
			vy += GRAVITY;
			yPos += vy;

			if (yPos >= groundY) {
				yPos = groundY;
				vy = 0;
				onGround = true;
			} else {
				onGround = false;
			}

			const halfW = SPRITE_W / 2;
			// 套用第一關相同的邊界限制：左右皆限制在畫面內
			xPos = constrain(xPos, halfW, width - halfW);

			// 若已答對兩題且尚未進入轉場，Bobo 跑到右邊時觸發轉場至第三關（同第一關邏輯）
			if (sqReadyToTransition && !bubbleTransition && xPos >= width - SPRITE_W / 2) {
				startBubbleTransition(3);
			}
		}
		
		if (vx > 0) lastDir = 1; else if (vx < 0) lastDir = -1;

		// Snails 跟隨至 Bobo 後方
		let targetSnailX = xPos - lastDir * (SPRITE_W / 2 + SNAIL_W / 2 + SNAIL_SPACING);
		let targetSnailY = yPos;
		snailX = lerp(snailX, targetSnailX, SNAIL_LERP);
		snailY = lerp(snailY, targetSnailY, SNAIL_LERP);

		// 更新 Bobo 與吹泡泡影格
		if (action === 'blow') {
			blowCounter++;
			if (blowCounter >= blowDelay) {
				blowCounter = 0;
				blowIndex++;
				if (blowIndex >= BLOW_TOTAL) {
					action = 'idle';
					blowIndex = 0;
				}
			}
		} else {
			if (vx !== 0) {
				frameCounter++;
				if (frameCounter >= frameDelay) {
					frameCounter = 0;
					frameIndex = (frameIndex + 1) % TOTAL_FRAMES;
				}
			} else {
				frameIndex = 0;
			}
		}

		// 繪製 Snails
		push();
		translate(snailX, snailY);
		if (lastDir < 0) scale(-1, 1);
		if (snailImg) image(snailImg, 0, 0, SNAIL_W, SNAIL_H);
		pop();

		// 繪製 Bobo
		push();
		translate(xPos, yPos);
		if (lastDir < 0) scale(-1, 1);
		if (action === 'blow') {
			if (blowFrames[blowIndex]) image(blowFrames[blowIndex], 0, 0, SPRITE_W, SPRITE_H);
		} else {
			if (frames[frameIndex]) image(frames[frameIndex], 0, 0, SPRITE_W, SPRITE_H);
		}
		pop();

		// 顯示 Sq 問答 Overlay
		drawSqQuizOverlay();

		// 顯示 Sq 對話
		drawSqMessage();

		// 進度條
		drawProgressBar();

		// 更新與繪製泡泡轉場
		updateBubbleTransition();

		// 第二關暫時不進行其他 NPC 更新
		return;
	}

	// 第三關：顯示 unnamed.jpg 背景與 Lobster（關主）
	if (currentLevel === 3) {
		// 背景：直接顯示單張 unnamed.jpg，避免重複進場效果
		if (bg3Img && bg3Img.width > 0) {
			image(bg3Img, width / 2, height / 2, width, height);
		} else {
			background(210, 240, 255);
		}

		// 更新 Lobster 動畫影格
		lobsterCounter++;
		if (lobsterCounter >= lobsterDelay) {
			lobsterCounter = 0;
			lobsterIndex = (lobsterIndex + 1) % LOBSTER_TOTAL;
		}

		// 定位 Lobster 於下方中間，面向 Bobo
		lobsterX = width / 2;
		lobsterY = groundY;
		push();
		translate(lobsterX, lobsterY);
		let lobFacing = (xPos >= lobsterX) ? 1 : -1;
		if (lobFacing < 0) scale(-1, 1);
		if (lobsterFrames[0]) {
			image(lobsterFrames[lobsterIndex], 0, 0, LOBSTER_W, LOBSTER_H);
		} else if (lobsterImg) {
			image(lobsterImg, 0, 0, LOBSTER_W, LOBSTER_H);
		}
		pop();

		// 觸發 Lobster 問答（Bobo 接近時，需答兩題）
		let lobDist = abs(xPos - lobsterX);
		if (!lobsterQuizActive && lobsterCorrectCount < 2 && lobDist <= LOBSTER_STOP_DIST * 0.8) {
			startLobsterQuiz();
		}

		// 若正在答題，暫停移動
		if (lobsterQuizActive) vx = 0;

		// 允許 Bobo 移動、Snails 跟隨
		xPos += vx;
		vy += GRAVITY;
		yPos += vy;

		if (yPos >= groundY) {
			yPos = groundY;
			vy = 0;
			onGround = true;
		} else {
			onGround = false;
		}

		const halfW3 = SPRITE_W / 2;
		xPos = constrain(xPos, halfW3, width - halfW3);
		if (vx > 0) lastDir = 1; else if (vx < 0) lastDir = -1;

		// Snails 跟隨至 Bobo 後方
		let targetSnailX3 = xPos - lastDir * (SPRITE_W / 2 + SNAIL_W / 2 + SNAIL_SPACING);
		let targetSnailY3 = yPos;
		snailX = lerp(snailX, targetSnailX3, SNAIL_LERP);
		snailY = lerp(snailY, targetSnailY3, SNAIL_LERP);

		// 更新 Bobo 與吹泡泡影格
		if (action === 'blow') {
			blowCounter++;
			if (blowCounter >= blowDelay) {
				blowCounter = 0;
				blowIndex++;
				if (blowIndex >= BLOW_TOTAL) {
					action = 'idle';
					blowIndex = 0;
				}
			}
		} else {
			if (vx !== 0) {
				frameCounter++;
				if (frameCounter >= frameDelay) {
					frameCounter = 0;
					frameIndex = (frameIndex + 1) % TOTAL_FRAMES;
				}
			} else {
				frameIndex = 0;
			}
		}

		// 繪製 Snails
		push();
		translate(snailX, snailY);
		if (lastDir < 0) scale(-1, 1);
		if (snailImg) image(snailImg, 0, 0, SNAIL_W, SNAIL_H);
		pop();

		// 繪製 Bobo
		push();
		translate(xPos, yPos);
		if (lastDir < 0) scale(-1, 1);
		if (action === 'blow') {
			if (blowFrames[blowIndex]) image(blowFrames[blowIndex], 0, 0, SPRITE_W, SPRITE_H);
		} else {
			if (frames[frameIndex]) image(frames[frameIndex], 0, 0, SPRITE_W, SPRITE_H);
		}
		pop();

		// 顯示 Lobster 問答 Overlay
		drawLobsterQuizOverlay();

		// 進度條
		drawProgressBar();

		// 通關慶祝
		if (gameCleared) {
			drawEndingOverlay();
		}

		return;
	}
	// 繪製背景圖片（靜止，不滾動）
	if (bgImg && bgImg.width > 0) {
		image(bgImg, width / 2, height / 2, width, height);
	} else {
		background(200, 220, 255); // 圖片未載入時的備用顏色
	}

	// 更新位置
	xPos += vx;

	// 更新垂直運動（重力 / 跳躍）
	vy += GRAVITY;
	yPos += vy;

	// 地面碰撞偵測
	if (yPos >= groundY) {
		yPos = groundY;
		vy = 0;
		onGround = true;
	} else {
		onGround = false;
	}

	// 限制在畫布內（以顯示尺寸計算）
	const halfW = SPRITE_W / 2;
	xPos = constrain(xPos, halfW, width - halfW);

	// 更新面向方向（保留最後一次水平移動方向）
	if (vx > 0) lastDir = 1;
	else if (vx < 0) lastDir = -1;

	// 計算 snail 目標位置：緊跟在 bobo 後方（依 bobo 面向方向）
	let targetSnailX = xPos - lastDir * (SPRITE_W / 2 + SNAIL_W / 2 + SNAIL_SPACING);
	let targetSnailY = yPos;

	// 平滑跟隨
	snailX = lerp(snailX, targetSnailX, SNAIL_LERP);
	snailY = lerp(snailY, targetSnailY, SNAIL_LERP);

	// 處理動畫影格
	if (action === 'blow') {
		// 吹泡泡動畫由 blowFrames 控制
		blowCounter++;
		if (blowCounter >= blowDelay) {
			blowCounter = 0;
			blowIndex++;
			if (blowIndex >= BLOW_TOTAL) {
				// 吹泡泡動畫結束
				action = 'idle';
				blowIndex = 0;
			}
		}
	} else {
		if (vx !== 0) {
			frameCounter++;
			if (frameCounter >= frameDelay) {
				frameCounter = 0;
				frameIndex = (frameIndex + 1) % TOTAL_FRAMES;
			}
		} else {
			frameIndex = 0; // 靜止時顯示第 0 張
		}
	}

	// 更新 lobster 動畫（持續播放）
	// 若遇見 Bobo 則停止動作（不進行 frame 更新），否則播放動畫
	let lobDist = Math.abs(xPos - lobsterX);
	let lobsterEncounter = lobDist <= LOBSTER_STOP_DIST;
	if (!lobsterEncounter) {
		lobsterCounter++;
		if (lobsterCounter >= lobsterDelay) {
			lobsterCounter = 0;
			lobsterIndex = (lobsterIndex + 1) % LOBSTER_TOTAL;
		}
	}

	// 若遇見 Bobo 則停止動作（不進行 frame 更新），否則播放 Pa 動畫
	let paDist = Math.abs(xPos - paX);
	let paEncounter = paDist <= (PA_W * 1.5);
	if (!paEncounter) {
		paCounter++;
		if (paCounter >= paDelay) {
			paCounter = 0;
			paIndex = (paIndex + 1) % PA_TOTAL;
		}
	}

	// 如果遇見任一 NPC，讓 Bobo 面向最近的那個 NPC（達成「面對面」）
	if (lobsterEncounter || paEncounter) {
		let encounterTargetX;
		if (lobsterEncounter && paEncounter) {
			encounterTargetX = (lobDist <= paDist) ? lobsterX : paX;
		} else if (lobsterEncounter) {
			encounterTargetX = lobsterX;
		} else {
			encounterTargetX = paX;
		}
		lastDir = (encounterTargetX >= xPos) ? 1 : -1;
	}

	// 更新 Sq 動畫（持續播放）
	sqCounter++;
	if (sqCounter >= sqDelay) {
		sqCounter = 0;
		sqIndex = (sqIndex + 1) % SQ_TOTAL;
	}

	// 繪製 snail（先畫在下方，顯示為在 Bobo 後方）
	push();
	translate(snailX, snailY);
	// 跟隨 bobo 面向翻轉
	if (lastDir < 0) scale(-1, 1);
	if (snailImg) image(snailImg, 0, 0, SNAIL_W, SNAIL_H);
	pop();

	// 繪製 lobster（固定位置、播放動畫並面向 Bobo；遇見時停止動畫）
	push();
	translate(lobsterX, lobsterY);
	// 面向 Bobo（依相對位置，不以 lastDir）
	let lobsterFacing = (xPos >= lobsterX) ? 1 : -1;
	if (lobsterFacing < 0) scale(-1, 1);
	if (lobsterFrames[0]) {
		image(lobsterFrames[lobsterIndex], 0, 0, LOBSTER_W, LOBSTER_H);
	} else if (lobsterImg) {
		image(lobsterImg, 0, 0, LOBSTER_W, LOBSTER_H);
	}
	pop();

	// 繪製 Pa（固定位置、播放動畫，面向角色1；遇見時停止動畫）
	push();
	translate(paX, paY);
	let paFacing2 = (xPos >= paX) ? 1 : -1;
	if (paFacing2 < 0) scale(-1, 1);
	if (paFrames[0]) {
		image(paFrames[paIndex], 0, 0, PA_W, PA_H);
	} else if (paImg) {
		image(paImg, 0, 0, PA_W, PA_H);
	}
	pop();

	// 繪製 Sq（固定位置、播放動畫，面向角色1）
	push();
	translate(sqX, sqY);
	let sqFacing = (xPos >= sqX) ? 1 : -1;
	if (sqFacing < 0) scale(-1, 1);
	if (sqFrames[0]) {
		image(sqFrames[sqIndex], 0, 0, SQ_W, SQ_H);
	} else if (sqImg) {
		image(sqImg, 0, 0, SQ_W, SQ_H);
	}
	pop();

	// 繪製角色，根據方向翻轉，並以固定大小繪製
	push();
	translate(xPos, yPos);
	if (lastDir < 0) scale(-1, 1);
	if (action === 'blow') {
		if (blowFrames[blowIndex]) image(blowFrames[blowIndex], 0, 0, SPRITE_W, SPRITE_H);
	} else {
		if (frames[frameIndex]) image(frames[frameIndex], 0, 0, SPRITE_W, SPRITE_H);
	}
	pop();
}

function resetGame() {
	// 清除通關與煙火
	gameCleared = false;
	showEndingOverlay = false;
	fireworksActive = false;
	fireworks = [];
	fireworksStart = 0;

	// 關卡與轉場
	bubbleTransition = false;
	currentLevel = 1;
	lastLevel = 1;
	transitionTargetLevel = 2;
	sqReadyToTransition = false;

	// 問答狀態
	paQuizActive = false;
	sqQuizActive = false;
	lobsterQuizActive = false;
	paCurrentQ = null;
	sqCurrentQ = null;
	lobsterCurrentQ = null;
	paCorrectCount = 0;
	sqCorrectCount = 0;
	lobsterCorrectCount = 0;
	paFeedback = '';
	sqFeedback = '';
	lobsterFeedback = '';
	paShowSnailsHint = false;
	sqShowSnailsHint = false;
	lobsterShowSnailsHint = false;
	paMessage = '';
	sqMessage = '';
	paMessageTime = 0;
	sqMessageTime = 0;
	paAnsweredIds.clear();
	sqAnsweredIds.clear();
	lobsterAnsweredIds.clear();
	paOptionBoxes = [];
	sqOptionBoxes = [];
	lobsterOptionBoxes = [];

	// 角色與位置
	xPos = width * 0.25;
	groundY = height * 0.75;
	yPos = groundY;
	vx = 0;
	vy = 0;
	snailX = xPos - lastDir * (SPRITE_W / 2 + SNAIL_W / 2 + SNAIL_SPACING);
	snailY = yPos;
	action = 'idle';

	// 起始畫面
	showStart = true;
}

function keyPressed() {
	if (gameCleared) return;
	if (bubbleTransition) return; // 轉場期間不接受移動輸入
	if (keyCode === LEFT_ARROW) {
		vx = -8;
		lastDir = -1;
	} else if (keyCode === RIGHT_ARROW) {
		vx = 8;
		lastDir = 1;
	} else if (keyCode === UP_ARROW) {
		// 只有在地面上才允許跳躍
		if (onGround) {
			vy = JUMP_V;
			onGround = false;
		}
	} else if (key === ' ' || keyCode === 32) {
		// 按下空白鍵切換為吹泡泡動畫（播放一次）
		if (action !== 'blow') {
			action = 'blow';
			blowIndex = 0;
			blowCounter = 0;
		}
	}
}

function keyReleased() {
	if ((keyCode === LEFT_ARROW && vx < 0) || (keyCode === RIGHT_ARROW && vx > 0)) {
		vx = 0;
	}
}

function keyTyped() {
	if (gameCleared) return;
	// 第一關 Pa 問答：按 A 或 B 鍵作答
	if (currentLevel === 1 && paQuizActive) {
		if (key === 'a' || key === 'A') {
			handlePaAnswer('A');
		} else if (key === 'b' || key === 'B') {
			handlePaAnswer('B');
		}
	}

	// 第二關 Sq 問答：按 A 或 B 鍵作答
	if (currentLevel === 2 && sqQuizActive) {
		if (key === 'a' || key === 'A') {
			handleSqAnswer('A');
		} else if (key === 'b' || key === 'B') {
			handleSqAnswer('B');
		}
	}

	// 第三關 Lobster 問答：按 A 或 B 鍵作答
	if (currentLevel === 3 && lobsterQuizActive) {
		if (key === 'a' || key === 'A') {
			handleLobsterAnswer('A');
		} else if (key === 'b' || key === 'B') {
			handleLobsterAnswer('B');
		}
	}
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
	groundY = height * 0.75;
	yPos = groundY;

	// 調整 snail 的垂直位置
	snailY = yPos;

	// 調整 lobster 位置
	lobsterX = width * 0.82;
	lobsterY = groundY;

	// 調整 pa 位置
	if (currentLevel === 1) {
		// 第一關：Pa 維持下方（groundY）置中
		paX = width / 2;
		paY = groundY;
	} else {
		paX = width * 0.18;
		paY = groundY;
	}

	// 調整 sq 位置
	sqX = width * 0.5;
	sqY = groundY;
}

function mousePressed() {
	// 通關後只處理再玩一次按鈕
	if (gameCleared) {
		if (mouseX >= restartBtn.x && mouseX <= restartBtn.x + restartBtn.w &&
			mouseY >= restartBtn.y && mouseY <= restartBtn.y + restartBtn.h) {
			resetGame();
		}
		return;
	}

	// 點擊起始畫面以進入遊戲
	if (showStart) {
		showStart = false;
		// 進入第一關時，將 Bobo 與 Snails 初始位置設為偏左
		xPos = width * 0.25;
		yPos = groundY;
		vx = 0;
		vy = 0;
		snailX = xPos - lastDir * (SPRITE_W / 2 + SNAIL_W / 2 + SNAIL_SPACING);
		snailY = yPos;
		return;
	}

	// 第一關 Pa 問答點擊選項
	if (currentLevel === 1 && paQuizActive && paOptionBoxes.length) {
		for (let b of paOptionBoxes) {
			if (mouseX >= b.x && mouseX <= b.x + b.w && mouseY >= b.y && mouseY <= b.y + b.h) {
				handlePaAnswer(b.choice);
				return;
			}
		}
	}

	// 第二關 Sq 問答點擊選項
	if (currentLevel === 2 && sqQuizActive && sqOptionBoxes.length) {
		for (let b of sqOptionBoxes) {
			if (mouseX >= b.x && mouseX <= b.x + b.w && mouseY >= b.y && mouseY <= b.y + b.h) {
				handleSqAnswer(b.choice);
				return;
			}
		}
	}

	// 第三關 Lobster 問答點擊選項
	if (currentLevel === 3 && lobsterQuizActive && lobsterOptionBoxes.length) {
		for (let b of lobsterOptionBoxes) {
			if (mouseX >= b.x && mouseX <= b.x + b.w && mouseY >= b.y && mouseY <= b.y + b.h) {
				handleLobsterAnswer(b.choice);
				return;
			}
		}
	}
}