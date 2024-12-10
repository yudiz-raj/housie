import Button from "../prefabs/Button";
import assets from "../scripts/assets";
import config from "../scripts/config";
import GameManager from "../scripts/GameManager";
import TweenManager from "../scripts/TweenManager";
export default class Level extends Phaser.Scene {
    constructor() {
        super("Level");
        this.oGameManager = null;
        this.currentNumberDisplay = null;
        this.ticketNumbers = [];
    }
    createHeader() {
        this.createText('HOUSIE', config.centerX, 200, {
            fontSize: '60px',
            fontStyle: 'bold',
        });
    }
    instuctionScreen() {
        this.container_instruction = this.add.container(0, 0);
        this.countDownText = this.createText('3', config.centerX, config.centerY, {
            fontSize: '164px',
            color: '#ff0000',
        }).setScale(0);
        this.container_instruction.add(this.countDownText);
        const instruction_base = this.add.image(config.centerX, config.centerY + 200, assets.gray_base).setScale(3);
        this.container_instruction.add(instruction_base);
        this.instructionText = this.createText(' Select a number to claim your prize! claim your prize by completing a row or full house! ', config.centerX, config.centerY + 200, {
            fontSize: '42px',
        }).setWordWrapWidth(850);
        this.container_instruction.add(this.instructionText);
    }
    createNumberDisplay() {
        this.container_numberDisplay = this.add.container(0, 0).setVisible(false);
        const displayBg = this.add.image(config.centerX, 500, assets.ring);
        this.container_numberDisplay.add(displayBg);
        this.currentNumberDisplay = this.createText('', config.centerX, 500, {
            fontSize: '72px',
        });
        this.container_numberDisplay.add(this.currentNumberDisplay);
    }
    createWinSymbols() {
        this.container_winSymbols = this.add.container(0, 0).setVisible(false);
        this.house_symbol = this.add.image(config.centerX, 1150, assets.house_symbol).setAlpha(0.5).setScale(1.5);
        this.container_winSymbols.add(this.house_symbol);
        this.topLine_symbol = this.add.image(config.centerX, 1290, assets.gray_base).setScale(1.5).setAlpha(0.5);
        this.container_winSymbols.add(this.topLine_symbol);
        this.middleLine_symbol = this.add.image(config.centerX, 1400, assets.gray_base).setScale(1.5).setAlpha(0.5);
        this.container_winSymbols.add(this.middleLine_symbol);
        this.bottomLine_symbol = this.add.image(config.centerX, 1510, assets.gray_base).setScale(1.5).setAlpha(0.5);
        this.container_winSymbols.add(this.bottomLine_symbol);
        this.container_ticket.add(this.container_winSymbols);
    }
    createPlayerTicket() {
        this.container_ticket = this.add.container(0, 0).setVisible(false);
        const ticket = this.oGameManager.getPlayerTicket();
        const ticketBase = this.add.image(config.centerX, 1400, assets.ticket_base);
        this.container_ticket.add(ticketBase);
        this.createWinSymbols();
        const container_ticket_numbers = this.add.container(0, 0);
        this.container_ticket.add(container_ticket_numbers);
        ticket.forEach((row, rowIndex) => {
            for (let col = 0; col < 9; col++) {
                const number = row[col];
                const x = (col * 75) + (col < 3 ? 230 : (col > 4 ? 245 : 240));
                const y = rowIndex * 110 + (1290);
                if (number) {
                    const numberText = this.createText(number, x, y, {
                        fontSize: '42px',
                        color: '#5A2101'
                    }).on('pointerdown', () => {
                        numberText.disableInteractive();
                        if (!this.oGameManager.aSelectedNumbers.includes(number)) {
                            this.oGameManager.aSelectedNumbers.push(number);
                            this.add.image(numberText.x + 2, numberText.y, assets.selection_ring).setScale(1.1);
                            this.oGameManager.checkWin();
                        }
                    });
                    container_ticket_numbers.add(numberText);
                    this.ticketNumbers.push({
                        number: number,
                        text: numberText,
                    });
                }
            }
        });
    }
    createText(title, x, y, {
        fontFamily = config.fontFamily,
        fontSize = '34px',
        align = 'center',
        color = '#ffffff',
        stroke = '#000000',
        strokeThickness = 0,
        shadowColor = '#000000',
        shadowOffsetX = 0,
        shadowOffsetY = 0,
        shadowBlur = 0,
        shadowStroke = false,
        shadowFill = false
    } = {}) {
        const txt_title = this.add.text(x, y, ` ${title} `, {
            fontFamily: fontFamily,
            fontSize: fontSize,
            align: align,
            color: color,
            stroke: stroke,
            strokeThickness: strokeThickness,
            shadow: {
                color: shadowColor,
                offsetX: shadowOffsetX,
                offsetY: shadowOffsetY,
                blur: shadowBlur,
                stroke: shadowStroke,
                fill: shadowFill
            }
        });
        txt_title.setOrigin(0.5);
        return txt_title;
    }
    addMask(container, width, height, x, y) {
        const shape = this.make.graphics();
        shape.fillRect(x, y, width, height);
        const mask = shape.createGeometryMask();
        container.setMask(mask);
    }
    editorCreate() {
        this.add.image(config.centerX, config.centerY, assets.background);
        this.createHeader();
        this.instuctionScreen();
        this.createNumberDisplay();
        this.container_drawnNumbers = this.add.container(0, 0).setVisible(false);
        this.addMask(this.container_drawnNumbers, 1030, 100, 25, 650);
        this.createPlayerTicket();
        this.container_claimOptions = this.add.container(0, 0).setVisible(false);
    }

