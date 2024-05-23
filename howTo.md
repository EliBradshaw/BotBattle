## <center>How to play</center>


Each bot gets an action "Action period" every once in a while. In full speed mode this would be 15 actions per second, but in slow mode it would be just 1 action per second. The speed wont change how the game works or how the bot acts though, just slower.

<br><br>
An acion is where you can read the game state and then have your bot do one or more of these things, which I am calling "subactions":
- Move left or right.
- Jump if on floor
- Shoot pellet
- Close range bash
- Shield

Each of these I will explain more technically in a minute.

Note:
- An action does not necessarily mean one single action, it just means one **period of time** that your bot can make act in (make subactions).
<br><br>
## <center>Subactions</center>
### Move left or right
    Your bot goes in that direction. It ain't that complicated. This has no cooldown.
```js
this.doMove(-1); // Left
this.doMove(1); // Right
// Character will move right because it overrides previous command
```
### Jump
    Only works if your bot is on the floor. This has no cooldown.
```js
if (this.isOnFloor()) {
    this.jump();
}
```

### Shoot pellet
    Only works if your bot has not used Bash in this action. Every 6 actions your bot gains one pellet in ammo, if your bot has no ammo it will not shoot any pellets. Shooting pellets has no cooldown.

```js
this.shootPellet(Math.PI/2);
// Angle in radians
```

### Bash
    Only works if your bot has not used Shoot pellet in this action. This move has a 6 action cooldown.
```js
this.bash(Math.PI/2);
// Angle in radians

this.shootPellet(0);
// This overrides the bash.
```

### Shield
    Shield gives you invincibility for the rest of this action and the next. It has a 12 action cooldown.
```js
if (this.canShield())
    this.activateShield();
```
