var Enemies = function(max, maxGear) {
    this.maxGear = maxGear || 8;
    this.maxEnemies = max;

    this.enemies = [];
}

Enemies.prototype.spawn = function() {
    if (this.getNumEnemies() < this.maxEnemies) {
        var lane = getRandomInt(1, 5);
        var gear = getRandomInt(3, this.maxGear);
        var speed = 6;

        var enemy = this.addEnemy(lane, gear, speed, -100);

        var rand = getRandomInt(1, 100);
        if (rand > 35) {
            this.addEnemy(lane, gear, speed, enemy.y - 60);
        }

        if (rand > 65) {
            this.addEnemy(lane, gear, speed, enemy.y - 120);
        }
    }
}

Enemies.prototype.addEnemy = function(lane, gear, speed, y) {
    var lastYForLane = this.getLastYForLane(lane);

    if (y > lastYForLane - 60) {
        y = lastYForLane + y;
    }

    var enemy = new Enemy(lane, gear, speed, y);
    this.enemies[this.enemies.length] = enemy;

    return enemy;
}

Enemies.prototype.getLastYForLane = function(lane) {
    var self = this;
    var lastY = 0;

    self.enemies.forEach(function(enemy, index) {
        if (enemy.lane == lane && enemy.y < lastY) {
            lastY = enemy.y;
        }
    });

    return lastY;
}


Enemies.prototype.getNumEnemies = function() {
    return this.enemies.length;
}

Enemies.prototype.move = function() {
    var self = this;

    var realIndex = 0;
    self.enemies.forEach(function(enemy, index) {
        enemy.move();

        if (enemy.y > CANVAS_HEIGHT + 100) {
            self.enemies.splice(realIndex, 1);
            realIndex --;
        }

        realIndex ++;
    });
}

Enemies.prototype.checkForCollision = function(player) {
    var self = this;

    var realIndex = 0;
    var isDead = false;
    self.enemies.forEach(function(enemy, index) {
        if (enemy.lane == player.lane) {
            var offset = 4;
            if (enemy.y+48-offset > player.y && player.y + 48-offset > enemy.y) {
                if (enemy.gear == player.gear) {
                    self.enemies.splice(realIndex, 1);
                    realIndex --;
                } else {
                    isDead = true;
                }
            }
        }

        realIndex ++;
    });

    return isDead;
}

Enemies.prototype.draw = function(context, frame) {
    this.enemies.forEach(function(enemy) {
        enemy.draw(context, frame);
    });
}

function getRandomInt(min, max) {
    max += 1;
    return Math.floor(Math.random() * (max - min)) + min;
}