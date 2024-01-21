import { Sprite, Fighter } from "./js/classes.js";
//import { rectangularCollision, determineWinner, decreaseTimer, timerId } from './js/utils.js';

window.onload = ()=> {
    setGame();
};

const setGame = () => {
    
    // Project Setup
    const canvas = document.querySelector('canvas');
    const c = canvas.getContext('2d');

    canvas.width = 1024;
    canvas.height = 576;

    c.fillRect(0, 0, canvas.width, canvas.height);

    // Create Player and Enemy
    const gravity = .7;

    const background = new Sprite({
        position: {
            x: 0,
            y:0
        },

        imageSrc: './img/background/background.png',

    });

    const shop = new Sprite({
        position: {
            x: 600,
            y: 135
        },

        imageSrc: './img/decorations/shop_anim.png',

        scale: 2.75,
        framesMax: 6
  
    });

    const player = new Fighter({
        
        position: {
            x: 0,
            y: 0
        },

        velocity: {
            x: 0,
            y: 0
        },

        offset: {
            x: 0,
            y: 0
        },

        imageSrc: './img/Martial Hero/Sprites/Idle.png',
        
        framesMax: 8,
        scale: 2.5,
        offset: {
            x:  215,
            y:  250
        },
        sprites: {
            idle: {
                imageSrc: './img/Martial Hero/Sprites/Idle.png',
                framesMax: 8
            },

            run: {
                imageSrc: './img/Martial Hero/Sprites/Run.png',
                framesMax: 8
            },

            jump: {
                imageSrc: './img/Martial Hero/Sprites/Jump.png',
                framesMax: 2
            },
            
            fall: {
                imageSrc: './img/Martial Hero/Sprites/Fall.png',
                framesMax: 2
            },

            attack1: {
                imageSrc: './img/Martial Hero/Sprites/Attack1.png',
                framesMax: 6
            }
            
        }

    });

    const enemy = new Fighter({
        position: {
            x: 400,
            y: 100
        },

        velocity: {
            x: 0,
            y: 0
        },

        offset: {
            x: -50,
            y: 0
        },

        color: 'blue',

        imageSrc: './img/Martial Hero/Sprites/Idle.png',
        framesMax: 8,
        scale: 2.5,
        offset: {
            x:  215,
            y:  250
        }

    });

  
    const keys = {
        a: {
            pressed: false
        },

        d: {
            pressed: false
        },

        ArrowLeft: {
            pressed: false
        },

        ArrowRight: {
            pressed: false
        }
    };

    const rectangularCollision = ({rectangle1, rectangle2}) => {
        return (rectangle1.attackBox.position.x + rectangle1.attackBox.width >= rectangle2.position.x
            && rectangle1.attackBox.position.x <= rectangle2.position.x + rectangle2.width
            && rectangle1.attackBox.position.y + rectangle1.attackBox.height >= rectangle2.position.y
            && rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height);
    }
    
    // End the game based on Timer
    const determineWinner = ({player, enemy, timerId}) => {
        
        clearTimeout(timerId);
    
        document.getElementById('displayText').style.display = 'flex';
    
        if(player.health === enemy.health){
            document.getElementById('displayText').innerHTML = 'Tie';
            
        }
    
        else if(player.health > enemy.health) {
            document.getElementById('displayText').innerHTML = 'Player 1 Win';
        }
    
        else if(player.health < enemy.health) {
            document.getElementById('displayText').innerHTML = 'Player 2 Win';
        }
    }
    
    let timer = 60;
    let timerId;
    const decreaseTimer = () => {
        
        if(timer > 0)
        {
            timerId = setTimeout(decreaseTimer, 1000);
            timer--;
            document.getElementById('timer').innerHTML = timer;
        }
    
        if(timer === 0){
            
            determineWinner({player, enemy, timerId});
        }
        
    };

    decreaseTimer(player, enemy);

    const animate = () => {
        
        window.requestAnimationFrame(animate);
        c.fillStyle = 'black';
        c.fillRect(0, 0, canvas.width, canvas.height);

        background.update();
        shop.update();

        player.update();
        enemy.update();

        player.velocity.x = 0;
        enemy.velocity.x = 0;

        // Player Movement
    
        if(keys.a.pressed && player.lastKey === 'a'){
            player.velocity.x = -5;
            player.switchSprite('run');
    
        } else if(keys.d.pressed && player.lastKey === 'd'){
            player.velocity.x = 5;
            player.switchSprite('run');

        } else {
            player.switchSprite('idle');
        }

        if(player.velocity.y < 0){
            player.switchSprite('jump');
        } else if (player.velocity.y > 0) {
            player.switchSprite('fall');
        }

        // Enemy Movement
        if(keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft'){
            enemy.velocity.x = -5;
        } else if(keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight'){
            enemy.velocity.x = 5;
        }

        // Detect for Collision from Player
        if(rectangularCollision ({rectangle1: player, rectangle2: enemy}) && player.isAttacking){
            
                player.isAttacking = false;
                enemy.health -= 20;
          
                document.querySelector('#enemyHealth').style.width = enemy.health + "%";
        }
        
        // Detect for Collision from Enemy
        if(rectangularCollision ({rectangle1: enemy, rectangle2: player}) && enemy.isAttacking){
            
            enemy.isAttacking = false;
            player.health -= 20;
     
            document.querySelector('#playerHealth').style.width = player.health + "%";
        }

        // End the game based on Health
        if(enemy.health <=0 || player.health <= 0){
            determineWinner({player, enemy, timerId});
        }
    };

    animate();

    //Move Characters with Event Listener
    window.addEventListener('keydown', ((e) => {
        
        switch (e.key) {
            case 'd': 
                keys.d.pressed = true;
                player.lastKey = 'd';
                break;

            case 'a': 
                keys.a.pressed = true;
                player.lastKey = 'a';
                break;

            case 'w': 
                player.velocity.y = -20;
                break;

            case ' ':
                player.attack();
                break;
            
            // Enemy Keys
            case 'ArrowRight': 
                keys.ArrowRight.pressed = true;
                enemy.lastKey = 'ArrowRight';
                break;

            case 'ArrowLeft': 
                keys.ArrowLeft.pressed = true;
                enemy.lastKey = 'ArrowLeft';
                break;

            case 'ArrowUp': 
                enemy.velocity.y = -20;
                break;

            case 'ArrowDown': 
                enemy.attack();
                break;
        }
  
    }));

    window.addEventListener('keyup', ((e) => {
        
        switch (e.key) {
            case 'd': 
                keys.d.pressed = false;
                break;

            case 'a': 
                keys.a.pressed = false;
                break;

       

            //Enemy Keys        
            case 'ArrowRight': 
                keys.ArrowRight.pressed = false;
                break;

            case 'ArrowLeft': 
                keys.ArrowLeft.pressed = false;
                break;

        }

    }));

};