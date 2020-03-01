let chucky = 
{_id: x,
  currentHp: x,
  maxHp: x,
  attack: x,
  speed: x,
  defense: x,
  moves: [{ name: 'name', power: 0, effects: whatever }],
  imgUrl: './images/animations/chucky/stand/chucky_1-1.png',
  animations: {
    base: './images/animations/chucky/stand/chucky_1-1.png',
    attack: {path: './images/animations/chucky/stab/chucky_8-', frames: 10},
    heavyAttack: {path: './images/animations/chucky/roundhouse-slash/chucky_12-', frames: 10},
    death: {path: './images/animations/chucky/death/chucky_5-', frames: 5},
    idle: { path: './images/animations/chucky/stand/chucky_1-', frames: 12 },
    filetype: '.png'
  }
};

let freddy = 
{_id: x,
  currentHp: x,
  maxHp: x,
  attack: x,
  speed: x,
  defense: x,
  moves: [{ name: 'name', power: 0, effects: whatever }],
  imgUrl: './images/animations/freddy/idle/freddy_0-0.png',
  animations: {
    base: './images/animations/chucky/stand/chucky_1-1.png',
    kick: {path: './images/animations/freddy/kick/freddy_210-', frames: 10},
    heavyKick: {path: './images/animations/freddy/roundhouse/freddy_240-', frames: 27},
    knee: {path: './images/animations/freddy/knee/freddy_220-', frames: 14},
    attack: {path: './images/animations/freddy/combo/freddy_200-', frames: 30},
    death: {path: './images/animations/freddy/death/freddy_255-', frames: 11},
    idle: { path: './images/animations/freddy/idle/freddy_0-', frames: 46 },
    filetype: '.png'
  }
};

let penny =
{
  _id: x,
  currentHp: x,
  maxHp: x,
  attack: x,
  speed: x,
  defense: x,
  moves: [{ name: 'name', power: 0, effects: whatever }],
  imgUrl: './images/animations/penny/stand/penny_0-0.png',
  animations: {
    base: './images/animations/penny/stand/penny_0-0.png',
    attack: { path: './images/animations/penny/punch/penny_100-', frames: 5 },
    heavyAttack: { path: './images/animations/penny/heavy-punch/penny_200-', frames: 4 },
    kick: { path: './images/animations/penny/kick/penny_200-', frames: 6 },
    death: { path: './images/animations/chucky/death/penny_440-', frames: 9 },
    idle: { path: './images/animations/penny/stand/penny_0-', frames: 7 },
    filetype: '.png'
  }
};

let jason =
{
  _id: x,
  currentHp: x,
  maxHp: x,
  attack: x,
  speed: x,
  defense: x,
  moves: [{ name: 'name', power: 0, effects: whatever }],
  imgUrl: './images/animations/jason/stand/jason_0-0.png',
  animations: {
    base: './images/animations/jason/stand/jason_0-0.png',
    attack: { path: './images/animations/jason/slash/jason_200-', frames: 13 },
    heavyAttack: { path: './images/animations/jason/heavy-slash/jason_610-', frames: 17 },
    punch: { path: './images/animations/jason/punch/jason_230-', frames: 7 },
    superHeavyAttack: { path: './images/animations/jason/chop/jason_210-', frames: 16 },
    range: { path: './images/animations/jason/bow/jason_1200-', frames: 13 },
    death: { path: './images/animations/jason/death/jason_5950-', frames: 16 },
    idle: { path: './images/animations/jason/stand/jason_0-', frames: 14 },
    filetype: '.png'
  }
};