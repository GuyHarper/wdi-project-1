$(() => {

  const $gameArea = $('.game-area');
  const $button = $('button');
  const $activeArea = $('.active-area');
  const beatsPerMinute = 120;
  const arrowRate = 4; // Number of beats that arrow is visible on screen
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
      score = 0;
      runTimerId = setInterval(function() {
        arrowProcess();
      }, 1000 * 120/beatsPerMinute);
      run = true;
    } else {
      clearInterval(runTimerId);
      run = false;
    }
  });

  function createArrow(direction) {
    const $newArrow = $('<div class="arrow"></div>');
    arrowId++;
    $newArrow.data({id: arrowId, active: false, direction: direction});
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
      moveArrow($newArrow);
      if($activeArea.position().top <= $newArrow.position().top && $newArrow.position().top <= ($activeArea.position().top + ($activeArea.height() - $newArrow.height())) && $newArrow.data('active') === false) {
        activate($newArrow);
      }
      if($activeArea.position().top >= $newArrow.position().top && $newArrow.data('active') === true) {
        deActivate($newArrow);
      }
      if($newArrow.position().top < 1) {
        arrowsOnScreen.splice(arrowsOnScreen.indexOf($newArrow.data('id')), 1);
        deleteArrow($newArrow);
        clearInterval(timerId);
      }
    },10);
  }

  function deleteArrow($arrow) {
    $arrow.remove();
  }

  function moveArrow($arrow) {
    const $arrowY = $arrow.position();
    $arrow.css({top: $arrowY.top - ($gameArea.height() - $arrow.height()) * 0.01 / (arrowRate * 60 / beatsPerMinute)});
    return $arrowY;
  }

  function activate($arrow) {
    arrowsInActiveArea.push({id: $arrow.data('id'), direction: $arrow.data('direction')});
    $arrow.data('active', true);
  }

  function deActivate($arrow) {
    arrowsInActiveArea.splice(arrowsInActiveArea.indexOf({id: $arrow.data('id'), direction: $arrow.data('direction')}), 1);
    $arrow.data('active', false);
  }

  $(window).on('keydown', (e) => {
    const keyPressed = e.which;
    if(arrowsInActiveArea.length > 0 && arrowsInActiveArea[0].direction === keyCodes[keyPressed]){
      score++;
      console.log(score);
    }
  });
});
