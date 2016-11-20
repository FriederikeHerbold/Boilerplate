var seitenWechsel = function(id) {

    var element = document.querySelector('#' + id);
    if (element !== null) {
        element.className = 'active';
    }
    var others = [].slice.call(document.querySelectorAll('section'));
    for (var i = 0; i < others.length; i++) {
        if (others[i] !== element) {
            others[i].className = '';
        }
    }
};
