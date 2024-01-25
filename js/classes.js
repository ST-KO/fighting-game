const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');
const gravity = .7;

class Sprite {
    constructor({ position, imageSrc, scale = 1, framesMax= 1, offset = {x: 0, y: 0} }) {
        this.position = position;
        this.width = 50;
        this.height = 150;

        this.image = new Image();
        this.image.src = imageSrc;

        this.scale = scale;

        this.framesMax = framesMax;
        this.framesCurrent = 0;
        this.framesElapsed = 0;
        this.framesHold = 5;
        this.offset = offset;
    }

    draw() {
       
        c.drawImage(
            this.image, 

            // Cropping Images for Animation (x, y, width, height)
            this.framesCurrent * (this.image.width / this.framesMax), // Moving frame to frame to create animation 
            0,
            this.image.width / this.framesMax,
            this.image.height,

            this.position.x - this.offset.x, 
            this.position.y - this.offset.y, 
            (this.image.width / this.framesMax) * this.scale, 
            this.image.height * this.scale);

    }

    animateFrame() {
        
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

    update() {
       
        this.draw(); 

        this.animateFrame();

    }
}


class Fighter extends Sprite{
    constructor({ position, velocity, color = 'red', imageSrc, scale = 1, framesMax= 1, 
    offset = {x: 0, y: 0}, sprites, attackBox = {offset: {}, width: undefined, height: undefined} }) {
        
        super({
            
            position,
            imageSrc,
            scale,
            framesMax,
            offset
        })

       
        this.velocity = velocity;
        this.width = 50;
        this.height = 150;
        this.lastKey;

        this.attackBox = {
            position: {
                x: this.position.x,
                y: this.position.y
            },
            offset: attackBox.offset,
            width: attackBox.width,
            height: attackBox.height
        }

        this.color = color;
        this.isAttacking;
        this.health = 100;

        this.framesCurrent = 0;
        this.framesElapsed = 0;
        this.framesHold = 5;
        this.sprites = sprites;
        this.dead = false;

        for (const sprite in this.sprites){
            sprites[sprite].image = new Image();
            sprites[sprite].image.src = sprites[sprite].imageSrc;
        }

    }

    
    update() {
        this.draw();
        if(!this.dead){
            this.animateFrame();
        }
      

        // Attack Boxes
        this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
        this.attackBox.position.y = this.position.y + this.attackBox.offset.y;

        // Drawing the attack box
        //c.fillRect(this.attackBox.position.x, this.attackBox.position.y, this.attackBox.width, this.attackBox.height);

        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        // Gravity Function
        if(this.position.y + this.height + this.velocity.y >= canvas.height){
            this.velocity.y = 0;
            this.position.y = 426;
        }else {
            this.velocity.y += gravity;
        }

   
    }

    attack() {
        
        this.switchSprite('attack1');
        this.isAttacking = true;

        setTimeout(() => {
            this.isAttacking = false;
        }, 1000);
    }

    takeHit(){
        

        if(this.health <= 0){
            this.switchSprite('death');
        }else{
            this.switchSprite('takeHit');
        }
    }

    switchSprite(sprite) {
        
        if(this.image === this.sprites.death.image){
            if(this.framesCurrent === this.sprites.death.framesMax -1)
            {
                this.dead = true;
            }
            
            return;
        }
        
        // Overwriting all other animations with the attack animation
        if(this.image === this.sprites.attack1.image && 
            this.framesCurrent < this.sprites.attack1.framesMax - 1){
            return;
        }

        // Overwriting when fighter gets hit
        if(this.image === this.sprites.takeHit.image &&
            this.framesCurrent < this.sprites.takeHit.framesMax - 1){
                return;
            }

        switch (sprite) {
            case 'idle':
                if(this.image !== this.sprites.idle.image){
                    this.image = this.sprites.idle.image;
                    this.framesMax = this.sprites.idle.framesMax;
                    this.framesCurrent = 0; // To smoothly loop out from animation frame
                }    
                break;

            case 'run': 
                if(this.image !== this.sprites.run.image){
                    this.image = this.sprites.run.image;
                    this.framesMax = this.sprites.run.framesMax; 
                    this.framesCurrent = 0; // To smoothly loop out from animation frame
                }
                break;

            case 'jump':
                if(this.image !== this.sprites.jump.image){
                    this.image = this.sprites.jump.image;
                    this.framesMax = this.sprites.jump.framesMax; 
                    this.framesCurrent = 0; // To smoothly loop out from animation frame
                }
                break;
            
            case 'fall':
                if(this.image !== this.sprites.fall.image){
                    this.image = this.sprites.fall.image;
                    this.framesMax = this.sprites.fall.framesMax; 
                    this.framesCurrent = 0; // To smoothly loop out from animation frame
                }
                break;

            case 'attack1':
                if(this.image !== this.sprites.attack1.image){
                    this.image = this.sprites.attack1.image;
                    this.framesMax = this.sprites.attack1.framesMax; 
                    this.framesCurrent = 0; // To smoothly loop out from animation frame
                }
                break;

            case 'takeHit':
                    if(this.image !== this.sprites.takeHit.image){
                        this.image = this.sprites.takeHit.image;
                        this.framesMax = this.sprites.takeHit.framesMax; 
                        this.framesCurrent = 0; // To smoothly loop out from animation frame
                    }
                    break;

            case 'death':
                    if(this.image !== this.sprites.death.image){
                        this.image = this.sprites.death.image;
                        this.framesMax = this.sprites.death.framesMax; 
                        this.framesCurrent = 0; // To smoothly loop out from animation frame
                    }
                    break;
        }
    }
}

export { Sprite, Fighter };