    create() {
        this.oGameManager = new GameManager(this);
        this.oTweenManager = new TweenManager(this);
        this.oGameManager.initializeGame();
        this.editorCreate();
        this.startCountDown();
        this.startGame();
    }
    startCountDown() {
        let countDown = 3;
        this.countDownInterval = setInterval(() => {
            this.oTweenManager.moveOrScaleTo(this.countDownText, { scaleX: 1, scaleY: 1, duration: 500, yoyo: true, ease: 'Power2' });
            this.countDownText.setText(countDown);
            this.countDownText.setStyle({
                color: countDown === 3 ? '#ff0000' : countDown === 2 ? '#ffff00' : '#00ff00',
            });
            if (countDown <= 0) {
                this.cameras.main.fadeOut(500);
                clearInterval(this.countDownInterval);
                this.cameras.main.fadeIn(500);
                this.container_instruction.setVisible(false);
                this.container_numberDisplay.setVisible(true);
                this.container_ticket.setVisible(true);
                this.container_drawnNumbers.setVisible(true);
                this.container_winSymbols.setVisible(true);
                this.container_claimOptions.setVisible(true);
            }
            countDown--;
        }, 1000);
    }
    startGame() {
        this.drawNumberInterval = setInterval(() => {
            this.oGameManager.drawNumber();
            this.oTweenManager.moveOrScaleTo(this.currentNumberDisplay, {
                scaleX: 0.1, scaleY: 0.1, duration: 500, yoyo: true, ease: 'Quad.easeInOut', onYoyo: () => {
                    this.currentNumberDisplay.setText(this.oGameManager.currentNumber);
                }
            });
            this.enableTicketNumber(this.oGameManager.currentNumber);
            this.createDrawnNumber();
        }, 4000);
    }
    enableTicketNumber(number) {
        const playerTicket = this.oGameManager.getPlayerTicket();
        for (let row = 0; row < playerTicket.length; row++) {
            for (let col = 0; col < playerTicket[row].length; col++) {
                if (playerTicket[row][col] === number) {
                    const ticketNumber = this.ticketNumbers.find(
                        ticket => ticket.number === number
                    );
                    ticketNumber.text.setInteractive();
                }
            }
        }
    }
    createDrawnNumber() {
        if (this.container_drawnNumbers.list.length > 15) this.container_drawnNumbers.list.shift();
        const x = this.container_drawnNumbers.list.length ? this.container_drawnNumbers.list[this.container_drawnNumbers.list.length - 1].x + 80 : 1180;
        const drawnNumber = new Button(this, x, 700, { texture: assets.blue_circle_base, scaleX: 1.2, scaleY: 1.2, text: this.oGameManager.aDrawnNumbers[this.oGameManager.aDrawnNumbers.length - 1], color: '#5A2101' });
        drawnNumber.btn_image.disableInteractive();
        this.container_drawnNumbers.add(drawnNumber);
        this.oTweenManager.moveOrScaleTo(this.container_drawnNumbers, { x: this.container_drawnNumbers.x - 80, duration: 300, ease: 'Power2' });
    }
    showClaimOptions(claimOptions) {
        this.container_claimOptions.removeAll(true);
        console.log(this.container_claimOptions.list);
        Object.entries(claimOptions).forEach(([key, value], index) => {
            if (value && !this.oGameManager.aClaimedOptions.includes(key)) {
                console.log("key", key);
                const displayText = key.replace('is', '').split(/(?=[A-Z])/).join(' ');
                const buttonWidth = 250;
                const totalWidth = (Object.keys(claimOptions).length - 1) * buttonWidth;
                const startX = config.centerX - (totalWidth / 2);
                const btn = new Button(this, startX + (index * buttonWidth), 1700, { texture: assets.btn_orange, scaleX: 0.7, scaleY: 0.7, text: displayText, color: '#5A2101' }, () => {
                    this.oGameManager.aClaimedOptions.push(key);
                    btn.btn_image.disableInteractive();
                    btn.setAlpha(0.5);
                    this.showWinScreen(key);
                    this.oGameManager.checkWin();
                });
                this.container_claimOptions.add(btn);
            }
        });
    }
    showWinScreen(winResult) {
        this.container_claimOptions.removeAll(true);
        switch (winResult) {
            case 'isFullHouse':
                clearInterval(this.drawNumberInterval);
                this.showWinAnimation(this.house_symbol);
                break;
            case 'isFirstRow':
                this.showWinAnimation(this.topLine_symbol);
                break;
            case 'isSecondRow':
                this.showWinAnimation(this.middleLine_symbol);
                break;
            case 'isThirdRow':
                this.showWinAnimation(this.bottomLine_symbol);
                break;
        }
    }
    showWinAnimation(symbol) {
        symbol.setAlpha(1);
        if (symbol.texture.key.includes('gray')) {
            symbol.setTintFill(0x00ff00);
        }
        this.oTweenManager.moveOrScaleTo(symbol, { scaleX: 1.9, scaleY: 1.9, duration: 300, ease: 'Power2', yoyo: true, repeat: 2 });
    }
}
