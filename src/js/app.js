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
  const beatsPerMinute = 116.8;
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

  $startButton.on('click', () => {
    $startButton.addClass('hidden');
    $quitButton.removeClass('hidden');
    $quitButton.text('Quit & return to menu');
    $healthBarContainer.removeClass('hidden');
    score = 0;
    health = 100;
    $healthBar.width(`${health/100 * $gameArea.width() * 0.6}px`);
    countDown();
    createArrow();
    runTimerId = setInterval(function() {
      createArrow();
    }, 1000 * 60/beatsPerMinute);
    arrowMoveTimerId = setInterval(function() {
      moveArrows();
    }, 10);
    setTimeout(function() {
      arrowProcessTimerId = setInterval(function() {
        arrowProcess();
      }, 1000 * 60/beatsPerMinute);
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
  });

  function countDown() {
    let count = 4;
    const runCountDownId = setInterval(function() {
      count--;
      if(count > 0 ) {
        $messageArea.text(count);
      } else if(count === 0) {
        $messageArea.text('GO');
      } else {
        $messageArea.text('');
        clearInterval(runCountDownId);
      }
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

  function createArrow() {
    const directions = ['left','up','right','down'];
    const direction = directions[Math.floor(Math.random()*4)];
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
    console.log('keypressed');
    const keyPressed = e.which;
    const $activeArrow = $('.arrow').filter('.active');
    console.log($activeArrow);
    if($activeArrow.data('direction') === keyCodes[keyPressed]){
      score++;
      console.log(score);
      $activeArrow.addClass('hit');
      deActivate($activeArrow);
    }
  });
});
