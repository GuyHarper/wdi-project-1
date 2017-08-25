$(() => {

  const $gameArea = $('.game-area');
  const $button = $('button');

  $button.on('click', () => {
    arrowProcess();
  });

  function createArrow() {
    const $newArrow = $('<div class="arrow"></div>');
    $gameArea.append($newArrow);
    $newArrow.css({top: 360, left: 260});
    return $newArrow;
  }

  function arrowProcess() {
    const $newArrow = createArrow();
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
