$(() => {

  const $gameArea = $('.game-area');
  const $button = $('button');
  let arrowId = 0;

  $button.on('click', () => {
    arrowProcess();
  });

  function createArrow(direction) {
    const $newArrow = $('<div class="arrow"></div>');
    arrowId++;
    $newArrow.data('id', arrowId);
    $gameArea.append($newArrow);
    $newArrow.addClass(direction);
    $newArrow.css({top: 360});
    return $newArrow;
  }

  function arrowProcess() {
    const directions = ['left','up','right','down'];
    const $newArrow = createArrow(directions[Math.floor(Math.random()*4)]);
    const timerId = setInterval(function() {
      moveArrow($newArrow);
      if($newArrow.position().top === 0) {
        deleteArrow($newArrow);
        clearInterval(timerId);
      }
    },15);
  }

  function deleteArrow($arrow) {
    $arrow.remove();
  }

  function moveArrow($arrow) {
    const $arrowY = $arrow.position();
    $arrow.css({top: $arrowY.top - 1});
    return $arrowY;
  }

});
