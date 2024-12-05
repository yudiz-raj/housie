export default class GameManager {
    constructor(oScene) {
        this.oScene = oScene;
        this.numbers = [];
        this.drawnNumbers = [];
        this.currentNumber = null;
        this.playerTicket = [];
        this.gameState = 'READY';
        this.isEarlyFive = false;
        this.isTopLine = false;
        this.isMiddleLine = false;
        this.isBottomLine = false;
        this.isFullHouse = false;
    }

    initializeGame() {
        this.numbers = Array.from({ length: 90 }, (_, i) => i + 1);
        this.drawnNumbers = [];
        this.generatePlayerTicket();
    }

    generatePlayerTicket() {
        // Generate a 3x9 ticket format
        this.playerTicket = Array(3).fill(null).map(() => Array(9).fill(null));

        // Generate 5 numbers for each row
        for (let row = 0; row < 3; row++) {
            let numbersInRow = 0;
            while (numbersInRow < 5) {
                const col = Math.floor(Math.random() * 9);
                if (!this.playerTicket[row][col]) {
                    // Generate number for specific column (1-10, 11-20, etc.)
                    const min = col * 10 + 1;
                    const max = col === 8 ? 90 : (col + 1) * 10;
                    const number = min + Math.floor(Math.random() * (max - min + 1));

                    // Check if number is unique in ticket
                    if (!this.playerTicket.flat().includes(number)) {
                        this.playerTicket[row][col] = number;
                        numbersInRow++;
                    }
                }
            }
        }
    }

    getPlayerTicket() {
        return this.playerTicket;
    }

    drawNumber() {
        if (this.numbers.length === 0) {
            clearInterval(this.oScene.drawNumberInterval);
            return null;
        }

        const randomIndex = Math.floor(Math.random() * this.numbers.length);
        this.currentNumber = this.numbers.splice(randomIndex, 1)[0];
        this.drawnNumbers.push(this.currentNumber);
        return this.currentNumber;
    }

    checkWin() {
        // Check Early Five
        const ticketNumbers = this.playerTicket.flat().filter(n => n !== null);
        const matchedNumbers = ticketNumbers.filter(num => this.drawnNumbers.includes(num));
        if (matchedNumbers.length >= 5 && !this.isEarlyFive) {
            this.isEarlyFive = true;
            return { type: 'Early Five' };
        }
        // Check lines
        for (let row = 0; row < 3; row++) {
            const lineNumbers = this.playerTicket[row].filter(n => n !== null);
            if (lineNumbers.every(num => this.drawnNumbers.includes(num)) && !this[`is${row === 0 ? 'Top' : row === 1 ? 'Middle' : 'Bottom'}Line`]) {
                this[`is${row === 0 ? 'Top' : row === 1 ? 'Middle' : 'Bottom'}Line`] = true;
                return {
                    type: row === 0 ? 'Top Line' :
                        row === 1 ? 'Middle Line' :
                            'Bottom Line'
                };
            }
        }
        // Check Full House
        if (ticketNumbers.every(num => this.drawnNumbers.includes(num)) && !this.isFullHouse) {
            this.isFullHouse = true;
            return { type: 'Full House' };
        }

        return null;
    }

    getDrawnNumbers() {
        return this.drawnNumbers;
    }
}