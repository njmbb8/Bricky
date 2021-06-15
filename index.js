function generateBricks(){
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
function bindKeys(paddle) {
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

class paddle{
    node = document.getElementById('paddle');//DOM node that refers to the paddle
    height = this.node.offsetHeight;//height of paddle
    width = this.node.offsetWidth;//width of paddle. these are useful to calcuate collisions between the paddle and other objects
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
        if((this.getYCoordinate() + this.height) < document.getElementById('game').offsetHeight){
            this.setYCoordinate(this.getYCoordinate() + 10);
        }
    }
}

const gamePaddle = new paddle(); //instantiate a variable as a new instance of paddle
generateBricks(); //generate the bricks
bindKeys(gamePaddle); //establish controls