// Filtro de búsqueda
document.querySelector("#buscar").addEventListener("click", () => {
	let url =
		"https://api.themoviedb.org/3/search/movie?api_key=08aaf93f250ae2e4b4180a82f9ec8875&language=es";

	query = document.getElementById("query");
	if (query.value != "") {
		url += "&query=" + query.value;
	}

	document.querySelector("#posts").innerHTML = "";
	getPosts(url);
});

// Botón de 'enviar' al presionar 'enter'
function verificarEnter(event) {
	if (event.keyCode === 13) {
		document.getElementById("buscar").click();
	}
}

// Construir colección de películas
function getPosts(url) {
	fetch(url)
		.then((res) => res.json())
		.then((res) => {
			// Construir colección inicial
			res.results.forEach((e) => {
				const post = document.createElement("div");
				post.classList.add("post");
				post.innerHTML = `
				<div class="d-flex justify-content-between align-items-center mb-2">
					<h2 class="fw-bold w-25">${e.title}</h2>
					<img class="w-25 rounded shadow" style="margin: 5px 25px;" src="https://image.tmdb.org/t/p/w500${
						e.backdrop_path
					}">
					<div class="mx-0 w-50" style="text-align: justify">
						<p class="text-muted">${e.overview}</p>
						<a href="film.html?id=${
							e.id
						}" class="btn btn-sm btn-secondary float-end w-25" onclick="getFilmById(${
					e.id
				})">Ver más</a>
						<p class="fst-italic text-muted">${e.release_date
							.split("-")
							.reverse()
							.join("-")}</p>
					</div>
				</div>
				`;
				document.querySelector("#posts").appendChild(post);
			});
		});
}

// Inicializar la colección
function init(url) {
	getPosts(url);
}

init(
	"https://api.themoviedb.org/3/movie/popular?api_key=08aaf93f250ae2e4b4180a82f9ec8875&language=es"
);

// Función para obtener la información de la película seleccionada
function getFilmById(id) {
	const url = `https://api.themoviedb.org/3/movie/${id}?api_key=08aaf93f250ae2e4b4180a82f9ec8875&language=es`;
	fetch(url)
		.then((res) => res.json())
		.then((res) => {
			const film = res;
			const post = document.createElement("div");
			post.classList.add("post");
			post.innerHTML = `
			<div class="vh-100 d-flex justify-content-center align-items-center">
			<div class="d-flex justify-content-center align-items-center mb-2 text-center w-100">
				<div class="position-relative">
				<img class="rounded shadow" style="margin-right: 25px; width: 80%;" src="https://image.tmdb.org/t/p/w500${
					film.poster_path
				}">
				<img class="rounded shadow position-absolute" style="top: -5px; left: 35px; width: 82%; opacity: 1; filter: blur(25px); z-index: -1;" src="https://image.tmdb.org/t/p/w500${
					film.poster_path
				}">
				</div>
				</br>
				<div class="mx-0 w-50 " style="text-align: justify ">
				<h1 id="title" class="w-100" style="text-align: center"></h1>
				</br>
				<p class="text-muted w-100">${film.overview}</p>
				<p class="fst-italic text-muted">${film.release_date
					.split("-")
					.reverse()
					.join("-")}</p>

				<a href="index.html" class="btn btn-sm btn-secondary float-end w-25">Volver a la colección</a>
				</div>
			</div>
			</div>
			`;
			document.querySelector("#film").appendChild(post);
			document.querySelector("title").textContent = film.title; // Establece el título del head
			document.querySelector("#title").textContent = film.title; // Establece el título del elemento h1
		});
}

// Detectar final del scroll de la página
document.addEventListener("scroll", () => {
	const scrollableHeight =
		document.documentElement.scrollHeight - window.innerHeight;

	if (window.scrollY >= scrollableHeight) {
		console.log("Final de la página");
		getPosts(
			"https://api.themoviedb.org/3/discover/movie?api_key=08aaf93f250ae2e4b4180a82f9ec8875&page=" +
				Math.floor(Math.random() * 500)
		);
	}
});

// Light/dark mode
(() => {
	"use strict";

	const getStoredTheme = () => localStorage.getItem("theme");
	const setStoredTheme = (theme) => localStorage.setItem("theme", theme);

	const getPreferredTheme = () => {
		const storedTheme = getStoredTheme();
		if (storedTheme) {
			return storedTheme;
		}

		return window.matchMedia("(prefers-color-scheme: dark)").matches
			? "dark"
			: "light";
	};

	const setTheme = (theme) => {
		if (theme === "auto") {
			document.documentElement.setAttribute(
				"data-bs-theme",
				window.matchMedia("(prefers-color-scheme: dark)").matches
					? "dark"
					: "light"
			);
		} else {
			document.documentElement.setAttribute("data-bs-theme", theme);
		}
	};

	setTheme(getPreferredTheme());

	const showActiveTheme = (theme, focus = false) => {
		const themeSwitcher = document.querySelector("#bd-theme");

		if (!themeSwitcher) {
			return;
		}

		const themeSwitcherText = document.querySelector("#bd-theme-text");
		const activeThemeIcon = document.querySelector(".theme-icon-active use");
		const btnToActive = document.querySelector(
			`[data-bs-theme-value="${theme}"]`
		);
		const svgOfActiveBtn = btnToActive
			.querySelector("svg use")
			.getAttribute("href");

		document.querySelectorAll("[data-bs-theme-value]").forEach((element) => {
			element.classList.remove("active");
			element.setAttribute("aria-pressed", "false");
		});

		btnToActive.classList.add("active");
		btnToActive.setAttribute("aria-pressed", "true");
		activeThemeIcon.setAttribute("href", svgOfActiveBtn);
		const themeSwitcherLabel = `${themeSwitcherText.textContent} (${btnToActive.dataset.bsThemeValue})`;
		themeSwitcher.setAttribute("aria-label", themeSwitcherLabel);

		if (focus) {
			themeSwitcher.focus();
		}
	};

	window
		.matchMedia("(prefers-color-scheme: dark)")
		.addEventListener("change", () => {
			const storedTheme = getStoredTheme();
			if (storedTheme !== "light" && storedTheme !== "dark") {
				setTheme(getPreferredTheme());
			}
		});

	window.addEventListener("DOMContentLoaded", () => {
		showActiveTheme(getPreferredTheme());

		document.querySelectorAll("[data-bs-theme-value]").forEach((toggle) => {
			toggle.addEventListener("click", () => {
				const theme = toggle.getAttribute("data-bs-theme-value");
				setStoredTheme(theme);
				setTheme(theme);
				showActiveTheme(theme, true);
			});
		});
	});
})();
