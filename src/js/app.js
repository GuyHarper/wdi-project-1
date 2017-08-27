$(() => {

  const $gameArea = $('.game-area');
  const $button = $('button');
  const $activeArea = $('.active-area');
  const beatsPerMinute = 120;
  const arrowRate = 4; // Number of beats that arrow is visible on screen
  let arrowId = 0;
  const arrowsOnScreen = [];
  const arrowsInActiveArea = [];

  $button.on('click', () => {
    arrowProcess();
  });

  function createArrow(direction) {
    const $newArrow = $('<div class="arrow"></div>');
    arrowId++;
    $newArrow.data({id: arrowId, activated: false});
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
      console.log(arrowsInActiveArea);
      if($activeArea.position().top <= $newArrow.position().top && $newArrow.position().top <= ($activeArea.position().top + ($activeArea.height() - $newArrow.height())) && $newArrow.data('activated') === false) {
        activate($newArrow);
      }
      if($activeArea.position().top >= $newArrow.position().top && $newArrow.data('activated') === true) {
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
    arrowsInActiveArea.push($arrow.data('id'));
    $arrow.data('activated', true);
  }

  function deActivate($arrow) {
    arrowsInActiveArea.splice(arrowsInActiveArea.indexOf($arrow.data('id')), 1);
  }
});
