export default class GameManager {
    constructor(oScene) {
        this.oScene = oScene;
        this.numbers = [];
        this.aDrawnNumbers = [];
        this.aSelectedNumbers = [];
        this.currentNumber = null;
        this.aPlayerTicket = [];
        this.aClaimedOptions = [];
    }
    initializeGame() {
        this.numbers = Array.from({ length: 90 }, (_, i) => i + 1);
        this.aDrawnNumbers = [];
        this.aSelectedNumbers = [];
        this.aClaimedOptions = [];
        this.generatePlayerTicket();
    }
    generatePlayerTicket() {
        this.aPlayerTicket = Array(3).fill(null).map(() => Array(9).fill(null));
        for (let row = 0; row < 3; row++) {
            let numbersInRow = 0;
            while (numbersInRow < 5) {
                const col = Math.floor(Math.random() * 9);
                if (!this.aPlayerTicket[row][col]) {
                    const min = col * 10 + 1;
                    const max = col === 8 ? 90 : (col + 1) * 10;
                    const number = min + Math.floor(Math.random() * (max - min + 1));
                    if (!this.aPlayerTicket.flat().includes(number)) {
                        this.aPlayerTicket[row][col] = number;
                        numbersInRow++;
                    }
                }
            }
        }
    }
    getPlayerTicket() {
        return this.aPlayerTicket;
    }
    drawNumber() {
        if (this.numbers.length === 0) {
            clearInterval(this.oScene.drawNumberInterval);
            return null;
        }
        const randomIndex = Math.floor(Math.random() * this.numbers.length);
        this.currentNumber = this.numbers.splice(randomIndex, 1)[0];
        this.aDrawnNumbers.push(this.currentNumber);
        return this.currentNumber;
    }
    checkWin() {
        const aAvailableOptions = {};
        const selectedInRow = [0, 1, 2].map(rowIndex => {
            return this.aPlayerTicket[rowIndex].filter(num => num && this.aSelectedNumbers.includes(num)).length;
        });
        const isFirstRowComplete = selectedInRow[0] === 5;
        const isSecondRowComplete = selectedInRow[1] === 5;
        const isThirdRowComplete = selectedInRow[2] === 5;
        const isFullHouse = this.aSelectedNumbers.length === 15;

        if (!this.aClaimedOptions.includes('isFullHouse')) {
            if (isFirstRowComplete && !this.aClaimedOptions.includes('isFirstRow')) {
                if (!this.aClaimedOptions.includes('isSecondRow') &&
                    !this.aClaimedOptions.includes('isThirdRow')) {
                    aAvailableOptions.isFirstRow = true;
                }
            }
            if (isSecondRowComplete && !this.aClaimedOptions.includes('isSecondRow')) {
                if (!this.aClaimedOptions.includes('isFirstRow') &&
                    !this.aClaimedOptions.includes('isThirdRow')) {
                    aAvailableOptions.isSecondRow = true;
                }
            }
            if (isThirdRowComplete && !this.aClaimedOptions.includes('isThirdRow')) {
                if (!this.aClaimedOptions.includes('isFirstRow') &&
                    !this.aClaimedOptions.includes('isSecondRow')) {
                    aAvailableOptions.isThirdRow = true;
                }
            }
            if (isFullHouse) {
                aAvailableOptions.isFullHouse = true;
            }
        }
        if (Object.keys(aAvailableOptions).length > 0) {
            this.oScene.showClaimOptions(aAvailableOptions);
        }
    }
    getDrawnNumbers() {
        return this.aDrawnNumbers;
    }
}