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
        return parseInt(window.getComputedStyle(this.node)['bottom'].replace('px', ''));
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
    getXCoordinate(){
        return this.node.offsetLeft;
    }
    getYCoordinate(){
        return this.node.offsetTop + this.node.offsetHeight;
    }
}

class game extends baseElement{
    constructor(id){
        super(id);
        this.paddle = new paddle('paddle');
        this.projectile = new projectile('projectile');
        this.bindKeys(this.paddle);
        this.brickArray = this.generateBricks();
        this.run();
    }
    
    generateBricks(){
        const brickContainer = document.getElementById("brickContainer"); //store the #brickcontainer element in a variable
        const brickArray = ['']; //the array we will be storing the bricks in
        for( let i = 0; i < 6; i++){ //When this loop completes, we will be on a new row
            let brickRow = []; //one dimensional array to store rows in temporarily
            for (let j = 0; j < 10; j++) { //When this loop completes we will be in a new column. 6* 10 = 60 which is the amount that we can fit in our brick container
                let brickNode = document.createElement('div');//create a div element and assign it to a variable
                brickNode.classList.add('brick');//add the brick class to the element, telling the computer that this is a brick
                let red = Math.floor(Math.random() * 255); //generate random red value
                let blue = Math.floor(Math.random() *255); //generate random blue value
                let green = Math.floor(Math.random() * 255); //generate random green value
                brickNode.style.backgroundColor = `rgb(${red}, ${green}, ${blue})`; //use the previously generated values to set the brick to a random color
                brickNode.setAttribute('id', 'brick' + i + '' + j); //give the brick a unique id
                brickContainer.appendChild(brickNode); //place the brick in the brickContainer which will make it show on screen
                brickRow[j] = new brick(brickNode.getAttribute('id')); //Add new brick to the array
            }
            brickArray[i] = brickRow;//adding each row to the array
        }
        return brickArray; // returning the array containing all of the bricks as variables that can be worked with
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
    detectCollision(){
        if(this.projectile.getXCoordinate() < (this.paddle.getXCoordinate() + this.paddle.width) //checks if the projectile is left of the right side of the paddle
            && this.projectile.getXCoordinate() > this.paddle.getXCoordinate()//checks is the projectile is to the right of the left side of the paddle
            && this.projectile.getYCoordinate() < (this.paddle.getYCoordinate() + this.paddle.height)//checks that the projectile is below the top of the top of the paddle
            && this.projectile.getYCoordinate() > this.paddle.getYCoordinate()){//checks that the projectile is above the bottom of the paddle
                //if all conditions are true, then a collision has been detected and the velocity needs to change
                this.projectile.changeVelocity(this.projectile.xVelocity, this.projectile.yVelocity * -1);
            }
        else if(this.projectile.getYCoordinate() > (this.height - document.getElementById('brickContainer').offsetHeight)){//do not detect brick collision unless projectile is in the brick container
            let projectileGridX = this.projectile.getXCoordinate() * 10 / this.width; //get projectile's x coordinate in terms of columns and rows
            let projectileGridY = Math.abs(((this.projectile.getYCoordinate() - 266) * 6 / 133) - 6); //get projectile's y coordinate in terms of columns and rows
            let activeBrick = this.brickArray[Math.floor(projectileGridY)][Math.floor(projectileGridX)]; //select brick that projectile is colliding with
            if(this.projectile.getXCoordinate() > activeBrick.getXCoordinate()
                &&this.projectile.getXCoordinate() < (activeBrick.getXCoordinate() + activeBrick.width)
                &&this.projectile.getYCoordinate() > activeBrick.getYCoordinate()
                &&(this.projectile.getYCoordinate() - 266) <(activeBrick.getYCoordinate() + activeBrick.height)){ //detect if the active brick has been collided
                    if(!activeBrick.isDisappeared){ // don't collide with anything that has already been disappeared
                        this.projectile.changeVelocity(this.projectile.xVelocity * -1, this.projectile.yVelocity * -1); //adjust velocity
                        activeBrick.disappear(); //disappear the brick
                    }
            }
        }
        else if(this.projectile.getXCoordinate() <= this.getXCoordinate()
                || this.projectile.getXCoordinate() >= this.getXCoordinate() + this.width){
                    this.projectile.changeVelocity(this.projectile.xVelocity * -1, this.projectile.xVelocity);
                }
        else if(this.projectile.getYCoordinate() <= this.getYCoordinate()
                || this.projectile.getYCoordinate() >= this.getYCoordinate() + this.height){
                    this.projectile.changeVelocity(this.projectile.xVelocity, this.projectile.yVelocity * -1);
                }
    }
    updateScreen(){
        this.projectile.move();
        this.detectCollision();
    }
    run(){
        let that = this;
        window.setInterval(function(){
            return that.updateScreen();
        }, 17);
    }
}

const gameContext = new game('game');