
let deckId;
let totalHearts = 0;
let totalDiamonds = 0;
let totalClubs = 0;
let totalSpades = 0;

const deckApiUrl = "https://deckofcardsapi.com/api/deck";

// ゲーム開始時にデッキを取得
window.onload = () => {
    fetch(`${deckApiUrl}/new/shuffle/?deck_count=1`)
        .then(response => response.json())
        .then(data => {
            deckId = data.deck_id;
        });
};

// 山札からカードを引く
function drawCards() {
    document.getElementById('draw-deck').style.display = 'none';

    shuffleDeck().then(() => {
        fetch(`${deckApiUrl}/${deckId}/draw/?count=16`)
            .then(response => response.json())
            .then(data => {
                const drawnCardsDiv = document.getElementById('drawn-cards');
                drawnCardsDiv.innerHTML = ''; // 以前のカードをクリア

                data.cards.forEach(card => {
                    const cardImg = document.createElement('img');
                    cardImg.src = card.image;
                    cardImg.alt = `${card.value} of ${card.suit}`;
                    cardImg.dataset.value = card.value;
                    cardImg.dataset.suit = card.suit;

                    cardImg.onclick = () => selectCard(cardImg);

                    drawnCardsDiv.appendChild(cardImg);
                });
            });
    });
}


// デッキをシャッフルする
function shuffleDeck() {
    return fetch(`${deckApiUrl}/${deckId}/shuffle/`)
        .then(response => response.json());
}

// カードを選択してリストに追加、場から削除
function selectCard(cardElement) {
    const selectedCardsDiv = document.getElementById('selected-cards');
    const clonedCard = cardElement.cloneNode(true); // カードを選択リストに追加
    selectedCardsDiv.appendChild(clonedCard);

    // カードの値をスートごとに合計値に追加
    updateTotals(cardElement.dataset.suit, cardElement.dataset.value);

    // 場から選択されたカードを削除
    cardElement.remove();

    // 合計が15または600になったらカードを削除
    checkForFifteen(cardElement.dataset.suit);
}

// 選択したカードを場に戻す
function returnCards() {
    const selectedCardsDiv = document.getElementById('selected-cards');
    const drawnCardsDiv = document.getElementById('drawn-cards');
    // 選択されたカードをクリックすることで一枚ずつ戻す
    selectedCardsDiv.childNodes.forEach(cardElement => {
        cardElement.onclick = () => {
            drawnCardsDiv.appendChild(cardElement);
            // カードの値をスートごとの合計から減算
            updateTotals(cardElement.dataset.suit, -getCardValue(cardElement.dataset.value));
            cardElement.onclick = () => selectCard(cardElement);
        };
    });
}

// スートごとの合計をチェックし、該当のカードを消す
function checkForFifteen(suit) {
    let total = 0;
    switch (suit) {
        case 'HEARTS':
            total = totalHearts;
            break;
        case 'DIAMONDS':
            total = totalDiamonds;
            break;
        case 'CLUBS':
            total = totalClubs;
            break;
        case 'SPADES':
            total = totalSpades;
            break;
        default:
            break;
    }

    if (total === 15 || total === 600) {
        const selectedCardsDiv = document.getElementById('selected-cards');
        const cardsToRemove = [...selectedCardsDiv.childNodes].filter(card => card.dataset.suit === suit);

        // 選択リストから該当カードを削除
        cardsToRemove.forEach(card => card.remove());

        // 補充のためのカードを引く
        drawAdditionalCards(cardsToRemove.length);

        // 合計値をリセット
        switch (suit) {
            case 'HEARTS':
                totalHearts = 0;
                total = totalHearts;
                break;
            case 'DIAMONDS':
                totalDiamonds = 0;
                total = totalDiamonds;
                break;
            case 'CLUBS':
                totalClubs = 0;
                total = totalClubs;
                break;
            case 'SPADES':
                totalSpades = 0;
                total = totalSpades;
                break;
            default:
                break;
        }
    }
}


// カードを補充する
function drawAdditionalCards(count) {
    fetch(`${deckApiUrl}/${deckId}/draw/?count=${count}`)
        .then(response => response.json())
        .then(data => {
            const drawnCardsDiv = document.getElementById('drawn-cards');
            data.cards.forEach(card => {
                const cardImg = document.createElement('img');
                cardImg.src = card.image;
                cardImg.alt = `${card.value} of ${card.suit}`;
                cardImg.dataset.value = card.value;
                cardImg.dataset.suit = card.suit;

                cardImg.onclick = () => selectCard(cardImg);

                drawnCardsDiv.appendChild(cardImg);
            });
        });
}

// カードの値を数値に変換する
function getCardValue(value) {
    if (value === 'ACE') return 1;
    if (value === 'JACK') return 100;
    if (value === 'QUEEN') return 200;
    if (value === 'KING') return 300;
    return parseInt(value);
}

// スートごとの合計値を更新
function updateTotals(suit, value) {
    const cardValue = getCardValue(value);

    // スートごとの合計値を更新
    switch (suit) {
        case 'HEARTS':
            totalHearts += cardValue;
            document.getElementById('hearts-total').textContent = totalHearts;
            break;
        case 'DIAMONDS':
            totalDiamonds += cardValue;
            document.getElementById('diamonds-total').textContent = totalDiamonds;
            break;
        case 'CLUBS':
            totalClubs += cardValue;
            document.getElementById('clubs-total').textContent = totalClubs;
            break;
        case 'SPADES':
            totalSpades += cardValue;
            document.getElementById('spades-total').textContent = totalSpades;
            break;
        default:
            break;
    }
}




function drawCards() {
    // "山札を引く"ボタンを非表示にして、"リセット"ボタンを表示する
    document.getElementById('draw-deck').style.display = 'none';
    document.getElementById('reset-game').style.display = 'inline-block';

    shuffleDeck().then(() => {
        fetch(`${deckApiUrl}/${deckId}/draw/?count=16`)
            .then(response => response.json())
            .then(data => {
                const drawnCardsDiv = document.getElementById('drawn-cards');
                drawnCardsDiv.innerHTML = ''; // 以前のカードをクリア

                data.cards.forEach(card => {
                    const cardImg = document.createElement('img');
                    cardImg.src = card.image;
                    cardImg.alt = `${card.value} of ${card.suit}`;
                    cardImg.dataset.value = card.value;
                    cardImg.dataset.suit = card.suit;

                    cardImg.onclick = () => selectCard(cardImg);

                    drawnCardsDiv.appendChild(cardImg);
                });
            });
    });
}

// ゲームをリセットする関数
function resetGame() {
    // スートの合計値をリセット
    resetTotals();

    // 表示されているカードをクリア
    document.getElementById('drawn-cards').innerHTML = '';
    document.getElementById('selected-cards').innerHTML = '';

    // "リセット"ボタンを非表示にして、"山札を引く"ボタンを表示する
    document.getElementById('reset-game').style.display = 'none';
    document.getElementById('draw-deck').style.display = 'inline-block';

    // 新しいデッキをシャッフルしてゲームをリセット
    shuffleDeck();
}



// 合計値のリセット
function resetTotals() {
    totalHearts = 0;
    totalDiamonds = 0;
    totalClubs = 0;
    totalSpades = 0;
    document.getElementById('hearts-total').textContent = totalHearts;
    document.getElementById('diamonds-total').textContent = totalDiamonds;
    document.getElementById('clubs-total').textContent = totalClubs;
    document.getElementById('spades-total').textContent = totalSpades;
}
