$(() => {
  const $gameAreaPlayer1 = $('.game-area.player-one');
  const $gameAreaPlayer2 = $('.game-area.player-two');
  const $titleAndButtonsOnePlayer = $('.title-and-buttons-container.one-player');
  const $startButtonOnePlayer = $('button.start.one-player');
  const $startButtonTwoPlayer = $('button.start.two-player');
  const $quitButton = $('button.quit');
  const $activeArea = $('.active-area');
  const $player1HealthBarContainer = $('.health-bar-container.player-one');
  const $player1HealthBar = $('.health-bar.player-one');
  const $player2HealthBarContainer = $('.health-bar-container.player-two');
  const $player2HealthBar = $('.health-bar.player-two');
  const $player1InputArrows = $('.input-arrow-container.player-one');
  const $player1InputArrowLeft = $('.input-arrow.left.player-one');
  const $player1InputArrowUp = $('.input-arrow.up.player-one');
  const $player1InputArrowDown = $('.input-arrow.down.player-one');
  const $player1InputArrowRight = $('.input-arrow.right.player-one');
  const $player2InputArrows = $('.input-arrow-container.player-two');
  const $player2InputArrowLeft = $('.input-arrow.left.player-two');
  const $player2InputArrowUp = $('.input-arrow.up.player-two');
  const $player2InputArrowDown = $('.input-arrow.down.player-two');
  const $player2InputArrowRight = $('.input-arrow.right.player-two');
  const $messageAreaPlayer1 = $('.message-area.player-one');
  const $messageAreaPlayer2 = $('.message-area.player-two');
  const song = document.querySelector('.song');
  const recordScratch = document.querySelector('.record-scratch');
  const cowbell = document.querySelector('.cowbell');
  const countSound = document.querySelector('.count-sound');
  let run = false;
  let runTimerId = null;
  let startArrowsTimerId = null;
  let arrowProcessStartTimerId = null;
  let arrowProcessTimerId = null;
  let arrowMoveTimerId = null;
  let runCountDownId = null;
  let currentBeat = 0;
  let numberOfPossibleArrows = 0;
  let player1Health = 100;
  let player2Health = 100;
  let player1Score = 0;
  let player2Score = 0;
  let player1Perfects = 0;
  let player2Perfects = 0;
  let twoPlayerMode = false;
  const keyCodes1 = {
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down'
  };
  const keyCodes2 = {
    65: 'left',
    87: 'up',
    68: 'right',
    83: 'down'
  };
  const onePlayerKeyHighlights = {
    37: $player1InputArrowLeft,
    38: $player1InputArrowUp,
    39: $player1InputArrowRight,
    40: $player1InputArrowDown
  };
  const twoPlayerKeyHighlights = {
    37: $player2InputArrowLeft,
    38: $player2InputArrowUp,
    39: $player2InputArrowRight,
    40: $player2InputArrowDown,
    65: $player1InputArrowLeft,
    87: $player1InputArrowUp,
    68: $player1InputArrowRight,
    83: $player1InputArrowDown
  };
  const beatsPerMinute = 122.9505;
  const beatsInSong = 512;
  const startDelay = 2750; // Number of milliseconds until first beat in audio file
  const arrowRate = 4; // Number of beats that arrow is visible on screen until it gets to the middle of the active area
  const songPattern = [
    {type: [4,0,0,0,0,0,0,0], bars: 1},
    {type: [3,0,0,0,0,0,0,0], bars: 1},
    {type: [2,0,0,0,0,0,0,0], bars: 1},
    {type: [1,0,0,0,0,0,0,0], bars: 1},
    {type: [4,0,0,0,0,0,0,0], bars: 1},
    {type: [3,0,0,0,0,0,0,0], bars: 1},
    {type: [2,0,0,0,0,0,0,0], bars: 1},
    {type: [[1,4],0,0,0,0,0,0,0], bars: 1},
    {type: [1,0,2,0,4,0,4,0], bars: 2},
    {type: [3,0,3,0,2,0,1,0], bars: 2},
    {type: [1,0,2,0,4,0,4,0], bars: 2},
    {type: [3,0,3,0,2,0,1,0], bars: 2},
    {type: [1,0,2,0,3,0,4,0], bars: 4},
    {type: [3,0,1,0,4,0,1,0], bars: 2},
    {type: [[1,4],0,3,0,[1,4],0,3,0], bars: 1},
    {type: [0,0,0,0,0,0,0,0], bars: 1},
    {type: [0,0,4,4,4,3,3,1], bars: 1},
    {type: [1,0,0,0,0,0,0,0], bars: 1},
    {type: [0,0,4,4,4,3,3,1], bars: 1},
    {type: [1,0,0,0,0,0,0,0], bars: 1},
    {type: [0,0,[4,3],[4,3],[4,3],3,3,1], bars: 1},
    {type: [1,0,0,0,0,0,0,0], bars: 1},
    {type: [0,0,[4,3],[4,3],[4,3],[3,1],[3,1],1], bars: 1},
    {type: [1,0,0,0,0,0,0,0], bars: 1},
    {type: [0,0,[4,3],[4,3],[4,3],[3,1],[3,1],[1,4]], bars: 1},
    {type: [[1,4],0,0,0,0,0,0,0], bars: 1},
    {type: [0,0,4,4,4,3,3,1], bars: 1},
    {type: [1,4,3,1,1,4,1,0], bars: 1},
    {type: [[4,1],1,[3,1],1,[2,1],1,[4,1],[4,1]], bars: 2},
    {type: [[4,3],3,[4,3],3,[2,3],3,[2,3],1], bars: 2},
    {type: [0,0,0,0,4,3,1,0], bars: 3},
    {type: [[1,3],4,[1,3],2,[1,3],4,[1,4],0], bars: 1},
    {type: [0,0,0,0,4,3,1,0], bars: 3},
    {type: [[1,3],4,[1,3],2,[1,3],4,[1,4],0], bars: 1},
    {type: [0,0,0,0,[4,1],[3,1],[2,1],0], bars: 3},
    {type: [[1,3],4,[1,3],2,[1,3],4,[1,4],0], bars: 1},
    {type: [0,0,0,0,[4,1],[3,1],[2,1],0], bars: 3},
    {type: [[1,3],4,[1,3],2,[1,3],4,[1,4],0], bars: 1},
    {type: [4,0,4,4,0,0,4,4], bars: 1},
    {type: [3,0,3,3,0,0,3,3], bars: 1},
    {type: [2,0,2,2,0,0,2,2], bars: 1},
    {type: [[4,1],0,[4,1],[4,1],0,0,[4,1],[4,1]], bars: 1},
    {type: [[4,3],0,[4,2],[4,1],0,0,4,4], bars: 1},
    {type: [[3,2],0,[3,1],[3,4],0,0,3,3], bars: 1},
    {type: [[2,1],0,[2,3],[2,4],0,0,2,2], bars: 1},
    {type: [[4,1],0,[4,1],[4,1],0,0,[4,1],[4,1]], bars: 1},
    {type: [4,0,4,4,0,0,4,4], bars: 1},
    {type: [3,0,3,3,0,0,3,3], bars: 1},
    {type: [2,0,2,2,0,0,2,2], bars: 1},
    {type: [[4,1],0,[4,1],[4,1],0,0,[4,1],[4,1]], bars: 1},
    {type: [4,0,4,4,0,0,4,4], bars: 1},
    {type: [3,0,3,3,0,0,3,3], bars: 1},
    {type: [2,0,2,2,0,0,2,2], bars: 1},
    {type: [[1,3],4,[1,3],2,[1,3],4,[1,4],0], bars: 1},
    {type: [[4,3],1,[4,3],1,3,1,2,1], bars: 4}
  ];

  $startButtonOnePlayer.on('click', () => {
    setTimeout(function() {
      twoPlayerMode = false;
      preSetup();
      setTimeout(function() {
        countSound.play();
        countDown();
      }, 240 + startDelay - 4 * 1000 * 60 / beatsPerMinute); // The 240ms corrects the delay in the countdown audio file
      setTimeout(function() {
        setup();
        startArrowsTimerId = setTimeout(function() {
          runSong(songPattern);
        }, startDelay - 4 * 1000 * 60 / beatsPerMinute);
        arrowMoveTimerId = setInterval(function() {
          moveArrows();
        }, 10);
        arrowProcessStartTimerId = setTimeout(function() {
          arrowProcessTimerId = setInterval(function() {
            arrowProcess();
          }, 1000 * 60/beatsPerMinute / 2);
        }, startDelay - 4 * 1000 * 60 / beatsPerMinute + 50);
        song.play();
      }, 100);
    }, 100);
  });

  $startButtonTwoPlayer.on('click',() => {
    setTimeout(function() {
      twoPlayerMode = true;
      preSetup();
      setTimeout(function() {
        countSound.play();
        countDown();
      }, 240 + startDelay - 4 * 1000 * 60 / beatsPerMinute); // This corrects the delay in the countdown audio file
      setTimeout(function() {
        setup();
        startArrowsTimerId = setTimeout(function() {
          runSong(songPattern);
        }, startDelay - 4 * 1000 * 60 / beatsPerMinute);
        arrowMoveTimerId = setInterval(function() {
          moveArrows();
        }, 10);
        arrowProcessStartTimerId = setTimeout(function() {
          arrowProcessTimerId = setInterval(function() {
            arrowProcess();
          }, 1000 * 60/beatsPerMinute / 2);
        }, startDelay - 4 * 1000 * 60 / beatsPerMinute + 50);
        song.play();
      }, 100);
    }, 100);
  });

  $quitButton.on('click', () => {
    setTimeout(function() {
      run = false;
      $quitButton.addClass('hidden');
      $gameAreaPlayer2.addClass('hidden');
      $player1InputArrows.addClass('hidden');
      $player2InputArrows.addClass('hidden');
      $player1HealthBarContainer.addClass('hidden');
      $player2HealthBarContainer.addClass('hidden');
      $messageAreaPlayer1.addClass('hidden');
      $messageAreaPlayer2.addClass('hidden');
      $titleAndButtonsOnePlayer.removeClass('hidden');
      $('.arrow').remove();
      clearInterval(runTimerId);
      clearInterval(arrowMoveTimerId);
      clearInterval(arrowProcessTimerId);
      clearInterval(runCountDownId);
      clearTimeout(startArrowsTimerId);
      clearTimeout(arrowProcessStartTimerId);
      song.pause();
      song.currentTime = 0;
      numberOfPossibleArrows = 0;
      player1Score = 0;
      player2Score = 0;
      player1Perfects = 0;
      player2Perfects = 0;
      currentBeat = 0;
      recordScratch.play();
      $messageAreaPlayer1.text('');
      run = false;
    }, 100);
  });

  $(window).on('keydown', (e) => {
    if(run) {
      const keyPressed = e.which;
      highlight(keyPressed,'pressed');
      if(twoPlayerMode) {
        const $activeArrow1 = $('.arrow').filter('.player-one').filter('.active');
        const $activeArrow2 = $('.arrow').filter('.player-two').filter('.active');
        if($activeArrow1.hasClass(keyCodes2[keyPressed])) {
          player1Score++;
          $messageAreaPlayer1.text('');
          if($activeArrow1.position().top >= $activeArea.height()/2 - $activeArrow1.height()/2 - 4 && $activeArrow1.position().top <= $activeArea.height()/2 - $activeArrow1.height()/2 + 4) {
            $messageAreaPlayer1.text('Perfect');
            player1Perfects++;
            if(player1Health < 100) {
              player1Health += 2;
              $player1HealthBar.width(`${player1Health/100 * $gameAreaPlayer1.width() * 0.7}px`);
            }
          }
          deActivate($activeArrow1.filter(`.${keyCodes2[keyPressed]}`));
          deleteArrow($activeArrow1.filter(`.${keyCodes2[keyPressed]}`));
        } else if($activeArrow2.hasClass(keyCodes1[keyPressed])) {
          player2Score++;
          $messageAreaPlayer2.text('');
          if($activeArrow2.position().top >= $activeArea.height()/2 - $activeArrow2.height()/2 - 4 && $activeArrow2.position().top <= $activeArea.height()/2 - $activeArrow2.height()/2 + 4) {
            $messageAreaPlayer2.text('Perfect');
            player2Perfects++;
            if(player2Health < 100) {
              player2Health += 2;
              $player2HealthBar.width(`${player2Health/100 * $gameAreaPlayer2.width() * 0.7}px`);
            }
          }
          deActivate($activeArrow2.filter(`.${keyCodes1[keyPressed]}`));
          deleteArrow($activeArrow2.filter(`.${keyCodes1[keyPressed]}`));
        } else if (keyCodes2[keyPressed] !== -1){
          player1Health -= 2;
          $player1HealthBar.width(`${player1Health/100 * $gameAreaPlayer1.width() * 0.7}px`);
        } else if (keyCodes1[keyPressed] !== -1){
          player2Health -= 2;
          $player2HealthBar.width(`${player2Health/100 * $gameAreaPlayer2.width() * 0.7}px`);
        }
        if(player1Health <= 0) {
          loseGame('player1');
        }
        if (player2Health <= 0) {
          loseGame('player2');
        }
      } else {
        const $activeArrow = $('.arrow').filter('.active');
        if($activeArrow.hasClass(keyCodes1[keyPressed])) {
          player1Score++;
          $messageAreaPlayer1.text('');
          if($activeArrow.position().top >= $activeArea.height()/2 - $activeArrow.height()/2 - 4 && $activeArrow.position().top <= $activeArea.height()/2 - $activeArrow.height()/2 + 4) {
            $messageAreaPlayer1.text('Perfect');
            player1Perfects++;
            if(player1Health < 100) {
              player1Health += 2;
              $player1HealthBar.width(`${player1Health/100 * $gameAreaPlayer1.width() * 0.7}px`);
            }
          }
          deActivate($activeArrow.filter(`.${keyCodes1[keyPressed]}`));
          deleteArrow($activeArrow.filter(`.${keyCodes1[keyPressed]}`));
        } else if (keyCodes2[keyPressed] !== -1){
          player1Health -= 2;
          $player1HealthBar.width(`${player1Health/100 * $gameAreaPlayer1.width() * 0.7}px`);
        }
        if(player1Health <= 0) {
          loseGame('player1');
        }
      }
    }
  });

  function preSetup() {
    $messageAreaPlayer1.text('');
    $titleAndButtonsOnePlayer.addClass('hidden');
    $player1InputArrows.removeClass('hidden');
    if(twoPlayerMode) {
      $messageAreaPlayer2.text('');
      $player2InputArrows.removeClass('hidden');
      $gameAreaPlayer2.removeClass('hidden');
    }
  }

  function setup() {
    run = true;
    $quitButton.removeClass('hidden');
    $quitButton.text('Quit');
    player1Score = 0;
    player2Score = 0;
    player1Health = 100;
    player2Health = 100;
    $player1HealthBar.width(`${player1Health/100 * $gameAreaPlayer1.width() * 0.7}px`);
    $player2HealthBar.width(`${player2Health/100 * $gameAreaPlayer2.width() * 0.7}px`);
    $messageAreaPlayer1.removeClass('hidden');
    $player1HealthBarContainer.removeClass('hidden');
    if(!twoPlayerMode) {
      $player2HealthBarContainer.addClass('hidden');
      $gameAreaPlayer2.addClass('hidden');
    } else {
      $player2HealthBarContainer.removeClass('hidden');
      $messageAreaPlayer2.removeClass('hidden');
      $player1InputArrowLeft.text('A');
      $player1InputArrowUp.text('W');
      $player1InputArrowDown.text('S');
      $player1InputArrowRight.text('D');
    }
  }

  function runSong(pattern) {
    const wholeSongPattern = [];
    pattern.forEach((e) => {
      const numberBars = e.bars;
      const barPattern = e.type;
      for(let i = numberBars; i > 0; i--) {
        barPattern.forEach((e2) => {
          wholeSongPattern.push(e2);
        });
      }
    });
    if(wholeSongPattern[currentBeat] > 0) {
      createArrow(wholeSongPattern[currentBeat]);
    } else if (wholeSongPattern[currentBeat].length === 2) {
      createArrow(wholeSongPattern[currentBeat][0]);
      createArrow(wholeSongPattern[currentBeat][1]);
    }
    currentBeat++;
    runTimerId = setInterval(function() {
      if(wholeSongPattern[currentBeat] > 0) {
        createArrow(wholeSongPattern[currentBeat]);
      } else if (wholeSongPattern[currentBeat].length === 2) {
        createArrow(wholeSongPattern[currentBeat][0]);
        createArrow(wholeSongPattern[currentBeat][1]);
      }
      currentBeat++;
    }, 1000 * 60/beatsPerMinute / 2);
  }

  function createArrow(type) {
    if(twoPlayerMode) {
      const directions = ['left','up','down','right'];
      const direction = directions[type - 1];
      const $newArrow1 = $('<div class="arrow player-one"></div>');
      const $newArrow2 = $('<div class="arrow player-two"></div>');
      $newArrow1.addClass(direction);
      $newArrow2.addClass(direction);
      $gameAreaPlayer1.append($newArrow1);
      $gameAreaPlayer2.append($newArrow2);
      const gameHeight = $gameAreaPlayer1.height();
      const arrowHeight = $newArrow1.height();
      $newArrow1.css({top: gameHeight-arrowHeight});
      $newArrow2.css({top: gameHeight-arrowHeight});
    } else {
      const directions = ['left','up','down','right'];
      const direction = directions[type - 1];
      const $newArrow = $('<div class="arrow player-one"></div>');
      $newArrow.addClass(direction);
      $gameAreaPlayer1.append($newArrow);
      $newArrow.addClass(direction);
      const gameHeight = $gameAreaPlayer1.height();
      const arrowHeight = $newArrow.height();
      $newArrow.css({top: gameHeight-arrowHeight});
    }
  }

  function countDown() {
    let count = 4;
    if(twoPlayerMode) {
      $messageAreaPlayer1.text('Get');
      $messageAreaPlayer2.text('Get');
      count--;
      runCountDownId = setInterval(function() {
        switch(count) {
          case 3:
            $messageAreaPlayer1.text('your fingers');
            $messageAreaPlayer2.text('your fingers');
            countSound.play();
            break;
          case 2:
            $messageAreaPlayer1.text('ready to');
            $messageAreaPlayer2.text('ready to');
            countSound.play();
            break;
          case 1:
            $messageAreaPlayer1.text('DANCE');
            $messageAreaPlayer2.text('DANCE');
            countSound.play();
            break;
          default:
            $messageAreaPlayer1.text('');
            $messageAreaPlayer2.text('');
            $player1InputArrowLeft.text('');
            $player1InputArrowUp.text('');
            $player1InputArrowDown.text('');
            $player1InputArrowRight.text('');
            clearInterval(runCountDownId);
        }
        count--;
      }, 1000 * 60/beatsPerMinute);
    } else {
      $messageAreaPlayer1.text('Get');
      count--;
      runCountDownId = setInterval(function() {
        switch(count) {
          case 3:
            $messageAreaPlayer1.text('your fingers');
            countSound.play();
            break;
          case 2:
            $messageAreaPlayer1.text('ready to');
            countSound.play();
            break;
          case 1:
            $messageAreaPlayer1.text('DANCE');
            countSound.play();
            break;
          default:
            $messageAreaPlayer1.text('');
            clearInterval(runCountDownId);
        }
        count--;
      }, 1000 * 60/beatsPerMinute);
    }
  }

  function loseGame(player) {
    clearInterval(runTimerId);
    clearInterval(arrowMoveTimerId);
    clearInterval(arrowProcessTimerId);
    run = false;
    song.pause();
    song.currentTime = 0;
    recordScratch.play();
    $quitButton.text('Play again');
    const percentage = currentBeat / beatsInSong / 2 * 100;
    run = false;
    if(player === 'player1') {
      $messageAreaPlayer1.html(`YOU LOSE<br><br>You made it ${Math.floor(percentage)}% of the way through the song, hitting ${player1Score} arrows with ${player1Perfects} perfects out of a possible ${Math.round(numberOfPossibleArrows)}.`);
      $messageAreaPlayer2.html(`YOU WIN<br><br>WELL DONE<br><br>You hit ${player2Score} arrows with ${player2Perfects} perfects out of a possible ${Math.round(numberOfPossibleArrows)}.`);
    }
    if(player === 'player2') {
      $messageAreaPlayer2.html(`YOU LOSE<br><br>You made it ${Math.floor(percentage)}% of the way through the song, hitting ${player2Score} arrows with ${player2Perfects} perfects out of a possible ${Math.round(numberOfPossibleArrows)} .`);
      $messageAreaPlayer1.html(`YOU WIN<br><br>WELL DONE<br><br>You hit ${player1Score} arrows with ${player1Perfects} perfects out of a possible ${Math.round(numberOfPossibleArrows)}.`);
    }
  }

  function deleteArrow($arrow) {
    $arrow.remove();
  }

  function moveArrows() {
    $('.arrow').each((index, element) => {
      $(element).css({top: $(element).position().top - ($gameAreaPlayer1.height() - ($activeArea.height() - $(element).height()/2) - $(element).height()) * 0.01 / (arrowRate * 60 / beatsPerMinute)});
    });
  }

  function arrowProcess() {
    $('.arrow').each((index, element) => {
      if($activeArea.position().top <= $(element).position().top && ($(element).position().top + $(element).height()/2) <= ($activeArea.position().top + $activeArea.height()) && $(element).hasClass('active') === false) {
        activate($(element));
      }
      if($(element).position().top <= - $(element).height()/4 && $(element).hasClass('active')) {
        deActivate($(element));
      }
      if($(element).position().top <= - $(element).height()/2) {
        if($(element).hasClass('player-one')) {
          player1Health -= 10;
          $player1HealthBar.width(`${player1Health/100 * $gameAreaPlayer1.width() * 0.7}px`);
        } else {
          player2Health -= 10;
          $player2HealthBar.width(`${player2Health/100 * $gameAreaPlayer2.width() * 0.7}px`);
        }
        deleteArrow($(element));
        setTimeout(function() {
          cowbell.currentTime = 0;
          cowbell.play();
        }, 100); // This corrects the delay in the cowbell audio file
        if(player1Health <= 0) {
          loseGame('player1');
        }
        if (player2Health <= 0) {
          loseGame('player2');
        }
      }
    });
  }

  function activate($arrow) {
    $arrow.addClass('active');
    if(twoPlayerMode) {
      numberOfPossibleArrows += 0.5;
    } else {
      numberOfPossibleArrows++;
    }
  }

  function deActivate($arrow) {
    $arrow.removeClass('active');
  }

  function highlight(key, type) {
    if(!twoPlayerMode) {
      $(onePlayerKeyHighlights[key]).addClass(`${type}`);
      setTimeout(function() {
        $(onePlayerKeyHighlights[key]).removeClass(`${type}`);
      },100);
    } else {
      $(twoPlayerKeyHighlights[key]).addClass(`${type}`);
      setTimeout(function() {
        $(twoPlayerKeyHighlights[key]).removeClass(`${type}`);
      },100);
    }
  }
});
