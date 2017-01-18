let seitenWechsel = function(id) {

	let element = document.querySelector('#' + id);
	if (element !== null) {
		element.className = 'active';
	}
	let others = [].slice.call(document.querySelectorAll('section'));
	for (let index = 0; index < others.length; index += 1) {
		if (others[index] !== element) {
			others[index].className = '';
		}
	}
};
