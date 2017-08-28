$(() => {

  const $gameArea = $('.game-area');
  const $button = $('button');
  const $activeArea = $('.active-area');
  const beatsPerMinute = 117;
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
      score = 0;
      runTimerId = setInterval(function() {
        arrowProcess();
      }, 1000 * 60/beatsPerMinute);
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
      if($activeArea.position().top <= $newArrow.position().top && $newArrow.position().top <= ($activeArea.position().top + $activeArea.height()) && $newArrow.data('active') === false) {
        activate($newArrow);
        console.log('active');
        console.log('arrowsInActiveArea[0]:',arrowsInActiveArea[0]);
      }
      if($activeArea.position().top >= $newArrow.position().top && $newArrow.data('active') === true) {
        deActivate($newArrow);
      }
      if($newArrow.position().top <= 0) {
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
    $arrow.css({top: $arrowY.top - ($gameArea.height() - ($activeArea.height() - $arrow.height()/2) - $arrow.height()) * 0.01 / (arrowRate * 60 / beatsPerMinute)});
    return $arrowY;
  }

  function activate($arrow) {
    arrowsInActiveArea.push({id: $arrow.data('id'), direction: $arrow.data('direction')});
    $arrow.data('active', true);
  }

  function deActivate($arrow) {
    const index = arrowsInActiveArea.map((e) => {
      return e.id;
    }).indexOf($arrow.data('id'));
    arrowsInActiveArea.splice(index, 1);
    $arrow.data('active', false);
  }

  $(window).on('keydown', (e) => {
    const keyPressed = e.which;
    if(arrowsInActiveArea.length > 0 && arrowsInActiveArea[0].direction === keyCodes[keyPressed]){
      console.log('matched');
      score++;
      console.log('arrowsInActiveArea[0] before keymatch:', arrowsInActiveArea[0]);
      arrowsInActiveArea.shift();
      console.log('arrowsInActiveArea[0] after keymatch:', arrowsInActiveArea[0]);
    }
  });
});
