// ELEMENTOS DO DOM
const resultEl = document.getElementById('result');
const lengthEl = document.getElementById('length');
const uppercaseEl = document.getElementById('uppercase');
const lowercaseEl = document.getElementById('lowercase');
const numbersEl = document.getElementById('numbers');
const symbolsEl = document.getElementById('symbols');
const generateBtn = document.getElementById('generate');
const clipboardBtn = document.getElementById('clipboard');
const memorableModeEl = document.getElementById('memorable-mode');

// --- ENGLISH DICTIONARY (NO NAMES, JUST THINGS) ---
const dicionario = [
    // FRUITS & FOOD
    "Apple", "Banana", "Grape", "Lemon", "Lime", "Mango", "Melon", "Berry", 
    "Cherry", "Kiwi", "Peach", "Plum", "Pear", "Orange", "Coconut", "Fig",
    "Cake", "Pie", "Pizza", "Bread", "Toast", "Coffee", "Tea", "Milk", 
    "Sugar", "Honey", "Salt", "Spice", "Candy", "Choco", "Cookie", "Mint",

    // NATURE & ELEMENTS
    "Sun", "Moon", "Star", "Sky", "Cloud", "Rain", "Snow", "Wind", "Storm", 
    "Fire", "Water", "Earth", "Rock", "Stone", "Sand", "Dust", "Gold", 
    "Silver", "Iron", "Metal", "Ice", "Frost", "Heat", "Light", "Dark",
    "Tree", "Leaf", "Rose", "Lily", "Grass", "Root", "Wood", "Forest",
    "River", "Lake", "Sea", "Ocean", "Wave", "Beach", "Hill", "Peak",

    // OBJECTS & TECH
    "Car", "Bike", "Boat", "Ship", "Train", "Plane", "Jet", "Rocket", 
    "Phone", "Code", "Data", "Wifi", "Link", "Web", "Net", "Chip", 
    "Robot", "Laser", "Neon", "Lamp", "Bulb", "Fan", "Clock", "Watch",
    "Book", "Pen", "Paper", "Box", "Bag", "Key", "Lock", "Door", "Wall",
    "Glass", "Cup", "Mug", "Plate", "Fork", "Spoon", "Knife", "Chair",

    // ANIMALS (WILD & PETS)
    "Cat", "Dog", "Lion", "Tiger", "Bear", "Wolf", "Fox", "Panda", "Koala",
    "Fish", "Shark", "Whale", "Crab", "Frog", "Toad", "Snake", "Cobra",
    "Bird", "Eagle", "Hawk", "Owl", "Duck", "Swan", "Bat", "Bee", "Ant",
    "Horse", "Zebra", "Deer", "Bull", "Cow", "Goat", "Lamb", "Pig", "Mouse"
];

// FUNÇÕES UTILITÁRIAS
const randomFunc = {
    lower: () => String.fromCharCode(Math.floor(Math.random() * 26) + 97),
    upper: () => String.fromCharCode(Math.floor(Math.random() * 26) + 65),
    number: () => String.fromCharCode(Math.floor(Math.random() * 10) + 48),
    symbol: () => {
        const symbols = '!@#$%^&*-_=+';
        return symbols[Math.floor(Math.random() * symbols.length)];
    }
};

// EVENTO: COPIAR
clipboardBtn.addEventListener('click', () => {
    const password = resultEl.innerText;
    if (!password || password === "Sua senha aqui") return;
    navigator.clipboard.writeText(password);
    alert('Password copied!'); // Mudei o alerta para inglês também
});

// EVENTO: GERAR SENHA
generateBtn.addEventListener('click', () => {
    // 1. PEGA O VALOR DO INPUT
    let length = +lengthEl.value;

    // 2. PROTEÇÃO DE TAMANHO (Min 4 / Max 24)
    if (length < 4) {
        length = 4;
        lengthEl.value = 4; 
    }
    if (length > 24) {
        length = 24;
        lengthEl.value = 24;
    }

    const hasLower = lowercaseEl.checked;
    const hasUpper = uppercaseEl.checked;
    const hasNumber = numbersEl.checked;
    const hasSymbol = symbolsEl.checked;

    if (!hasLower && !hasUpper && !hasNumber && !hasSymbol) {
        alert("Please select at least one option!");
        return;
    }

    if (memorableModeEl.checked) {
        resultEl.innerText = gerarSenhaMemoravel(length, hasLower, hasUpper, hasNumber, hasSymbol);
    } else {
        resultEl.innerText = generatePassword(hasLower, hasUpper, hasNumber, hasSymbol, length);
    }
});

// --- MODO MEMORÁVEL (ENGLISH VERSION) ---
function gerarSenhaMemoravel(length, hasLower, hasUpper, hasNumber, hasSymbol) {
    let palavraBase = dicionario[Math.floor(Math.random() * dicionario.length)];
    
    let espacoReservado = 0;
    if (hasNumber) espacoReservado++;
    if (hasSymbol) espacoReservado++;

    let tamanhoMaximoPalavra = length - espacoReservado;

    // Segurança contra tamanhos muito pequenos
    if (tamanhoMaximoPalavra < 1) tamanhoMaximoPalavra = 1;

    // Corta a palavra se necessário
    if (palavraBase.length > tamanhoMaximoPalavra) {
        palavraBase = palavraBase.slice(0, tamanhoMaximoPalavra);
    }

    // Formatação
    if (hasUpper && hasLower) {
        if(palavraBase.length > 0) {
             palavraBase = palavraBase.charAt(0).toUpperCase() + palavraBase.slice(1).toLowerCase();
        }
    } else if (hasUpper) {
        palavraBase = palavraBase.toUpperCase();
    } else if (hasLower) {
        palavraBase = palavraBase.toLowerCase();
    } else {
        palavraBase = palavraBase.toLowerCase();
    }

    let senhaAtual = palavraBase;

    // Adiciona obrigatórios
    if (hasNumber) senhaAtual += randomFunc.number();
    if (hasSymbol) senhaAtual = randomFunc.symbol() + senhaAtual;

    // Preenche o resto
    const tiposPermitidos = [];
    if (hasNumber) tiposPermitidos.push('number');
    if (hasSymbol) tiposPermitidos.push('symbol');
    if (tiposPermitidos.length === 0) tiposPermitidos.push('number');

    while (senhaAtual.length < length) {
        const tipoAleatorio = tiposPermitidos[Math.floor(Math.random() * tiposPermitidos.length)];
        const caracterExtra = randomFunc[tipoAleatorio]();
        
        if (senhaAtual.length % 2 === 0) {
            senhaAtual += caracterExtra;
        } else {
            senhaAtual = caracterExtra + senhaAtual;
        }
    }

    return senhaAtual.slice(0, length);
}

// --- MODO CLÁSSICO ---
function generatePassword(lower, upper, number, symbol, length) {
    let generatedPassword = '';
    const typesCount = lower + upper + number + symbol;
    const typesArr = [{lower}, {upper}, {number}, {symbol}].filter(item => Object.values(item)[0]);
    
    if (typesCount === 0) return '';

    for (let i = 0; i < length; i += typesCount) {
        typesArr.forEach(type => {
            const funcName = Object.keys(type)[0];
            generatedPassword += randomFunc[funcName]();
        });
    }
    return generatedPassword.slice(0, length);
}