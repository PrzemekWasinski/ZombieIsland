export class Camera {
    constructor(positionX, positionY, screen, topLeft, bottomRight, center) {
        this.positionX = positionX;
        this.positionY = positionY;
        this.screen = screen;
        this.topLeft = topLeft;
        this.bottomRight = bottomRight;
        this.center = center;
    }

    setCamera(x, y) {
        this.positionX = Math.floor((this.screen[0] / 2) - x); //Set the camera's X and Y posiiton
        this.positionY = Math.floor((this.screen[1] / 2) - y);

        let tilePosition = [Math.floor(x / 40), Math.floor(y / 40)]; //Divide coordinates by tile size so they can be used on the 2D array

        this.topLeft[0] = tilePosition[0] - 1 - Math.ceil((this.screen[0] / 2) / 40); //Find the top left corner X coordinate
        this.topLeft[1] = tilePosition[1] - 1 - Math.ceil((this.screen[1] / 2) / 40); //Find the top left corner Y coordinate

        if (this.topLeft[0] < 0) { //If camera tries to go outside of the screen
            this.topLeft[0] = 0; //Stop it
        }

        if (this.topLeft[1] < 0) { //If camera tries to go outside of the screen
            this.topLeft[1] = 0; //Stop it
        }

        this.bottomRight[0] = tilePosition[0] + 1 + Math.ceil((this.screen[0] / 2) / 40); //Find the bottom right corner X coordinate
        this.bottomRight[1] = tilePosition[1] + 2 + Math.ceil((this.screen[1] / 2) / 40); //Find the bottom right corner Y coordinate

        if (this.bottomRight[0] >= 40) { //If camera tries to go outside of the screen
            this.bottomRight[0] = 40 - 1; //Stop it
        }

        if (this.bottomRight[1] >= 40) { //If camera tries to go outside of the screen
            this.bottomRight[1] = 40 - 1; //Stop it
        }
    }
}