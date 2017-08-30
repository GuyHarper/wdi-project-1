$(() => {
  const $gameContainer = $('.game-container');
  const $gameAreaPlayer1 = $('.game-area.player-one');
  const $gameAreaPlayer2 = $('.game-area.player-two');
  const $startButtonOnePlayer = $('button.start.one-player');
  const $startButtonTwoPlayer = $('button.start.two-player');
  const $quitButton = $('button.quit');
  const $activeArea = $('.active-area');
  const $player1HealthBarContainer = $('.health-bar-container.player-one');
  const $player1HealthBar = $('.health-bar.player-one');
  const $player2HealthBarContainer = $('.health-bar-container.player-two');
  const $player2HealthBar = $('.health-bar.player-two');
  const $messageAreaPlayer1 = $('.message-area.player-one');
  const $messageAreaPlayer2 = $('.message-area.player-two');
  let player1Health = 100;
  let player2Health = 100;
  const song = document.querySelector('.song');
  const recordScratch = document.querySelector('.record-scratch');
  const cowbell = document.querySelector('.cowbell');
  const countSound = document.querySelector('.count-sound');
  const beatsPerMinute = 117;
  const startDelay = 0; // Number of milliseconds until first beat in audio file
  const arrowRate = 4; // Number of beats that arrow is visible on screen until it gets to the middle of the active area
  let run = false;
  let runTimerId = null;
  let startSongTimerId = null;
  let arrowProcessTimerId = null;
  let arrowMoveTimerId = null;
  let player1Score = null;
  let player2Score = null;
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
  const songPattern = [
    {type: [1,0,0,0,2,0,0,0], bars: 2},
    {type: [3,0,0,0,4,0,0,0], bars: 2},
    {type: [3,0,4,0,3,0,4,0], bars: 2},
    {type: [3,0,1,0,3,0,1,0], bars: 2},
    {type: [1,0,2,0,3,0,4,0], bars: 4},
    {type: [3,0,1,0,4,0,1,0], bars: 4},
    {type: [1,0,[1,2],0,3,0,4,0], bars: 4},
    {type: [3,0,[3,4],0,3,0,1,0], bars: 4},
    {type: [[1,3],0,2,0,[1,3],0,2,0], bars: 2},
    {type: [[1,4],0,3,0,[2,3],0,3,0], bars: 2},
    {type: [1,2,1,0,[1,3],0,1,0], bars: 2},
    {type: [[1,3],0,[2,3],0,[4,3],0,[1,3],0], bars: 2}
  ];

  function twoPlayerSetup() {
    $gameAreaPlayer2.removeClass('hidden');
    twoPlayerMode = true;
  }

  $startButtonTwoPlayer.on('click',() => {
    if(!twoPlayerMode) {
      twoPlayerSetup();
    }
    setTimeout(function() {
      countSound.play();
      countDown();
    }, 240); // This corrects the delay in the countdown audio file
    setTimeout(function() {
      $startButtonOnePlayer.addClass('hidden');
      $startButtonTwoPlayer.addClass('hidden');
      $quitButton.removeClass('hidden');
      $quitButton.text('Quit & return to menu');
      $player1HealthBarContainer.removeClass('hidden');
      $player2HealthBarContainer.removeClass('hidden');
      player1Score = 0;
      player1Health = 100;
      player2Score = 0;
      player2Health = 100;
      $player1HealthBar.width(`${player1Health/100 * $gameAreaPlayer1.width() * 0.6}px`);
      $player2HealthBar.width(`${player2Health/100 * $gameAreaPlayer2.width() * 0.6}px`);
      runSong(songPattern);
      arrowMoveTimerId = setInterval(function() {
        moveArrows();
      }, 10);
      setTimeout(function() {
        arrowProcessTimerId = setInterval(function() {
          arrowProcess();
        }, 1000 * 60/beatsPerMinute / 2);
      }, 50);
      run = true;
      startSongTimerId = setTimeout(function() {
        song.play();
      }, 4 * 1000 * 60 / beatsPerMinute + startDelay);
    }, 100);
  });

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
    let currentBeat = 0;
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
      const directions = ['left','up','right','down'];
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
      const directions = ['left','up','right','down'];
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

  $startButtonOnePlayer.on('click', () => {
    if(twoPlayerMode) {
      twoPlayerMode = false;
    }
    setTimeout(function() {
      countSound.play();
      countDown();
    }, 240); // This corrects the delay in the countdown audio file
    setTimeout(function() {
      $startButtonOnePlayer.addClass('hidden');
      $startButtonTwoPlayer.addClass('hidden');
      $quitButton.removeClass('hidden');
      $quitButton.text('Quit & return to menu');
      $player1HealthBarContainer.removeClass('hidden');
      $player2HealthBarContainer.addClass('hidden');
      $gameAreaPlayer2.addClass('hidden');
      player1Score = 0;
      player1Health = 100;
      player2Health = 100;
      $player1HealthBar.width(`${player1Health/100 * $gameAreaPlayer1.width() * 0.6}px`);
      runSong(songPattern);
      arrowMoveTimerId = setInterval(function() {
        moveArrows();
      }, 10);
      setTimeout(function() {
        arrowProcessTimerId = setInterval(function() {
          arrowProcess();
        }, 1000 * 60/beatsPerMinute / 2);
      }, 50);
      run = true;
      startSongTimerId = setTimeout(function() {
        song.play();
      }, 4 * 1000 * 60 / beatsPerMinute + startDelay);
    }, 100);
  });

  function countDown() {
    let count = 4;
    $messageAreaPlayer1.text(count);
    $messageAreaPlayer2.text(count);
    count--;
    if(twoPlayerMode) {
      const runCountDownId = setInterval(function() {
        if(count > 0 ) {
          $messageAreaPlayer1.text(count);
          $messageAreaPlayer2.text(count);
          countSound.play();
        } else if(count === 0) {
          $messageAreaPlayer1.text('GO');
          $messageAreaPlayer2.text('GO');
        } else {
          $messageAreaPlayer1.text('');
          $messageAreaPlayer2.text('');
          clearInterval(runCountDownId);
        }
        count--;
      }, 1000 * 60/beatsPerMinute);
    } else {
      const runCountDownId = setInterval(function() {
        if(count > 0 ) {
          $messageAreaPlayer1.text(count);
          countSound.play();
        } else if(count === 0) {
          $messageAreaPlayer1.text('GO');
        } else {
          $messageAreaPlayer1.text('');
          clearInterval(runCountDownId);
        }
        count--;
      }, 1000 * 60/beatsPerMinute);
    }
  }

  $quitButton.on('click', () => {
    const $player2HealthBarContainer = $('.health-bar-container.player-two');
    $quitButton.addClass('hidden');
    $startButtonOnePlayer.removeClass('hidden');
    $startButtonTwoPlayer.removeClass('hidden');
    $player1HealthBarContainer.addClass('hidden');
    $player2HealthBarContainer.addClass('hidden');
    $('.arrow').remove();
    clearInterval(runTimerId);
    clearInterval(arrowMoveTimerId);
    clearInterval(arrowProcessTimerId);
    clearTimeout(startSongTimerId);
    run = false;
    song.pause();
    song.currentTime = 0;
    recordScratch.play();
    $messageAreaPlayer1.text('');
  });

  function loseGame(player) {
    clearInterval(runTimerId);
    clearInterval(arrowMoveTimerId);
    clearInterval(arrowProcessTimerId);
    run = false;
    song.pause();
    song.currentTime = 0;
    recordScratch.play();
    $quitButton.text('Play again');
    if(player === 'player1') {
      $messageAreaPlayer1.text('YOU LOSE');
    }
    if(player === 'player2') {
      $messageAreaPlayer2.text('YOU LOSE');
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
          $player1HealthBar.width(`${player1Health/100 * $gameAreaPlayer1.width() * 0.6}px`);
        } else {
          player2Health -= 10;
          $player2HealthBar.width(`${player2Health/100 * $gameAreaPlayer2.width() * 0.6}px`);
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
  }

  function deActivate($arrow) {
    $arrow.removeClass('active');
  }

  $(window).on('keydown', (e) => {
    const keyPressed = e.which;
    if(twoPlayerMode) {
      const $activeArrow1 = $('.arrow').filter('.player-one').filter('.active');
      const $activeArrow2 = $('.arrow').filter('.player-two').filter('.active');
      if($activeArrow1.hasClass(keyCodes2[keyPressed])) {
        // player1Score++;
        deActivate($activeArrow1.filter(`.${keyCodes2[keyPressed]}`));
        deleteArrow($activeArrow1.filter(`.${keyCodes2[keyPressed]}`));
      } else if($activeArrow2.hasClass(keyCodes1[keyPressed])) {
        // player2Score++;
        deActivate($activeArrow2.filter(`.${keyCodes1[keyPressed]}`));
        deleteArrow($activeArrow2.filter(`.${keyCodes1[keyPressed]}`));
      } else if (keyCodes2[keyPressed] !== -1){
        player1Health -= 2;
        $player1HealthBar.width(`${player1Health/100 * $gameAreaPlayer1.width() * 0.6}px`);
      } else if (keyCodes1[keyPressed] !== -1){
        player2Health -= 2;
        $player2HealthBar.width(`${player2Health/100 * $gameAreaPlayer2.width() * 0.6}px`);
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
        // player1Score++;
        deActivate($activeArrow.filter(`.${keyCodes1[keyPressed]}`));
        deleteArrow($activeArrow.filter(`.${keyCodes1[keyPressed]}`));
      } else if (keyCodes2[keyPressed] !== -1){
        player1Health -= 2;
        $player1HealthBar.width(`${player1Health/100 * $gameAreaPlayer1.width() * 0.6}px`);
      }
      if(player1Health <= 0) {
        loseGame('player1');
      }
    }
  });
});
