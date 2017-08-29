$(() => {

  const $gameArea = $('.game-area');
  const $button = $('button');
  const $activeArea = $('.active-area');
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
  const arrowsInActiveArea = [];
  let run = false;
  let runTimerId = null;
  let score = null;
  const keyCodes = {
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down'
  };

  $button.on('click', () => {
    if(run === false) {
      $('.arrow').remove();
      score = 0;
      health = 100;
      $healthBar.width(`${health/100 * $gameArea.width() * 0.6}px`);
      arrowProcess();
      runTimerId = setInterval(function() {
        arrowProcess();
      }, 1000 * 60/beatsPerMinute);
      run = true;
      setTimeout(function() {
        song.play();
      }, 4 * 1000 * 60 / beatsPerMinute + startDelay);
    } else {
      clearInterval(runTimerId);
      run = false;
      song.pause();
      song.currentTime = 0;
    }
    setTimeout(function() {
      clearInterval(runTimerId);
      run = false;
    }, lengthOfSong + startDelay);
    setTimeout(function() {
      song.pause();
      song.currentTime = 0;
    }, lengthOfSong + startDelay + endDelay);
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
      if(health <= 0) {
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
    arrowsInActiveArea.push({id: $arrow.data('id'), direction: $arrow.data('direction')});
    $arrow.addClass('active');
    console.log(arrowsInActiveArea);
  }

  function deActivate($arrow) {
    const index = arrowsInActiveArea.map((e) => {
      return e.id;
    }).indexOf($arrow.data('id'));
    arrowsInActiveArea.splice(index, 1);
    $arrow.removeClass('active');
  }

  $(window).on('keydown', (e) => {
    console.log('keypressed');
    const keyPressed = e.which;
    const $topArrow = $('.arrow').filter('.active');
    console.log($topArrow);
    if(arrowsInActiveArea.length > 0 && $topArrow.data('direction') === keyCodes[keyPressed]){
      score++;
      console.log(score);
      $topArrow.addClass('hit');
      deActivate($topArrow);
    }
  });
});
