const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');
const gravity = .7;

class Sprite {
    constructor({ position, imageSrc1, imageSrc2, imageSrc3, scale = 1, framesMax= 1 }) {
        this.position = position;
        this.width = 50;
        this.height = 150;

        this.image1 = new Image();
        this.image1.src = imageSrc1;

        this.image2 = new Image();
        this.image2.src = imageSrc2;

        this.image3 = new Image();
        this.image3.src = imageSrc3;

        this.scale = scale;

        this.framesMax = framesMax;
        this.framesCurrent = 0;
        this.framesElapsed = 0;
        this.framesHold = 5;
    }

    draw() {
        c.drawImage(
            this.image1, 
            
            // Cropping Images for Animation (x, y, width, height)
            this.framesCurrent * (this.image1.width / this.framesMax), // Moving frame to frame to create animation 
            0,
            this.image1.width / this.framesMax,
            this.image1.height,

            this.position.x, 
            this.position.y, 
            (this.image1.width / this.framesMax) * this.scale, 
            this.image1.height * this.scale);

        c.drawImage(
            this.image2, 

            // Cropping Images for Animation (x, y, width, height)
            this.framesCurrent * (this.image2.width / this.framesMax), // Moving frame to frame to create animation 
            0,
            this.image2.width / this.framesMax,
            this.image2.height,

            this.position.x, 
            this.position.y, 
            (this.image2.width / this.framesMax) * this.scale, 
            this.image2.height * this.scale);

        c.drawImage(
            this.image3, 

            // Cropping Images for Animation (x, y, width, height)
            this.framesCurrent * (this.image3.width / this.framesMax), // Moving frame to frame to create animation 
            0,
            this.image3.width / this.framesMax,
            this.image3.height,

            this.position.x, 
            this.position.y, 
            (this.image3.width / this.framesMax) * this.scale, 
            this.image3.height * this.scale);
    }

    update() {
       
        this.draw(); 

        this.framesElapsed++; // This is set as timer which increases every framerate

        if(this.framesElapsed % this.framesHold === 0) // This is is to slow down the animation's framerate.
        {
            if(this.framesCurrent < this.framesMax - 1)
            {
                this.framesCurrent++; // Increase the framesCurrent starting from 0 until 6 (6 pictures to animate over)
            }
            else 
            {
                this.framesCurrent = 0; // When reaching to 6, start back from 0 (reapting the process)
            }
        }

    }
}

class Fighter {
    constructor({ position, velocity, color = 'red', offset }) {
        this.position = position;
        this.velocity = velocity;
        this.width = 50;
        this.height = 150;
        this.lastKey;

        this.attackBox = {
            position: {
                x: this.position.x,
                y: this.position.y
            },
            offset,
            width: 100,
            height: 50
        }

        this.color = color;
        this.isAttacking;
        this.health = 100;
    }

    draw() {
        c.fillStyle = this.color;
        c.fillRect(this.position.x, this.position.y, this.width, this.height);

        // Attck Box
        if(this.isAttacking)
        {
            c.fillStyle ='green';
            c.fillRect(
                this.attackBox.position.x, 
                this.attackBox.position.y, 
                this.attackBox.width, this.attackBox.height);

        }
       
    }

    update() {
        this.draw();
        this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
        this.attackBox.position.y = this.position.y;
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

export { Sprite, Fighter };

