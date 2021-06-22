class baseElement{
    constructor(id){
        this.node = document.getElementById(id);
        this.height = this.node.offsetHeight;//height of paddle
        this.width = this.node.offsetWidth;//width of paddle. these are useful to calcuate collisions between the paddle and other objects
    }
    getXCoordinate(){
      //returns the "left" css property after all css has been computed, strips the px on the end and converts the resulting number from string to int 
        return parseInt(window.getComputedStyle(this.node)['left'].replace('px', ''));
    }
    setXCoordinate(X){
      //updates the actual position of the paddle to a new one
        this.node.style.left = X +'px';
    }
    getYCoordinate(){
        return parseInt(window.getComputedStyle(this.node)['bottom'].replace('px', ''))
    }
    setYCoordinate(Y){
        this.node.style.bottom = Y + 'px';
    }
}

class paddle extends baseElement{
    constructor(id){
        super(id);
    }
  /*The following methods check to see if the paddle has hit a boundary
    and if not, will then add or subtract 10 to either the x or y coordinate
    depending on which direction the paddle will move*/
    moveLeft(){
        if(this.getXCoordinate() > 0){
            this.setXCoordinate(this.getXCoordinate() - 10);
        }
    }
    moveRight(){
        if((this.getXCoordinate() + this.width) < document.getElementById('game').offsetWidth){ 
            this.setXCoordinate(this.getXCoordinate() + 10);
        }
    }
    moveDown(){
        if(this.getYCoordinate() > 0){
            this.setYCoordinate(this.getYCoordinate() - 10);
        }
    }
    moveUp(){
        //here we subtract the height of the brick container from the height of the game to get our ne upper limit as the bottom of the brick container
        if((this.getYCoordinate() + this.height) < (document.getElementById('game').offsetHeight - document.getElementById('brickContainer').offsetHeight)){
            this.setYCoordinate(this.getYCoordinate() + 10);
        }
    }
}

class projectile extends baseElement{
    constructor(id){
        super(id);
    }
    /*1 and -1 are chosen here to give the ball an initial trajectory of 45 degrees
        moving in the direction of the initial starting location of the paddle*/
    xVelocity = 1;
    yVelocity = -1;
    move(){ //this method takes the current position, adds the velocity to them and sets that number as the new coordinate
        this.setXCoordinate(this.getXCoordinate() + this.xVelocity);
        this.setYCoordinate(this.getYCoordinate() + this.yVelocity);
    }
    changeVelocity(x, y){
        this.xVelocity = x;
        this.yVelocity = y;
    }
}

class brick extends baseElement{
    constructor(id){
        super(id);
    }
    isDisappeared = false;
    disappear(){
        this.node.style.backgroundColor = 'black';
        this.isDisappeared = true;
    }
}

class game extends baseElement{
    constructor(id){
        super(id);
        this.paddle = new paddle('paddle');
        this.projectile = new projectile('projectile');
        this.generateBricks();
        this.bindKeys(this.paddle);
    }
    
    generateBricks(){
        const numberOfBricks = 60; //6 bricks can fit in each column 10 bricks in each row
        let brickContainer = document.getElementById("brickContainer"); //store the #brickcontainer element in a variable
        for( let i = 0; i < numberOfBricks; i++){
            let brick = document.createElement('div'); //create a div element and assign it to a variable
            brick.classList.add('brick'); //add the brick class to the element, telling the computer that this is a brick
            let red = Math.floor(Math.random() * 255); //generate random red value
            let blue = Math.floor(Math.random() * 255); //generate random blue value
            let green = Math.floor(Math.random() * 255); //generate random green value
            brick.style.backgroundColor = `rgb(${red}, ${green}, ${blue})`; //use the previously generated values to set the brick to a random color
            brickContainer.appendChild(brick); //place the brick in the brickContainer which will make it show on screen
        }
    }
    /*The following function tells the DOM to listen for a key
    to be pressed, and if it is, move our paddle in the co-
    responding direction*/
    bindKeys(paddle) {
        document.addEventListener('keydown', function(e){
            switch (e.key) {
                case "ArrowLeft":
                    paddle.moveLeft(); 
                    break;
                case "ArrowRight":
                    paddle.moveRight();
                    break;
                case "ArrowUp":
                    paddle.moveUp();
                    break;
                case "ArrowDown":
                    paddle.moveDown();
                    break;
                default:
                    break;
            }
        })
    }
}

const gameContext = new game('game');


    /*The following function will update the screen with changes
    that have been made to any elements of the game(such as the
    projectile moving on the screen*/