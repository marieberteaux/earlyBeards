function getInfosFromAPI(url, param) {
    const req = new XMLHttpRequest();
    req.open('GET', url, false);
    req.send(null);
    if (req.status === 200) {
        // console.log("Réponse reçue: %s", req.responseText);
        if (param['name'] == 'infos_films') {
            organizeFilmsInSlider(req.responseText);
        } else if (param['name'] == 'get_image') {
            organizeImageInSlider(req.responseText, param['img']);
        }
    } else {
        console.log("Status de la réponse: %d (%s)", req.status, req.statusText);
    }
}

function organizeFilmsInSlider(data) {
    var list = JSON.parse(data);
	var slides_container = document.getElementById('slider-wrapper');
	var i = 0;
    for (idx in list['results']) {
        // console.log(list['results'][idx]);
        var container = document.createElement('div');
        container.classList.add('slide');
        slides_container.appendChild(container);
        
		var img = document.createElement('img');
		img.src = 'https://image.tmdb.org/t/p/w500/' + list['results'][idx]['backdrop_path'];
        container.appendChild(img);

		var titre = document.createElement('h4');
		titre.innerHTML = list['results'][idx]['title'];

        var p = document.createElement('p');
        container.appendChild(p);
        p.classList.add('caption'); //
		p.appendChild(titre);

		var ul = document.createElement('ul');
        ul.classList.add('stars');
		p.appendChild(ul);
		
		var span = document.createElement('span');
		p.appendChild(span);
		span.innerHTML = list['results'][idx]['overview'].substring(0, 150) + '...';

		organizeStars(Math.floor(list['results'][idx]['vote_average'] / 2), ul);
		i++;
	}
	organizeDots(i);
	document.getElementsByClassName('slide')[0].classList.add('visible_slide');
	document.getElementsByClassName('dot')[0].classList.add('focus_dot');
}

function organizeStars(vote, ul) {
	var i = 0;
	while (i < 5) {
		var li = document.createElement('li');
		ul.appendChild(li);
		var img = document.createElement('img');
		li.appendChild(img);
		if (i < vote) {
			img.src = 'img/star_black.svg';
		} else {
			img.src = 'img/star_white.svg';
		}
		i++;
	}
}

function changeSlide(prev_next) {
	var number = document.getElementsByClassName('focus_dot')[0].dataset.slide;
	var index = (prev_next == 'before') ? --number : ++number;
	getSelectedFilm(index);
}

function organizeDots(length) {
	var dots_nav = document.getElementById('slider-nav');
	for (var i = 0; i < length; i++) {
		var a = document.createElement('a');
		a.classList.add('dot');
		a.href = '#';
		a.dataset.slide = i;
		a.addEventListener('click', anonymous_getSelectedFilm(i), false);
		dots_nav.appendChild(a);
	}
}

function anonymous_getSelectedFilm(number) {
	return function() {
		getSelectedFilm(number);
	}
}

function removeAndAddClassName(number, classname, classname_to_add) {
	var elems = document.getElementsByClassName(classname);
	for (var i = 0; i < elems.length; i++) {
		if (i == number && !elems[i].classList.contains(classname_to_add)) {
			elems[i].classList.add(classname_to_add);
		} else {
			elems[i].classList.remove(classname_to_add);
		}
	}
}

function checkIfRightItem(number) {
	var dots = document.getElementsByClassName('dot');
	if (number < 0) {
		number = dots.length - 1;
	} else if (number >= dots.length) {
		number = 0;
	}
	return number;
}

function getSelectedFilm(number) {
	number = checkIfRightItem(number);
	removeAndAddClassName(number, 'dot', 'focus_dot');
	removeAndAddClassName(number, 'slide', 'visible_slide');
}
