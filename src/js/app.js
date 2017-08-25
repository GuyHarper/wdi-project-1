$(() => {

  const $gameArea = $('.game-area');
  const $button = $('button');

  $button.on('click', () => {
    createArrow();
  });

  function createArrow() {
    const $newArrow = $('<div class="arrow"></div>');
    $gameArea.append($newArrow);
    $newArrow.css({top: 360, left: 260});
  }

});
