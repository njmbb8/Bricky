function generateBricks(){
    const numberOfBricks = 60 //6 bricks can fit in each column 10 bricks in each row
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

generateBricks(); //executing the command gets bricks