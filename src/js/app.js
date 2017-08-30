$(() => {

  const $gameArea = $('.game-area');
  const $startButton = $('button.start');
  const $quitButton = $('button.quit');
  const $activeArea = $('.active-area');
  const $healthBarContainer = $('.health-bar-container');
  const $healthBar = $('.health-bar');
  const $messageArea = $('.message-area');
  let health = 100;
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
  let score = null;
  const keyCodes = {
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down'
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
    {type: [1,2,1,0,[1,3],0,1,0], bars: 4},
    {type: [[3,4],0,[3,4],0,3,1,4,0], bars: 4}
  ];

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
    $newArrow.data({id: arrowId, direction: direction});
    arrowsOnScreen.push(arrowId);
    $gameArea.append($newArrow);
    $newArrow.addClass(direction);
    const gameHeight = $gameArea.height();
    const arrowHeight = $newArrow.height();
    $newArrow.css({top: gameHeight-arrowHeight});
    return $newArrow;
  }

  $startButton.on('click', () => {
    setTimeout(function() {
      countSound.play();
      countDown();
    }, 240); // This corrects the delay in the countdown audio file
    setTimeout(function() {
      $startButton.addClass('hidden');
      $quitButton.removeClass('hidden');
      $quitButton.text('Quit & return to menu');
      $healthBarContainer.removeClass('hidden');
      score = 0;
      health = 100;
      $healthBar.width(`${health/100 * $gameArea.width() * 0.6}px`);
      runSong(songPattern);
      arrowMoveTimerId = setInterval(function() {
        moveArrows();
      }, 10);
      setTimeout(function() {
        arrowProcessTimerId = setInterval(function() {
          arrowProcess();
        }, 1000 * 60/beatsPerMinute / 2);
      }, 10);
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
    let count = 3;
    const runCountDownId = setInterval(function() {
      if(count > 0 ) {
        $messageArea.text(count);
        countSound.play();
      } else if(count === 0) {
        $messageArea.text('GO');
      } else {
        $messageArea.text('');
        clearInterval(runCountDownId);
      }
      count--;
    }, 1000 * 60/beatsPerMinute);
  }

  $quitButton.on('click', () => {
    $quitButton.addClass('hidden');
    $startButton.removeClass('hidden');
    $healthBarContainer.addClass('hidden');
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
    $messageArea.text('');
  });

  function loseGame() {
    clearInterval(runTimerId);
    clearInterval(arrowMoveTimerId);
    clearInterval(arrowProcessTimerId);
    run = false;
    song.pause();
    song.currentTime = 0;
    recordScratch.play();
    $messageArea.text('YOU LOSE');
    $quitButton.text('Play again');
  }

  function deleteArrow($arrow) {
    $arrow.remove();
  }

  // function moveArrow($arrow) {
  //   const $arrowY = $arrow.position();
  //   $arrow.css({top: $arrowY.top - ($gameArea.height() - ($activeArea.height() - $arrow.height()/2) - $arrow.height()) * 0.01 / (arrowRate * 60 / beatsPerMinute)});
  //   return $arrowY;
  // }

  function moveArrows() {
    $('.arrow').each((index, element) => {
      $(element).css({top: $(element).position().top - ($gameArea.height() - ($activeArea.height() - $(element).height()/2) - $(element).height()) * 0.01 / (arrowRate * 60 / beatsPerMinute)});
    });
  }

  function arrowProcess() {
    $('.arrow').each((index, element) => {
      if($activeArea.position().top <= $(element).position().top && ($(element).position().top + $(element).height()/2) <= ($activeArea.position().top + $activeArea.height()) && $(element).hasClass('active') === false && !$(element).hasClass('hit')) {
        activate($(element));
      }
      if($(element).hasClass('hit') === false && $(element).position().top <= - $(element).height()/2) {
        if ($(element).hasClass('active')) {
          arrowsOnScreen.splice(arrowsOnScreen.indexOf($(element).data('id')), 1);
          health -= 10;
          $healthBar.width(`${health/100 * $gameArea.width() * 0.6}px`);
          cowbell.currentTime = 0;
          cowbell.play();
          deActivate($(element));
        }
        if($(element).position().top <= - $(element).height()) {
          deleteArrow($(element));
        }
        if(health <= 0) {
          loseGame();
        }
      }
      if($(element).hasClass('hit') && $(element).position().top <= 0) {
        deleteArrow($(element));
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
    if($activeArrow.data('direction') === keyCodes[keyPressed]){
      // score++;
      $activeArrow.addClass('hit');
      deActivate($activeArrow);
    }
  });
});
