
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
    
    class Sprite {
        constructor({ position, velocity, color = 'red' }) {
            this.position = position;
            this.velocity = velocity;
            this.width = 50;
            this.height = 150;
            this.lastKey;
            this.attackBox = {
                position: this.position,
                width: 100,
                height: 50
            }
            this.color = color;
            this.isAttacking;
        }

        draw() {
            c.fillStyle = this.color;
            c.fillRect(this.position.x, this.position.y, this.width, this.height);

            // Attck Box
            c.fillStyle ='green';
            c.fillRect(this.attackBox.position.x, 
                this.attackBox.position.y, 
                this.attackBox.width, this.attackBox.height);

        }

        update() {
            this.draw();
            
            this.position.x += this.velocity.x;
            this.position.y += this.velocity.y;

            if(this.position.y + this.height + this.velocity.y >= canvas.height){
                this.velocity.y = 0;
            }else {
                this.velocity.y += gravity;
            }
        }

        attack() {
            this.isAttacking = true;

            setTimeout(() => {
                this.isAttacking = false;
            }, 100);
        }
    }

    const player = new Sprite({
        position: {
            x: 0,
            y: 0
        },

        velocity: {
            x: 0,
            y: 0
        }

    });

    const enemy = new Sprite({
        position: {
            x: 400,
            y: 100
        },

        velocity: {
            x: 0,
            y: 0
        },

        color: 'blue'

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


    const animate = () => {
        
        window.requestAnimationFrame(animate);
        c.fillStyle = 'black';
        c.fillRect(0, 0, canvas.width, canvas.height);
        player.update();
        enemy.update();

        player.velocity.x = 0;
        enemy.velocity.x = 0;

        // Player Movement
        if(keys.a.pressed && player.lastKey === 'a'){
            player.velocity.x = -5;
        } else if(keys.d.pressed && player.lastKey === 'd'){
            player.velocity.x = 5;
        }

        // Enemy Movement
        if(keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft'){
            enemy.velocity.x = -5;
        } else if(keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight'){
            enemy.velocity.x = 5;
        }

        // Detect for Collision
        if(player.attackBox.position.x + player.attackBox.width >= enemy.position.x
            && player.attackBox.position.x <= enemy.position.x + enemy.width
            && player.attackBox.position.y + player.attackBox.height >= enemy.position.y
            && player.attackBox.position.y <= enemy.position.y + enemy.height
            && player.isAttacking){
            
                console.log('attack');
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
        }

        console.log(e.key);
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

        console.log(e.key);
    }));

};