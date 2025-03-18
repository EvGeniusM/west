import Card from './Card.js';
import Game from './Game.js';
import TaskQueue from './TaskQueue.js';
import SpeedRate from './SpeedRate.js';

class Creature extends Card {
    constructor(name, power) {
        super(name, power);
    }

    getDescriptions() {
        return [getCreatureDescription(this), ...super.getDescriptions()]
    }
}


class Duck extends Creature {
    constructor(name = "Мирная утка", power = 2) {
        super(name, power);
    }

    quacks() {
        console.log('quack')
    };

    swims(){
        console.log('float: both;')
    };
}

class Dog extends Creature {
    constructor(name = "Пес-бандит", power = 3) {
        super(name, power);
    }
}

class Trasher extends Dog {
    constructor() {
        super("Громила", 5)
    }

    modifyTakenDamage (value, fromCard, gameContext, continuation) {
        this.view.signalAbility(() => { continuation(value - 1); })
    };

    getDescriptions() {
        return ["Для уток все становится плохо, когда в рядах бандитов появляется Громила.", ...super.getDescriptions()]
    }    
}

class Lad extends Dog {
    constructor() {
        super("Браток", 2);
    }

    static getInGameCount() { 
        return this.inGameCount || 0; 
    } 

    static setInGameCount(value) { 
        this.inGameCount = value; 
    }

    doAfterComingIntoPlay(gameContext, continuation) {
        Lad.setInGameCount(Lad.getInGameCount() + 1);
        const {currentPlayer, oppositePlayer, position, updateView} = gameContext;
        continuation();
    };

    doBeforeRemoving(continuation) {
        Lad.setInGameCount(Lad.getInGameCount() - 1); 
        continuation();
    }

    static getBonus() { 
        return (this.getInGameCount() * (this.getInGameCount() + 1) / 2); 
    }

    modifyDealedDamageToCreature(value, toCard, gameContext, continuation) {
        continuation(value + Lad.getBonus()); 
    }

    modifyTakenDamage(value, fromCard, gameContext, continuation) {
        continuation(value - Lad.getBonus());
    }
}


// Отвечает является ли карта уткой.
function isDuck(card) {
    return card instanceof Duck;
}

function isDog(card) {
    return card instanceof Dog;
}

// Дает описание существа по схожести с утками и собаками
function getCreatureDescription(card) {
    if (isDuck(card) && isDog(card)) {
        return 'Утка-Собака';
    }
    if (isDuck(card)) {
        return 'Утка';
    }
    if (isDog(card)) {
        return 'Собака';
    }
    return 'Существо';
}

const seriffStartDeck = [
    new Duck(),
    new Duck(),
    new Duck(),
];
const banditStartDeck = [
    new Lad(),
    new Lad(),
    new Lad(),
];

// Создание игры.
const game = new Game(seriffStartDeck, banditStartDeck);

// Глобальный объект, позволяющий управлять скоростью всех анимаций.
SpeedRate.set(1);

// Запуск игры.
game.play(false, (winner) => {
    alert('Победил ' + winner.name);
});
