function injectCSS() {
    const style = document.createElement('style');
    style.innerHTML = `
        :root {
            --glow-duration: 1.5s; /* Ajusta la duración del resplandor intermitente aquí */
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
            background: linear-gradient(270deg, rgba(0, 130, 255, 1), rgba(8, 35, 215, 1));
            background-size: 600% 600%;
            animation: backgroundAnimation 9s ease infinite;
            z-index: 100;
        }

        .imgloader {
            width: 20vw;
            height: auto;
            max-width: 150px;
            filter: drop-shadow(0 0 2px #ffffff);
            animation: glow var(--glow-duration) ease-in-out infinite;
        }

        @keyframes backgroundAnimation {
            0% {
                background-position: 0% 50%;
            }
            50% {
                background-position: 100% 50%;
            }
            100% {
                background-position: 0% 50%;
            }
        }

        @keyframes glow {
            0%, 100% {
                filter: drop-shadow(0 0 1px #ffffff);
            }
            50% {
                filter: drop-shadow(0 0 5px #67dcff);
            }
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
    const preloaderHtml = `
        <div class="loadermcq" id="loadermcq">
            <div class="imgloader">
                <object id="svg-object" type="image/svg+xml" data="https://cdn.mcq.cl/logo/canales-iso-white.svg" style="width: 100%; height: auto;"></object>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('afterbegin', preloaderHtml);

    const preloader = document.querySelector(".loadermcq");

    window.addEventListener("load", () => {
        document.getElementById('svg-object').addEventListener('load', function() {
            // No additional effects applied in JavaScript
        });

        setTimeout(() => {
            preloader.style.display = "none";
        }, 4000); // Adjust the timeout to allow the animation to play a few cycles
    });
}

// Inject CSS and show preloader
injectCSS();
showPreloader();
