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
        this.drawnNumberText = null;
        this.ticketNumbers = [];
    }
    createHeader() {
        this.createText('HOUSIE', config.centerX, 200, {
            fontSize: '60px',
            fontStyle: 'bold',
        });
    }
    createNumberDisplay() {
        this.container_numberDisplay = this.add.container(0, 0);
        const displayBg = this.add.image(config.centerX, 500, assets.ring);
        this.container_numberDisplay.add(displayBg);

        this.currentNumberDisplay = this.createText('', config.centerX, 500, {
            fontSize: '72px',
        });
        this.container_numberDisplay.add(this.currentNumberDisplay);
    }
    createPlayerTicket() {
        // this.createText('Your Ticket', config.centerX, 1210, {
        //     fontSize: '38px',
        //     fontStyle: 'bold'
        // });
        const ticket = this.oGameManager.getPlayerTicket();
        const ticketBase = this.add.image(config.centerX, 1400, assets.ticket_base);
        ticket.forEach((row, rowIndex) => {
            for (let col = 0; col < 9; col++) {
                const number = row[col];
                const x = (col * 75) + (col < 3 ? 230 : (col > 4 ? 245 : 240));
                const y = rowIndex * 110 + (1290);
                // const cell = this.add.image(x, y, assets.blue_base).setScale(1.2);

                if (number) {
                    const numberText = this.createText(number, x, y, {
                        fontSize: '42px',
                        color: '#5A2101'
                    });

                    this.ticketNumbers.push({
                        number: number,
                        text: numberText,
                        // cell: cell
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
        this.createNumberDisplay();
        this.container_drawnNumbers = this.add.container(0, 0);
        this.addMask(this.container_drawnNumbers, 1030, 100, 25, 650);
        this.createPlayerTicket();
    }

    create() {
        this.oGameManager = new GameManager(this);
        this.oTweenManager = new TweenManager(this);
        this.oGameManager.initializeGame();
        this.editorCreate();
        this.startGame();
    }
    startGame() {
        this.drawNumberInterval = setInterval(() => {
            this.oGameManager.drawNumber();
            this.currentNumberDisplay.setText(this.oGameManager.currentNumber);
            this.highlightTicketNumber(this.oGameManager.currentNumber);
            this.createDrawnNumber();
            // const win = this.oGameManager.checkWin();
            // if (win) {
            //     this.showWinScreen(win);
            // }
        }, 1000);
    }
    highlightTicketNumber(number) {
        const playerTicket = this.oGameManager.getPlayerTicket();
        for (let row = 0; row < playerTicket.length; row++) {
            for (let col = 0; col < playerTicket[row].length; col++) {
                if (playerTicket[row][col] === number) {
                    console.log(number, this.ticketNumbers);
                    const ticketButton = this.ticketNumbers.find(
                        ticket => ticket.number === number
                    );
                    console.log(ticketButton);
                    if (ticketButton) this.add.image(ticketButton.text.x + 2, ticketButton.text.y, assets.selection_ring).setScale(1.1);
                }
            }
        }
    }
    createDrawnNumber() {
        if (this.container_drawnNumbers.list.length > 15) this.container_drawnNumbers.list.shift();
        const x = this.container_drawnNumbers.list.length ? this.container_drawnNumbers.list[this.container_drawnNumbers.list.length - 1].x + 80 : 1180;
        const drawnNumber = new Button(this, x, 700, { texture: assets.blue_circle_base, scaleX: 1.2, scaleY: 1.2, text: this.oGameManager.drawnNumbers[this.oGameManager.drawnNumbers.length - 1], color: '#5A2101' });
        this.container_drawnNumbers.add(drawnNumber);
        this.oTweenManager.moveOrScaleTo(this.container_drawnNumbers, { x: this.container_drawnNumbers.x - 80, duration: 300, ease: 'Power2' });
    }
    showWinScreen(win) {
        const txt_win = this.createText(`HOUSIE!\nYou Won!\n${win.type}`, config.centerX, 1920, {
            fontSize: '60px',
            fontStyle: 'bold',
        });
        this.oTweenManager.moveOrScaleTo(txt_win, {
            y: 1000, duration: 300, ease: 'Power2', callback: () => {
                this.oTweenManager.moveOrScaleTo(txt_win, {
                    y: 1920, duration: 300, ease: 'Power2', callback: () => {
                        txt_win.destroy();
                    }
                });
            }
        });
    }
}
