var seitenWechsel = function(id) {

	var element = document.querySelector('#' + id);
	if (element !== null) {
		element.className = 'active';
	}
	var others = [].slice.call(document.querySelectorAll('section'));
	for (var index = 0; index < others.length; index += 1) {
		if (others[index] !== element) {
			others[index].className = '';
		}
	}
};
