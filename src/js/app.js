$(() => {

  const $gameArea = $('.game-area');
  const $startButton = $('button.start');
  const $quitButton = $('button.quit');
  const $activeArea = $('.active-area');
  const $healthBarContainer = $('.health-bar-container');
  const $healthBar = $('.health-bar');
  let health = 100;
  const song = document.querySelector('.song');
  const recordScratch = document.querySelector('.record-scratch');
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
  let stopCreatingArrowsAtEndTimerId = null;
  let stopSongAtEndTimerId = null;
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
    $healthBarContainer.removeClass('hidden');
    score = 0;
    health = 100;
    $healthBar.width(`${health/100 * $gameArea.width() * 0.6}px`);
    arrowProcess();
    runTimerId = setInterval(function() {
      arrowProcess();
    }, 1000 * 60/beatsPerMinute);
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

  $quitButton.on('click', () => {
    $quitButton.addClass('hidden');
    $startButton.removeClass('hidden');
    $healthBarContainer.addClass('hidden');
    $('.arrow').remove();
    clearInterval(runTimerId);
    clearTimeout(startSongTimerId);
    clearTimeout(stopCreatingArrowsAtEndTimerId);
    clearTimeout(stopSongAtEndTimerId);
    run = false;
    song.pause();
    song.currentTime = 0;
    recordScratch.play();
  });

  function createArrow(direction) {
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

  function arrowProcess() {
    const directions = ['left','up','right','down'];
    const $newArrow = createArrow(directions[Math.floor(Math.random()*4)]);
    const timerId = setInterval(function() {
      if(health <= 0 || run === false) {
        clearInterval(timerId);
      } else {
        moveArrow($newArrow);
        if($activeArea.position().top <= $newArrow.position().top && ($newArrow.position().top + $newArrow.height()/2) <= ($activeArea.position().top + $activeArea.height()) && $newArrow.hasClass('active') === false && !$newArrow.hasClass('hit')) {
          activate($newArrow);
        }
        if($activeArea.position().top >= $newArrow.position().top && $newArrow.hasClass('active') === true) {
          deActivate($newArrow);
        }
        if($newArrow.hasClass('hit') === false && $newArrow.position().top <= 0) {
          arrowsOnScreen.splice(arrowsOnScreen.indexOf($newArrow.data('id')), 1);
          health -= 10;
          $healthBar.width(`${health/100 * $gameArea.width() * 0.6}px`);
          deleteArrow($newArrow);
          clearInterval(timerId);
          if(health <= 0) {
            loseGame();
          }
        }
        if($newArrow.hasClass('hit') && $newArrow.position().top <= 0) {
          deleteArrow($newArrow);
          clearInterval(timerId);
        }
      }
    },10);
  }

  function loseGame() {
    clearInterval(runTimerId);
    run = false;
    song.pause();
    song.currentTime = 0;
    recordScratch.play();
    console.log('YOU LOSE');
  }

  function deleteArrow($arrow) {
    $arrow.remove();
  }

  function moveArrow($arrow) {
    const $arrowY = $arrow.position();
    $arrow.css({top: $arrowY.top - ($gameArea.height() - ($activeArea.height() - $arrow.height()/2) - $arrow.height()) * 0.01 / (arrowRate * 60 / beatsPerMinute)});
    return $arrowY;
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
