$(() => {
  const $gameContainer = $('.game-container');
  const $gameAreaPlayer1 = $('.game-area.player-one');
  const $gameAreaPlayer2 = $('.game-area.player-two');
  const $startButtonOnePlayer = $('button.start.one-player');
  const $startButtonTwoPlayer = $('button.start.two-player');
  const $quitButton = $('button.quit');
  const $activeArea = $('.active-area');
  const $player1HealthBarContainer = $('.health-bar-container');
  const $player1HealthBar = $('.health-bar');
  const $player2HealthBarContainer = $('.health-bar-container.player-two');
  const $player2HealthBar = $('.health-bar.player-two');
  const $messageAreaPlayer1 = $('.message-area');
  const $messageAreaPlayer2 = $('.message-area.player-two');
  let player1Health = 100;
  let player2Health = 100;
  const song = document.querySelector('.song');
  const recordScratch = document.querySelector('.record-scratch');
  const cowbell = document.querySelector('.cowbell');
  const countSound = document.querySelector('.count-sound');
  const beatsPerMinute = 117;
  const lengthOfSong = 426000; // Length of active part of song in milliseconds (from first beat to last beat you want to be displayed)
  const endDelay = 7000; // Number of milliseconds to continue playing after last beat displayed
  const startDelay = 0; // Number of milliseconds until first beat in audio file
  const arrowRate = 4; // Number of beats that arrow is visible on screen until it gets to the middle of the active area
  let arrowId = 0;
  const arrowsOnScreen = [];
  let run = false;
  let runTimerId = null;
  let startSongTimerId = null;
  let arrowProcessTimerId = null;
  let stopCreatingArrowsAtEndTimerId = null;
  let stopSongAtEndTimerId = null;
  let arrowMoveTimerId = null;
  let player1Score = null;
  let player2Score = null;
  let twoPlayerMode = false;
  const keyCodes = {
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down'
  };
  const songPattern = [
    {type: [1,2,1,2,[1,3],2,1,0], bars: 4},
    {type: [[3,4],0,[3,4],0,3,1,4,0], bars: 4},
    {type: [1,0,0,0,2,0,0,0], bars: 2},
    {type: [3,0,0,0,4,0,0,0], bars: 2},
    {type: [3,0,4,0,3,0,4,0], bars: 2},
    {type: [3,0,1,0,3,0,1,0], bars: 2},
    {type: [1,0,2,0,3,0,4,0], bars: 4},
    {type: [3,0,1,0,4,0,1,0], bars: 4},
    {type: [1,0,[1,2],0,3,0,4,0], bars: 4},
    {type: [3,0,[3,4],0,3,0,1,0], bars: 4},
    {type: [1,2,1,0,[1,3],0,1,0], bars: 4},
    {type: [[3,4],0,[3,4],0,3,1,4,0], bars: 4}
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
      // runSong(songPattern);
      // arrowMoveTimerId = setInterval(function() {
      //   moveArrows();
      // }, 10);
      // setTimeout(function() {
      //   arrowProcessTimerId = setInterval(function() {
      //     arrowProcess();
      //   }, 1000 * 60/beatsPerMinute / 2);
      // }, 10);
      // run = true;
      // startSongTimerId = setTimeout(function() {
      //   song.play();
      // }, 4 * 1000 * 60 / beatsPerMinute + startDelay);
      // stopCreatingArrowsAtEndTimerId = setTimeout(function() {
      //   clearInterval(runTimerId);
      //   run = false;
      // }, lengthOfSong + startDelay);
      // stopSongAtEndTimerId = setTimeout(function() {
      //   song.pause();
      //   song.currentTime = 0;
      // }, lengthOfSong + startDelay + endDelay);
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
    const directions = ['left','up','right','down'];
    const direction = directions[type - 1];
    const $newArrow = $('<div class="arrow"></div>');
    arrowId++;
    $newArrow.data({id: arrowId});
    $newArrow.addClass(direction);
    arrowsOnScreen.push(arrowId);
    $gameAreaPlayer1.append($newArrow);
    $newArrow.addClass(direction);
    const gameHeight = $gameAreaPlayer1.height();
    const arrowHeight = $newArrow.height();
    $newArrow.css({top: gameHeight-arrowHeight});
    return $newArrow;
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
      player1Score = 0;
      player1Health = 100;
      $player1HealthBar.width(`${player1Health/100 * $gameAreaPlayer1.width() * 0.6}px`);
      runSong(songPattern);
      arrowMoveTimerId = setInterval(function() {
        moveArrows();
      }, 10);
      setTimeout(function() {
        arrowProcessTimerId = setInterval(function() {
          arrowProcess();
        }, 1000 * 60/beatsPerMinute / 2);
      }, 5);
      run = true;
      startSongTimerId = setTimeout(function() {
        song.play();
      }, 4 * 1000 * 60 / beatsPerMinute + startDelay);
      stopCreatingArrowsAtEndTimerId = setTimeout(function() {
        clearInterval(runTimerId);
        run = false;
      }, lengthOfSong + startDelay);
      stopSongAtEndTimerId = setTimeout(function() {
        song.pause();
        song.currentTime = 0;
      }, lengthOfSong + startDelay + endDelay);
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
    clearTimeout(stopCreatingArrowsAtEndTimerId);
    clearTimeout(stopSongAtEndTimerId);
    run = false;
    song.pause();
    song.currentTime = 0;
    recordScratch.play();
    $messageAreaPlayer1.text('');
  });

  function loseGame() {
    clearInterval(runTimerId);
    clearInterval(arrowMoveTimerId);
    clearInterval(arrowProcessTimerId);
    run = false;
    song.pause();
    song.currentTime = 0;
    recordScratch.play();
    $messageAreaPlayer1.text('YOU LOSE');
    $quitButton.text('Play again');
  }

  function deleteArrow($arrow) {
    $arrow.remove();
  }

  // function moveArrow($arrow) {
  //   const $arrowY = $arrow.position();
  //   $arrow.css({top: $arrowY.top - ($gameAreaPlayer1.height() - ($activeArea.height() - $arrow.height()/2) - $arrow.height()) * 0.01 / (arrowRate * 60 / beatsPerMinute)});
  //   return $arrowY;
  // }

  function moveArrows() {
    $('.arrow').each((index, element) => {
      $(element).css({top: $(element).position().top - ($gameAreaPlayer1.height() - ($activeArea.height() - $(element).height()/2) - $(element).height()) * 0.01 / (arrowRate * 60 / beatsPerMinute)});
    });
  }

  function arrowProcess() {
    $('.arrow').each((index, element) => {
      if($activeArea.position().top <= $(element).position().top && ($(element).position().top + $(element).height()/2) <= ($activeArea.position().top + $activeArea.height()) && $(element).hasClass('active') === false && !$(element).hasClass('hit')) {
        activate($(element));
      }
      if($(element).position().top <= - $(element).height()/4 && $(element).hasClass('active')) {
        deActivate($(element));
      }
      if($(element).position().top <= - $(element).height()/2) {
        arrowsOnScreen.splice(arrowsOnScreen.indexOf($(element).data('id')), 1);
        player1Health -= 10;
        $player1HealthBar.width(`${player1Health/100 * $gameAreaPlayer1.width() * 0.6}px`);
        setTimeout(function() {
          cowbell.currentTime = 0;
          cowbell.play();
        }, 100); // This corrects the delay in the cowbell audio file
        deleteArrow($(element));
        if(player1Health <= 0) {
          loseGame();
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
    const $activeArrow = $('.arrow').filter('.active');
    if($activeArrow.hasClass(keyCodes[keyPressed])) {
      // player1Score++;
      console.log($activeArrow.filter(`.${keyCodes[keyPressed]}`));
      deActivate($activeArrow.filter(`.${keyCodes[keyPressed]}`));
      deleteArrow($activeArrow.filter(`.${keyCodes[keyPressed]}`));
    }
  });
});
