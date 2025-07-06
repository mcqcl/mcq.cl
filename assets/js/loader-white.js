function injectCSS() {
    const style = document.createElement('style');
    style.innerHTML = `
        :root {
            --glow-duration: 1.5s;
        }

        body::before {
            content: "";
            position: fixed;
            inset: 0;
            background: linear-gradient(270deg, rgba(40, 40, 40, 1), rgba(0, 0, 0, 1));
            z-index: 99;
            display: block;
        }
        body.preloaded::before {
            display: none;
        }

        body {
            margin: 0;
            position: relative;
            min-height: 100vh;
            font-family: Arial, sans-serif;
        }

        .loadermcq {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            background: linear-gradient(270deg, rgb(255, 255, 255), rgb(241, 241, 241));
            background-size: 600% 600%;
            animation: backgroundAnimation 9s ease infinite;
            z-index: 100;
            opacity: 1;
            transition: opacity 0.5s ease;
        }

        .imgloader {
            width: 30vw;
            height: auto;
            max-width: 250px;
            filter: drop-shadow(0 0 2pxrgb(24, 24, 24));
            animation: glow var(--glow-duration) ease-in-out infinite;
        }

        .imgloader.scale-in {
            animation: scaleIn 0.4s ease forwards;
        }

        @keyframes backgroundAnimation {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
        }

        @keyframes glow {
            0%, 100% {
                filter: drop-shadow(0 0 1px #ffffff);
            }
            50% {
                filter: drop-shadow(0 0 5pxrgb(219, 219, 219));
            }
        }

        @keyframes scaleIn {
            0% { transform: scale(1); }
            100% { transform: scale(1.2); }
        }

        @media (max-width: 768px) {
            .imgloader {
                width: 30vw;
            }
        }

        @media (max-width: 576px) {
            .imgloader {
                width: 40vw;
            }
        }
    `;
    document.head.appendChild(style);
}

function showPreloader() {
    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    const svgUrl = isMobile
        ? "https://cdn.mcq.cl/logo/canales-iso-black.svg"
        : "https://cdn.mcq.cl/logo/canales-black.svg";

    const preloaderHtml = `
        <div class="loadermcq" id="loadermcq">
            <div class="imgloader" id="imgloader">
                <object id="svg-object" type="image/svg+xml" data="${svgUrl}" style="width: 100%; height: auto;"></object>
            </div>
        </div>
    `;

    if (!document.getElementById("loadermcq")) {
        document.body.insertAdjacentHTML('afterbegin', preloaderHtml);
    }

    document.body.style.overflow = "hidden"; // Bloquear scroll

    const preloader = document.getElementById("loadermcq");
    const imgWrapper = document.getElementById("imgloader");

    window.addEventListener("load", () => {
        setTimeout(() => {
            imgWrapper.classList.add('scale-in');

            setTimeout(() => {
                preloader.style.opacity = "0";
                setTimeout(() => {
                    preloader.remove();
                    document.body.classList.add("preloaded");
                    document.body.style.overflow = ""; // Restaurar scroll
                }, 500);
            }, 400); // Duración del scale
        }, 4000); // Tiempo visible del loader
    });
}

// Ejecutar loader al cargar el DOM
document.addEventListener("DOMContentLoaded", () => {
    injectCSS();
    showPreloader();
});
