/*!
 * ad-tiktok-cq-injector.js
 * Uso:
 *   <div id="ad-tiktok-cq-mount"
 *        data-tiktok-url="https://www.tiktok.com/@canales"
 *        data-tiktok-handle="@canales"
 *        data-tiktok-description="Síguenos también en TikTok para ver contenido oficial, clips y novedades."></div>
 *   <script src="./ad-tiktok-cq-injector.js"></script>
 */

(function () {
  var MOUNT_ID = "ad-tiktok-cq-mount";
  var STYLE_ID = "ad-tiktok-cq-injected-styles";

  function normalizeHandle(value) {
    var clean = String(value || "").trim().replace(/^@+/, "");
    return clean ? "@" + clean : "@canales";
  }

  function injectStyles() {
    if (document.getElementById(STYLE_ID)) return;

    var style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
      #${MOUNT_ID}{
        --ad-tiktok-cq-bg:#060709;
        --ad-tiktok-cq-bg-2:#0b0d12;
        --ad-tiktok-cq-bg-3:#11141b;
        --ad-tiktok-cq-text:#ffffff;
        --ad-tiktok-cq-soft:rgba(255,255,255,.86);
        --ad-tiktok-cq-muted:rgba(255,255,255,.72);
        --ad-tiktok-cq-cyan:#25F4EE;
        --ad-tiktok-cq-pink:#FE2C55;
        --ad-tiktok-cq-white:#ffffff;
        --ad-tiktok-cq-content-max:1180px;
        --ad-tiktok-cq-font:Inter, "Segoe UI", Arial, sans-serif;

        position:relative;
        display:block;
        width:100%;
        min-height:138px;
        overflow:hidden;
        isolation:isolate;
        font-family:var(--ad-tiktok-cq-font);
        background:
          radial-gradient(ellipse at 7% 20%, rgba(37,244,238,.115), transparent 38%),
          radial-gradient(ellipse at 92% 88%, rgba(254,44,85,.125), transparent 40%),
          linear-gradient(115deg, #0b1216 0%, #101016 54%, #150e14 100%);
        box-shadow:
          inset 0 1px 0 rgba(255,255,255,.06),
          inset 0 -1px 0 rgba(255,255,255,.025),
          0 18px 40px rgba(0,0,0,.18);
      }

      #${MOUNT_ID} *,
      #${MOUNT_ID} *::before,
      #${MOUNT_ID} *::after{
        box-sizing:border-box;
      }

      #${MOUNT_ID} .ad-tiktok-cq__shine{
        position:absolute;
        inset:0;
        pointer-events:none;
        z-index:0;
        background:
          radial-gradient(circle at 18% 18%, rgba(255,255,255,.10), transparent 18%),
          radial-gradient(circle at 76% 20%, rgba(255,255,255,.07), transparent 16%),
          linear-gradient(115deg, rgba(255,255,255,.08), rgba(255,255,255,0) 32%);
        mix-blend-mode:screen;
        opacity:.52;
      }

      #${MOUNT_ID} .ad-tiktok-cq__shadow{
        position:absolute;
        inset:0;
        pointer-events:none;
        z-index:0;
        background:
          linear-gradient(180deg, rgba(255,255,255,.04), rgba(255,255,255,0) 24%),
          linear-gradient(0deg, rgba(0,0,0,.20), rgba(0,0,0,0) 26%);
        opacity:.9;
      }

      #${MOUNT_ID} .ad-tiktok-cq__bg{
        position:absolute;
        inset:0;
        z-index:1;
        pointer-events:none;
        overflow:hidden;
      }

      #${MOUNT_ID} .ad-tiktok-cq__orb{
        position:absolute;
        border-radius:50%;
        filter:blur(72px);
        opacity:.20;
        will-change:transform;
        transform:translate3d(0,0,0);
        mix-blend-mode:screen;
      }

      #${MOUNT_ID} .ad-tiktok-cq__center{
        position:relative;
        z-index:2;
        width:min(100%, var(--ad-tiktok-cq-content-max));
        margin:0 auto;
        backdrop-filter:blur(10px);
        -webkit-backdrop-filter:blur(10px);
      }

      #${MOUNT_ID} .ad-tiktok-cq__inner{
        min-height:138px;
        padding:16px 24px;
        display:grid;
        grid-template-columns:470px minmax(220px,1fr) 180px;
        gap:20px;
        align-items:center;
      }

      #${MOUNT_ID} .ad-tiktok-cq__col{
        min-width:0;
        min-height:82px;
        display:flex;
        flex-direction:column;
        justify-content:center;
        position:relative;
      }

      #${MOUNT_ID} .ad-tiktok-cq__col:not(:last-child)::after{
        content:"";
        position:absolute;
        top:12px;
        right:-10px;
        width:1px;
        height:calc(100% - 24px);
        background:linear-gradient(
          180deg,
          transparent 0%,
          rgba(255,255,255,.08) 18%,
          rgba(255,255,255,.08) 82%,
          transparent 100%
        );
      }

      #${MOUNT_ID} .ad-tiktok-cq__hero{
        gap:8px;
        align-items:flex-start;
      }

      #${MOUNT_ID} .ad-tiktok-cq__title{
        display:flex;
        align-items:center;
        gap:10px;
        width:max-content;
        max-width:100%;
        color:var(--ad-tiktok-cq-text);
        white-space:nowrap;
        flex-wrap:nowrap;
      }

      #${MOUNT_ID} .ad-tiktok-cq__title-top{
        display:block;
        font-size:26px;
        line-height:1;
        letter-spacing:-0.06em;
        font-weight:900;
        white-space:nowrap;
        flex:0 0 auto;
        transform:translateY(1px);
      }

      #${MOUNT_ID} .ad-tiktok-cq__title-brand{
        display:inline-flex;
        align-items:center;
        gap:10px;
        white-space:nowrap;
        flex:0 0 auto;
      }

      #${MOUNT_ID} .ad-tiktok-cq__brand-word{
        display:block;
        font-size:26px;
        line-height:1;
        letter-spacing:-0.06em;
        font-weight:900;
        white-space:nowrap;
      }

      #${MOUNT_ID} .ad-tiktok-cq__logo{
        display:block;
        width:105px;
        height:28px;
        flex:0 0 auto;
      }

      #${MOUNT_ID} .ad-tiktok-cq__meta{
        display:inline-flex;
        align-items:center;
        gap:8px;
        flex-wrap:wrap;
        color:var(--ad-tiktok-cq-muted);
        font-size:15px;
        font-weight:800;
        line-height:1;
        letter-spacing:-0.02em;
      }

      #${MOUNT_ID} .ad-tiktok-cq__handle{
        white-space:nowrap;
      }

      #${MOUNT_ID} .ad-tiktok-cq__copy{
        align-items:flex-start;
        justify-content:center;
      }

      #${MOUNT_ID} .ad-tiktok-cq__text{
        margin:0;
        max-width:24ch;
        font-size:16px;
        line-height:1.45;
        color:var(--ad-tiktok-cq-soft);
      }

      #${MOUNT_ID} .ad-tiktok-cq__cta{
        align-items:center;
        justify-content:center;
      }

      #${MOUNT_ID} .ad-tiktok-cq__btn{
        display:inline-flex;
        align-items:center;
        justify-content:center;
        min-height:42px;
        padding:0 20px;
        border-radius:999px;
        text-decoration:none;
        font-size:12px;
        line-height:1;
        letter-spacing:.08em;
        text-transform:uppercase;
        font-weight:900;
        color:#fff;
        border:2px solid transparent;
        background:
          linear-gradient(180deg, rgba(10,10,10,.96), rgba(20,20,20,.96)) padding-box,
          linear-gradient(
            90deg,
            var(--ad-tiktok-cq-cyan) 0%,
            var(--ad-tiktok-cq-pink) 50%,
            var(--ad-tiktok-cq-cyan) 100%
          ) border-box;
        background-size:100% 100%, 240% 100%;
        background-repeat:no-repeat;
        animation:ad-tiktok-cq-border-flow 8s linear infinite;
        box-shadow:
          inset 0 0 0 1px rgba(255,255,255,.045),
          0 0 0 1px rgba(255,255,255,.02),
          0 0 14px rgba(37,244,238,.10);
        transition:transform .24s ease, filter .24s ease, box-shadow .24s ease;
        white-space:nowrap;
      }


      @keyframes ad-tiktok-cq-border-flow{
        0%{ background-position:0% 0, 0% 0, 0% 50%; }
        100%{ background-position:0% 0, 0% 0, 240% 50%; }
      }

      @media (max-width: 980px){
        #${MOUNT_ID}{
          min-height:auto;
        }

        #${MOUNT_ID} .ad-tiktok-cq__inner{
          min-height:auto;
          grid-template-columns:1fr 1fr;
          gap:14px;
          padding:16px 20px;
        }

        #${MOUNT_ID} .ad-tiktok-cq__col{
          min-height:auto;
        }

        #${MOUNT_ID} .ad-tiktok-cq__hero{
          grid-column:1 / -1;
        }

        #${MOUNT_ID} .ad-tiktok-cq__cta{
          align-items:flex-start;
        }

        #${MOUNT_ID} .ad-tiktok-cq__col:nth-child(2)::after{
          display:none;
        }
      }

      @media (max-width: 680px){
        #${MOUNT_ID} .ad-tiktok-cq__center{
          width:min(100%, 1000px);
        }

        #${MOUNT_ID} .ad-tiktok-cq__inner{
          padding:14px 16px;
          grid-template-columns:1fr;
          gap:12px;
        }

        #${MOUNT_ID} .ad-tiktok-cq__col{
          align-items:center;
          text-align:center;
        }

        #${MOUNT_ID} .ad-tiktok-cq__col::after{
          display:none !important;
        }

        #${MOUNT_ID} .ad-tiktok-cq__hero{
          align-items:center;
        }

        #${MOUNT_ID} .ad-tiktok-cq__title{
          margin:0 auto;
          justify-content:center;
          flex-wrap:wrap;
        }

        #${MOUNT_ID} .ad-tiktok-cq__meta{
          justify-content:center;
          font-size:14px;
        }

        #${MOUNT_ID} .ad-tiktok-cq__copy{
          align-items:center;
        }

        #${MOUNT_ID} .ad-tiktok-cq__title-top,
        #${MOUNT_ID} .ad-tiktok-cq__brand-word{
          font-size:22px;
        }

        #${MOUNT_ID} .ad-tiktok-cq__logo{
          width:90px;
          height:24px;
        }

        #${MOUNT_ID} .ad-tiktok-cq__text{
          max-width:30ch;
          font-size:15px;
          text-align:center;
        }

        #${MOUNT_ID} .ad-tiktok-cq__cta{
          align-items:center;
        }

        #${MOUNT_ID} .ad-tiktok-cq__btn{
          width:100%;
          max-width:260px;
          justify-content:center;
        }
      }

      @media (prefers-reduced-motion: reduce){
        #${MOUNT_ID} .ad-tiktok-cq__btn{
          animation:none !important;
        }
      }

/* V52: social identity and handle visual priority; isolated to this mount. */
#${MOUNT_ID} .ad-tiktok-cq__inner{grid-template-columns:minmax(0,1.45fr) minmax(0,1fr) auto;gap:clamp(20px,2.8vw,40px);padding:clamp(26px,3.6vw,48px) 28px;min-height:196px}
#${MOUNT_ID} .ad-tiktok-cq__title{width:auto;flex-wrap:wrap;column-gap:12px;row-gap:4px}
#${MOUNT_ID} .ad-tiktok-cq__title-top{font-family:'Space Grotesk',Arial,sans-serif;font-size:clamp(18px,1.8vw,25px);font-weight:700;letter-spacing:-.045em}
#${MOUNT_ID} .ad-tiktok-cq__meta{width:100%;line-height:1.02;margin-top:9px}
#${MOUNT_ID} .ad-tiktok-cq__handle{font-family:'Space Grotesk',Arial,sans-serif;font-size:clamp(39px,5.3vw,76px);letter-spacing:-.067em;font-weight:700;line-height:1.02;color:white;text-shadow:0 4px 24px rgba(0,0,0,.14);white-space:nowrap}
#${MOUNT_ID} .ad-tiktok-cq__text{font-family:'DM Sans',system-ui,sans-serif;max-width:34ch;font-size:clamp(15px,1.3vw,17px);line-height:1.55;color:#e4e5ea}
#${MOUNT_ID} .ad-tiktok-cq__col{min-height:unset}
#${MOUNT_ID} .ad-tiktok-cq__col:not(:last-child)::after{opacity:.5}
#${MOUNT_ID} .ad-tiktok-cq__center{backdrop-filter:none;-webkit-backdrop-filter:none}
#${MOUNT_ID}:before{content:"";position:absolute;inset:0;background:linear-gradient(120deg,rgba(255,255,255,.025),transparent 45%,rgba(255,255,255,.018));pointer-events:none;z-index:0}
#${MOUNT_ID}::after{content:"";position:absolute;top:0;left:0;right:0;height:2px;z-index:2;pointer-events:none;background:linear-gradient(90deg,#2DCCD3 0%,#2DCCD3 48%,#F1204A 52%,#F1204A 100%)}
#${MOUNT_ID} .ad-tiktok-cq__btn:focus-visible{outline:3px solid #fff;outline-offset:5px}
@media(max-width:1000px){#${MOUNT_ID} .ad-tiktok-cq__inner{grid-template-columns:minmax(0,1fr) auto;gap:18px;padding:28px 22px}
#${MOUNT_ID} .ad-tiktok-cq__hero{grid-column:1 / -1}
#${MOUNT_ID} .ad-tiktok-cq__handle{font-size:clamp(45px,8vw,70px)}
#${MOUNT_ID} .ad-tiktok-cq__col::after{display:none}
}
@media(max-width:650px){#${MOUNT_ID} .ad-tiktok-cq__inner{grid-template-columns:minmax(0,1fr);gap:17px;padding:28px 18px 30px}
#${MOUNT_ID} .ad-tiktok-cq__hero{grid-column:1}
#${MOUNT_ID} .ad-tiktok-cq__title{justify-content:center}
#${MOUNT_ID} .ad-tiktok-cq__handle{font-size:clamp(43px,12vw,68px)}
#${MOUNT_ID} .ad-tiktok-cq__text{max-width:36ch}
#${MOUNT_ID} .ad-tiktok-cq__cta{width:100%;align-items:stretch}
#${MOUNT_ID} .ad-tiktok-cq__btn{max-width:340px;width:100%;margin-inline:auto}
}

/* V55: CTA Spark fiel a la geometría del sitio /tiktok; ÚNICA definición del botón. */
#${MOUNT_ID} a.ad-tiktok-cq__btn{
  --spark-cyan:#2DCCD3;--spark-pink:#F1204A;
  position:relative!important;isolation:isolate!important;overflow:hidden!important;
  width:clamp(192px,18vw,254px)!important;max-width:100%!important;
  min-height:74px!important;display:inline-flex!important;align-items:center!important;
  justify-content:center!important;padding:17px 61px 17px 27px!important;
  border:0!important;border-radius:0!important;
  background:transparent!important;color:#fff!important;text-decoration:none!important;
  font:700 15px/1.2 'Space Grotesk',Arial,sans-serif!important;
  letter-spacing:-.015em!important;text-transform:none!important;
  box-shadow:none!important;filter:none!important;animation:none!important;
  -webkit-clip-path:polygon(1.3101754386px 1.1733333333px,calc(100% - 19.7256140351px) 1.1733333333px,calc(100% - 19.7256140351px) 1.1733333333px,calc(100% - 19.3882540351px) 4.2181592982px,calc(100% - 18.6134287719px) 7.1173726316px,calc(100% - 17.4355466667px) 9.8338659649px,calc(100% - 15.8890161404px) 12.3305319298px,calc(100% - 14.008245614px) 14.5702631579px,calc(100% - 11.8276435088px) 16.5159522807px,calc(100% - 9.3816182456px) 18.1304919298px,calc(100% - 6.7045782456px) 19.3767747368px,calc(100% - 3.8309319298px) 20.2176933333px,calc(100% - .7950877193px) 20.6161403509px,calc(100% - .7950877193px) calc(100% - .9319298246px),14.6435087719px calc(100% - .9319298246px),14.6435087719px calc(100% - .9319298246px),12.480842807px calc(100% - 1.1064484211px),10.4292547368px calc(100% - 1.6116996491px),8.5162014035px calc(100% - 2.4202266667px),6.7691396491px calc(100% - 3.5045726316px),5.2155263158px calc(100% - 4.8372807018px),3.8828182456px calc(100% - 6.3908940351px),2.7984722807px calc(100% - 8.1379557895px),1.9899452632px calc(100% - 10.0510091228px),1.4846940351px calc(100% - 12.102597193px),1.3101754386px calc(100% - 14.2652631579px),1.3101754386px 1.1733333333px);clip-path:polygon(1.3101754386px 1.1733333333px,calc(100% - 19.7256140351px) 1.1733333333px,calc(100% - 19.7256140351px) 1.1733333333px,calc(100% - 19.3882540351px) 4.2181592982px,calc(100% - 18.6134287719px) 7.1173726316px,calc(100% - 17.4355466667px) 9.8338659649px,calc(100% - 15.8890161404px) 12.3305319298px,calc(100% - 14.008245614px) 14.5702631579px,calc(100% - 11.8276435088px) 16.5159522807px,calc(100% - 9.3816182456px) 18.1304919298px,calc(100% - 6.7045782456px) 19.3767747368px,calc(100% - 3.8309319298px) 20.2176933333px,calc(100% - .7950877193px) 20.6161403509px,calc(100% - .7950877193px) calc(100% - .9319298246px),14.6435087719px calc(100% - .9319298246px),14.6435087719px calc(100% - .9319298246px),12.480842807px calc(100% - 1.1064484211px),10.4292547368px calc(100% - 1.6116996491px),8.5162014035px calc(100% - 2.4202266667px),6.7691396491px calc(100% - 3.5045726316px),5.2155263158px calc(100% - 4.8372807018px),3.8828182456px calc(100% - 6.3908940351px),2.7984722807px calc(100% - 8.1379557895px),1.9899452632px calc(100% - 10.0510091228px),1.4846940351px calc(100% - 12.102597193px),1.3101754386px calc(100% - 14.2652631579px),1.3101754386px 1.1733333333px);
  transform:translate3d(0,0,0)!important;
  transition:opacity .22s ease!important;
}
#${MOUNT_ID} a.ad-tiktok-cq__btn::before,
#${MOUNT_ID} a.ad-tiktok-cq__btn::after{
  content:''!important;position:absolute!important;pointer-events:none!important;
  -webkit-clip-path:polygon(1.3101754386px 1.1733333333px,calc(100% - 19.7256140351px) 1.1733333333px,calc(100% - 19.7256140351px) 1.1733333333px,calc(100% - 19.3882540351px) 4.2181592982px,calc(100% - 18.6134287719px) 7.1173726316px,calc(100% - 17.4355466667px) 9.8338659649px,calc(100% - 15.8890161404px) 12.3305319298px,calc(100% - 14.008245614px) 14.5702631579px,calc(100% - 11.8276435088px) 16.5159522807px,calc(100% - 9.3816182456px) 18.1304919298px,calc(100% - 6.7045782456px) 19.3767747368px,calc(100% - 3.8309319298px) 20.2176933333px,calc(100% - .7950877193px) 20.6161403509px,calc(100% - .7950877193px) calc(100% - .9319298246px),14.6435087719px calc(100% - .9319298246px),14.6435087719px calc(100% - .9319298246px),12.480842807px calc(100% - 1.1064484211px),10.4292547368px calc(100% - 1.6116996491px),8.5162014035px calc(100% - 2.4202266667px),6.7691396491px calc(100% - 3.5045726316px),5.2155263158px calc(100% - 4.8372807018px),3.8828182456px calc(100% - 6.3908940351px),2.7984722807px calc(100% - 8.1379557895px),1.9899452632px calc(100% - 10.0510091228px),1.4846940351px calc(100% - 12.102597193px),1.3101754386px calc(100% - 14.2652631579px),1.3101754386px 1.1733333333px);clip-path:polygon(1.3101754386px 1.1733333333px,calc(100% - 19.7256140351px) 1.1733333333px,calc(100% - 19.7256140351px) 1.1733333333px,calc(100% - 19.3882540351px) 4.2181592982px,calc(100% - 18.6134287719px) 7.1173726316px,calc(100% - 17.4355466667px) 9.8338659649px,calc(100% - 15.8890161404px) 12.3305319298px,calc(100% - 14.008245614px) 14.5702631579px,calc(100% - 11.8276435088px) 16.5159522807px,calc(100% - 9.3816182456px) 18.1304919298px,calc(100% - 6.7045782456px) 19.3767747368px,calc(100% - 3.8309319298px) 20.2176933333px,calc(100% - .7950877193px) 20.6161403509px,calc(100% - .7950877193px) calc(100% - .9319298246px),14.6435087719px calc(100% - .9319298246px),14.6435087719px calc(100% - .9319298246px),12.480842807px calc(100% - 1.1064484211px),10.4292547368px calc(100% - 1.6116996491px),8.5162014035px calc(100% - 2.4202266667px),6.7691396491px calc(100% - 3.5045726316px),5.2155263158px calc(100% - 4.8372807018px),3.8828182456px calc(100% - 6.3908940351px),2.7984722807px calc(100% - 8.1379557895px),1.9899452632px calc(100% - 10.0510091228px),1.4846940351px calc(100% - 12.102597193px),1.3101754386px calc(100% - 14.2652631579px),1.3101754386px 1.1733333333px);
  transition:transform .35s cubic-bezier(.2,.8,.2,1),inset .3s ease!important;
}
#${MOUNT_ID} a.ad-tiktok-cq__btn::before{z-index:0!important;inset:0!important;background:#2DCCD3!important}
#${MOUNT_ID} a.ad-tiktok-cq__btn::after{z-index:1!important;inset:4px!important;background:#08090c!important}
#${MOUNT_ID} a.ad-tiktok-cq__btn .ad-tiktok-cq__btn-pink{
  position:absolute!important;inset:9px 8px 8px 9px!important;z-index:2!important;
  background:#F1204A!important;pointer-events:none!important;
  -webkit-clip-path:polygon(1.3101754386px 1.1733333333px,calc(100% - 19.7256140351px) 1.1733333333px,calc(100% - 19.7256140351px) 1.1733333333px,calc(100% - 19.3882540351px) 4.2181592982px,calc(100% - 18.6134287719px) 7.1173726316px,calc(100% - 17.4355466667px) 9.8338659649px,calc(100% - 15.8890161404px) 12.3305319298px,calc(100% - 14.008245614px) 14.5702631579px,calc(100% - 11.8276435088px) 16.5159522807px,calc(100% - 9.3816182456px) 18.1304919298px,calc(100% - 6.7045782456px) 19.3767747368px,calc(100% - 3.8309319298px) 20.2176933333px,calc(100% - .7950877193px) 20.6161403509px,calc(100% - .7950877193px) calc(100% - .9319298246px),14.6435087719px calc(100% - .9319298246px),14.6435087719px calc(100% - .9319298246px),12.480842807px calc(100% - 1.1064484211px),10.4292547368px calc(100% - 1.6116996491px),8.5162014035px calc(100% - 2.4202266667px),6.7691396491px calc(100% - 3.5045726316px),5.2155263158px calc(100% - 4.8372807018px),3.8828182456px calc(100% - 6.3908940351px),2.7984722807px calc(100% - 8.1379557895px),1.9899452632px calc(100% - 10.0510091228px),1.4846940351px calc(100% - 12.102597193px),1.3101754386px calc(100% - 14.2652631579px),1.3101754386px 1.1733333333px);clip-path:polygon(1.3101754386px 1.1733333333px,calc(100% - 19.7256140351px) 1.1733333333px,calc(100% - 19.7256140351px) 1.1733333333px,calc(100% - 19.3882540351px) 4.2181592982px,calc(100% - 18.6134287719px) 7.1173726316px,calc(100% - 17.4355466667px) 9.8338659649px,calc(100% - 15.8890161404px) 12.3305319298px,calc(100% - 14.008245614px) 14.5702631579px,calc(100% - 11.8276435088px) 16.5159522807px,calc(100% - 9.3816182456px) 18.1304919298px,calc(100% - 6.7045782456px) 19.3767747368px,calc(100% - 3.8309319298px) 20.2176933333px,calc(100% - .7950877193px) 20.6161403509px,calc(100% - .7950877193px) calc(100% - .9319298246px),14.6435087719px calc(100% - .9319298246px),14.6435087719px calc(100% - .9319298246px),12.480842807px calc(100% - 1.1064484211px),10.4292547368px calc(100% - 1.6116996491px),8.5162014035px calc(100% - 2.4202266667px),6.7691396491px calc(100% - 3.5045726316px),5.2155263158px calc(100% - 4.8372807018px),3.8828182456px calc(100% - 6.3908940351px),2.7984722807px calc(100% - 8.1379557895px),1.9899452632px calc(100% - 10.0510091228px),1.4846940351px calc(100% - 12.102597193px),1.3101754386px calc(100% - 14.2652631579px),1.3101754386px 1.1733333333px);
  transition:transform .35s cubic-bezier(.2,.8,.2,1)!important;
}
#${MOUNT_ID} a.ad-tiktok-cq__btn .ad-tiktok-cq__btn-cut{
  position:absolute!important;inset:13px 12px 12px 13px!important;z-index:3!important;
  background:#08090c!important;pointer-events:none!important;
  -webkit-clip-path:polygon(1.3101754386px 1.1733333333px,calc(100% - 19.7256140351px) 1.1733333333px,calc(100% - 19.7256140351px) 1.1733333333px,calc(100% - 19.3882540351px) 4.2181592982px,calc(100% - 18.6134287719px) 7.1173726316px,calc(100% - 17.4355466667px) 9.8338659649px,calc(100% - 15.8890161404px) 12.3305319298px,calc(100% - 14.008245614px) 14.5702631579px,calc(100% - 11.8276435088px) 16.5159522807px,calc(100% - 9.3816182456px) 18.1304919298px,calc(100% - 6.7045782456px) 19.3767747368px,calc(100% - 3.8309319298px) 20.2176933333px,calc(100% - .7950877193px) 20.6161403509px,calc(100% - .7950877193px) calc(100% - .9319298246px),14.6435087719px calc(100% - .9319298246px),14.6435087719px calc(100% - .9319298246px),12.480842807px calc(100% - 1.1064484211px),10.4292547368px calc(100% - 1.6116996491px),8.5162014035px calc(100% - 2.4202266667px),6.7691396491px calc(100% - 3.5045726316px),5.2155263158px calc(100% - 4.8372807018px),3.8828182456px calc(100% - 6.3908940351px),2.7984722807px calc(100% - 8.1379557895px),1.9899452632px calc(100% - 10.0510091228px),1.4846940351px calc(100% - 12.102597193px),1.3101754386px calc(100% - 14.2652631579px),1.3101754386px 1.1733333333px);clip-path:polygon(1.3101754386px 1.1733333333px,calc(100% - 19.7256140351px) 1.1733333333px,calc(100% - 19.7256140351px) 1.1733333333px,calc(100% - 19.3882540351px) 4.2181592982px,calc(100% - 18.6134287719px) 7.1173726316px,calc(100% - 17.4355466667px) 9.8338659649px,calc(100% - 15.8890161404px) 12.3305319298px,calc(100% - 14.008245614px) 14.5702631579px,calc(100% - 11.8276435088px) 16.5159522807px,calc(100% - 9.3816182456px) 18.1304919298px,calc(100% - 6.7045782456px) 19.3767747368px,calc(100% - 3.8309319298px) 20.2176933333px,calc(100% - .7950877193px) 20.6161403509px,calc(100% - .7950877193px) calc(100% - .9319298246px),14.6435087719px calc(100% - .9319298246px),14.6435087719px calc(100% - .9319298246px),12.480842807px calc(100% - 1.1064484211px),10.4292547368px calc(100% - 1.6116996491px),8.5162014035px calc(100% - 2.4202266667px),6.7691396491px calc(100% - 3.5045726316px),5.2155263158px calc(100% - 4.8372807018px),3.8828182456px calc(100% - 6.3908940351px),2.7984722807px calc(100% - 8.1379557895px),1.9899452632px calc(100% - 10.0510091228px),1.4846940351px calc(100% - 12.102597193px),1.3101754386px calc(100% - 14.2652631579px),1.3101754386px 1.1733333333px);
  transition:inset .3s ease!important;
}
#${MOUNT_ID} a.ad-tiktok-cq__btn .ad-tiktok-cq__btn-label{
  position:relative!important;z-index:4!important;color:#fff!important;
  white-space:nowrap!important;transform:none!important;text-shadow:none!important;
  transition:transform .3s ease,text-shadow .3s ease!important;
}
#${MOUNT_ID} a.ad-tiktok-cq__btn .ad-tiktok-cq__btn-icon{
  position:absolute!important;right:17px!important;top:50%!important;z-index:4!important;
  display:grid!important;place-items:center!important;width:39px!important;height:39px!important;
  border:1px solid #ffffff25!important;border-radius:0 12px 0 12px!important;
  background:#ffffff0d!important;color:#fff!important;font-size:19px!important;
  transform:translateY(-50%)!important;
  transition:transform .3s ease,background .3s ease,border-color .3s ease!important;
}
#${MOUNT_ID} a.ad-tiktok-cq__btn:visited{color:#fff!important}
#${MOUNT_ID} a.ad-tiktok-cq__btn:focus-visible{outline:3px solid #25F4EE!important;outline-offset:5px!important}
@media(hover:hover) and (pointer:fine){#${MOUNT_ID} a.ad-tiktok-cq__btn:hover{opacity:.78!important}}
#${MOUNT_ID} a.ad-tiktok-cq__btn:active{opacity:.66!important}
@media(max-width:680px){#${MOUNT_ID} a.ad-tiktok-cq__btn{width:min(100%,315px)!important;min-height:66px!important}}
@media(prefers-reduced-motion:reduce){
 #${MOUNT_ID} a.ad-tiktok-cq__btn,#${MOUNT_ID} a.ad-tiktok-cq__btn::before,#${MOUNT_ID} a.ad-tiktok-cq__btn::after,
 #${MOUNT_ID} a.ad-tiktok-cq__btn .ad-tiktok-cq__btn-pink,#${MOUNT_ID} a.ad-tiktok-cq__btn .ad-tiktok-cq__btn-cut,
 #${MOUNT_ID} a.ad-tiktok-cq__btn .ad-tiktok-cq__btn-icon{transition:none!important;transform:none!important}
 #${MOUNT_ID} a.ad-tiktok-cq__btn .ad-tiktok-cq__btn-icon{transform:translateY(-50%)!important}
}

/* V56: Definitive scoped responsive layout. Nothing escapes this mount. */
#${MOUNT_ID}{box-sizing:border-box!important;min-width:0!important;max-width:100%!important;overflow:hidden!important}
#${MOUNT_ID} *,#${MOUNT_ID} *::before,#${MOUNT_ID} *::after{box-sizing:border-box}
#${MOUNT_ID} .ad-tiktok-cq__center{width:100%!important;max-width:1180px!important;min-width:0!important;backdrop-filter:none!important;-webkit-backdrop-filter:none!important}
#${MOUNT_ID} .ad-tiktok-cq__inner{width:100%!important;min-width:0!important;max-width:100%!important;display:grid!important;grid-template-columns:minmax(0,1.35fr) minmax(0,1fr) minmax(180px,.55fr)!important;align-items:center!important;gap:clamp(20px,2.5vw,34px)!important;padding:clamp(28px,3vw,42px) clamp(18px,3vw,32px)!important}
#${MOUNT_ID} .ad-tiktok-cq__col{min-width:0!important;max-width:100%!important;height:auto!important;min-height:0!important;position:relative!important}
#${MOUNT_ID} .ad-tiktok-cq__hero{grid-column:auto!important;align-items:flex-start!important;text-align:left!important}
#${MOUNT_ID} .ad-tiktok-cq__copy{grid-column:auto!important;align-items:flex-start!important;text-align:left!important}
#${MOUNT_ID} .ad-tiktok-cq__cta{grid-column:auto!important;align-items:center!important;justify-content:center!important}
#${MOUNT_ID} .ad-tiktok-cq__title{width:auto!important;min-width:0!important;max-width:100%!important;display:flex!important;align-items:center!important;flex-wrap:wrap!important;white-space:normal!important;gap:8px 12px!important}
#${MOUNT_ID} .ad-tiktok-cq__title-top{white-space:normal!important;line-height:1.12!important}
#${MOUNT_ID} .ad-tiktok-cq__meta{display:flex!important;min-width:0!important;max-width:100%!important;flex-wrap:wrap!important;align-items:center!important;gap:6px 10px!important}
#${MOUNT_ID} .ad-tiktok-cq__handle{font-family:'Space Grotesk',Arial,sans-serif!important;font-weight:700!important;line-height:1.08!important;letter-spacing:-.065em!important;font-size:clamp(32px,4vw,64px)!important;white-space:nowrap!important;max-width:100%!important;}
#${MOUNT_ID} .ad-tiktok-cq__text{font-family:'DM Sans',Arial,sans-serif!important;max-width:38ch!important;overflow-wrap:break-word!important;font-size:clamp(14px,1.35vw,16px)!important;line-height:1.5!important;text-align:left!important}
#${MOUNT_ID} .ad-tiktok-cq__bg{pointer-events:none!important}
@media(max-width:1050px){
 #${MOUNT_ID} .ad-tiktok-cq__inner{grid-template-columns:minmax(0,1fr) minmax(180px,.55fr)!important;gap:22px!important;padding:30px 25px!important}
 #${MOUNT_ID} .ad-tiktok-cq__hero{grid-column:1/-1!important}
 #${MOUNT_ID} .ad-tiktok-cq__copy{grid-column:1!important}
 #${MOUNT_ID} .ad-tiktok-cq__cta{grid-column:2!important;align-items:flex-end!important}
 #${MOUNT_ID} .ad-tiktok-cq__col::after{display:none!important}
 #${MOUNT_ID} .ad-tiktok-cq__handle{font-size:clamp(40px,7vw,68px)!important}
}
@media(max-width:680px){
 #${MOUNT_ID} .ad-tiktok-cq__inner{grid-template-columns:minmax(0,1fr)!important;gap:14px!important;padding:26px 18px 29px!important}
 #${MOUNT_ID} .ad-tiktok-cq__hero,#${MOUNT_ID} .ad-tiktok-cq__copy,#${MOUNT_ID} .ad-tiktok-cq__cta{grid-column:1!important;width:100%!important;min-width:0!important;align-items:center!important;text-align:center!important}
 #${MOUNT_ID} .ad-tiktok-cq__title{justify-content:center!important;gap:8px!important;}
 #${MOUNT_ID} .ad-tiktok-cq__meta{justify-content:center!important}
 #${MOUNT_ID} .ad-tiktok-cq__handle{font-size:clamp(35px,11.5vw,60px)!important;letter-spacing:-.07em!important}
 #${MOUNT_ID} .ad-tiktok-cq__text{max-width:42ch!important;text-align:center!important;font-size:15px!important}
 #${MOUNT_ID} .ad-tiktok-cq__cta{justify-content:center!important}
 #${MOUNT_ID} .ad-tiktok-cq__col::after{display:none!important}
}
@media(max-width:380px){
 #${MOUNT_ID} .ad-tiktok-cq__inner{padding:23px 12px 26px!important}
 #${MOUNT_ID} .ad-tiktok-cq__handle{font-size:clamp(32px,10vw,40px)!important}
 #${MOUNT_ID} .ad-tiktok-cq__title-top{font-size:19px!important}
}
@media(prefers-reduced-motion:reduce){#${MOUNT_ID} .ad-tiktok-cq__orb{display:none!important}}
#${MOUNT_ID} .ad-tiktok-cq__title-brand{max-width:100%!important;flex-wrap:wrap!important;justify-content:center!important}
#${MOUNT_ID} a.ad-tiktok-cq__btn{width:min(100%,255px)!important;flex-shrink:0!important}
@media(max-width:680px){#${MOUNT_ID} a.ad-tiktok-cq__btn{width:min(100%,290px)!important;min-height:68px!important}}

/* V59: mobile interaction polish (retains original Spark clipping and logo). */
#${MOUNT_ID} a.ad-tiktok-cq__btn{-webkit-tap-highlight-color:transparent;touch-action:manipulation}
#${MOUNT_ID} a.ad-tiktok-cq__btn .ad-tiktok-cq__btn-icon>.bi{display:inline-block;font-size:19px;line-height:1}
@media(hover:none),(pointer:coarse){#${MOUNT_ID} a.ad-tiktok-cq__btn:hover{opacity:1!important}#${MOUNT_ID} a.ad-tiktok-cq__btn:active{opacity:.66!important}}
@media(max-width:420px){#${MOUNT_ID} .ad-tiktok-cq__inner{padding-inline:14px!important}#${MOUNT_ID} .ad-tiktok-cq__handle{font-size:clamp(32px,10vw,46px)!important}#${MOUNT_ID} a.ad-tiktok-cq__btn{max-width:100%!important}}
@media(prefers-reduced-motion:reduce){#${MOUNT_ID} a.ad-tiktok-cq__btn .ad-tiktok-cq__btn-icon>.bi{transition:none!important}}
/* V63: el CTA promocional no tiene flecha. Mantener centrado el texto. */
#${MOUNT_ID} a.ad-tiktok-cq__btn{
  padding-left:24px!important;padding-right:24px!important;
  text-align:center!important;justify-content:center!important;
}
#${MOUNT_ID} a.ad-tiktok-cq__btn .ad-tiktok-cq__btn-icon{display:none!important}
    `;
    document.head.appendChild(style);
  }

  function createTikTokLogo() {
    return (
      '<svg xmlns="http://www.w3.org/2000/svg" width="105" height="28" viewBox="0 0 105 28" fill="none" class="ad-tiktok-cq__logo" aria-hidden="true">' +
      '<path d="M73.6292 19.4778C73.6292 15.5478 76.5273 12.4649 80.4333 12.1743C80.2328 12.1596 80.0305 12.1513 79.8263 12.1513C75.6177 12.1513 72.4161 15.3473 72.4161 19.4768C72.4161 23.6064 75.6177 26.8051 79.8263 26.8051C80.0305 26.8051 80.2328 26.7969 80.4333 26.7821C76.5282 26.4915 73.6292 23.4068 73.6292 19.4768V19.4778ZM24.0277 7.46994V6.64955C22.7751 6.56126 21.4635 6.16762 20.3102 5.40885C21.3716 6.50147 22.6941 7.16643 24.0277 7.46994ZM12.6452 0V18.3401C12.6452 20.7433 10.9153 22.2884 8.81185 22.2884C8.11378 22.2884 7.45158 22.1256 6.87584 21.8249C7.60702 22.7565 8.76035 23.2918 10.0259 23.2918C12.1293 23.2918 13.8593 21.7467 13.8593 19.3416V1.00157H17.1933C17.1022 0.682429 17.0277 0.348572 16.9707 0H12.6462H12.6452ZM9.91 10.6623V9.75359C9.48877 9.68369 9.06753 9.6607 8.71896 9.6607C3.9732 9.6607 0 13.4628 0 18.1773C0 21.2721 1.50926 23.9181 3.80213 25.4844C2.20457 23.9016 1.21403 21.6869 1.21403 19.1788C1.21403 14.4717 5.17527 10.6724 9.91092 10.6623H9.91Z" fill="#2DCCD3"></path>' +
      '<path d="M82.2534 12.1524C82.0492 12.1524 81.8469 12.1606 81.6464 12.1753C85.5497 12.466 88.4477 15.5507 88.4477 19.4788C88.4477 23.4069 85.5497 26.4935 81.6464 26.7841C81.8469 26.7988 82.0492 26.8071 82.2534 26.8071C86.4602 26.8071 89.6617 23.6093 89.6617 19.4788C89.6617 15.3484 86.4602 12.1533 82.2534 12.1533V12.1524ZM20.3092 5.40991C19.2837 4.35683 18.5011 2.90644 18.1828 1.00171H17.1923C17.7579 3.06003 18.9223 4.49663 20.3092 5.40991ZM24.0267 10.9429C22.1008 10.9429 20.278 10.576 18.6721 9.49621C20.5419 11.3632 22.8109 11.9463 25.2408 11.9463V7.65218C24.8407 7.62551 24.4314 7.56572 24.0267 7.47099V10.9429ZM6.87486 21.8259C6.35889 21.1748 6.05078 20.3323 6.05078 19.3427C6.05078 16.567 8.22409 15.1 11.1221 15.4045V10.7553C10.7009 10.6854 10.2797 10.6624 9.92925 10.6624H9.90902V14.4001C7.01098 14.0976 4.83767 15.5627 4.83767 18.3402C4.83767 19.9644 5.6691 21.1959 6.87486 21.825V21.8259ZM17.4581 18.0385C17.4581 23.8953 12.9708 26.9984 8.74097 26.9984C6.9098 26.9984 5.20924 26.4466 3.80115 25.4855C5.38215 27.0518 7.55821 28 9.955 28C14.1848 28 18.6721 24.8969 18.6721 19.0401V9.49713C18.2509 9.21294 17.8462 8.88092 17.4581 8.49372V18.0385Z" fill="#F1204A"></path>' +
      '<path d="M63.745 13.7278H58.5559L54.6278 17.9622V7.8352H50.2573V26.5018H54.6278V23.0482L56.3578 21.2281L58.9992 26.4779H64.0945L59.5832 18.194L63.7459 13.726L63.745 13.7278ZM28.5233 11.9473H33.0585V26.5027H37.7095V11.9473H40.7648L42.3661 7.83612H28.5243V11.9473H28.5233ZM43.4182 26.5027H47.7887V13.7278H43.4182V26.5027ZM45.5915 7.60251C44.166 7.60251 43.1607 8.58293 43.1607 9.93583C43.1607 11.2887 44.166 12.2692 45.5915 12.2692C47.0171 12.2692 48.0224 11.2657 48.0224 9.93583C48.0224 8.60592 47.0171 7.60251 45.5915 7.60251ZM100.125 18.1958L104.287 13.7278H99.0982L95.17 17.9622V7.8352H90.7995V26.5018H95.17V23.0482L96.9 21.2281L99.5415 26.4779H104.637L100.125 18.194L100.125 18.1958ZM76.1539 7.83612H61.7326V11.9473H66.2669V26.5027H70.9179V11.9473H74.5517L76.1539 7.83612ZM81.6474 12.1753C81.4469 12.1606 81.2445 12.1524 81.0403 12.1524C80.8362 12.1524 80.6338 12.1606 80.4333 12.1753C76.5282 12.466 73.6292 15.5489 73.6292 19.4788C73.6292 23.4088 76.5273 26.4935 80.4333 26.7841C80.6338 26.7988 80.8362 26.8071 81.0403 26.8071C81.2445 26.8071 81.4469 26.7988 81.6474 26.7841C85.5507 26.4935 88.4487 23.4069 88.4487 19.4788C88.4487 15.5507 85.5507 12.466 81.6474 12.1753ZM81.6474 22.7631C81.4533 22.7981 81.251 22.8146 81.0403 22.8146C80.8297 22.8146 80.6274 22.7981 80.4333 22.7631C78.8974 22.4973 77.8839 21.218 77.8839 19.4779C77.8839 17.7378 78.8974 16.4594 80.4333 16.1927C80.6274 16.1577 80.8297 16.1412 81.0403 16.1412C81.251 16.1412 81.4533 16.1577 81.6474 16.1927C83.1815 16.4585 84.195 17.7378 84.195 19.4779C84.195 21.218 83.1815 22.4964 81.6474 22.7631ZM17.1933 1.00171H13.8593V19.3418C13.8593 21.7468 12.1293 23.292 10.0259 23.292C8.76037 23.292 7.60704 22.7558 6.87586 21.825C5.6701 21.1968 4.83868 19.9644 4.83868 18.3402C4.83868 15.5627 7.01198 14.0976 9.91002 14.4001V10.6624C5.17437 10.6725 1.21313 14.4728 1.21313 19.179C1.21313 21.687 2.20367 23.9017 3.80123 25.4846C5.20932 26.4447 6.90989 26.9975 8.74105 26.9975C12.9709 26.9975 17.4582 23.8944 17.4582 18.0376V8.4928C17.8463 8.88 18.251 9.21202 18.6722 9.49621C20.278 10.576 22.1009 10.9429 24.0268 10.9429V7.47099C22.6932 7.16841 21.3697 6.50253 20.3093 5.40991C18.9224 4.49663 17.758 3.06095 17.1924 1.00171H17.1933Z" fill="currentColor"></path>' +
      '</svg>'
    );
  }

  function createMarkup(handle, description, url) {
    return (
      '<div class="ad-tiktok-cq__shine" aria-hidden="true"></div>' +
      '<div class="ad-tiktok-cq__shadow" aria-hidden="true"></div>' +
      '<div class="ad-tiktok-cq__center">' +
        '<div class="ad-tiktok-cq__inner">' +
          '<div class="ad-tiktok-cq__col ad-tiktok-cq__hero">' +
            '<div class="ad-tiktok-cq__title" aria-label="Estamos en TikTok">' +
              '<span class="ad-tiktok-cq__title-top">Estamos en</span>' +
              '<span class="ad-tiktok-cq__title-brand">' +
                createTikTokLogo() +
              '</span>' +
            '</div>' +
            '<div class="ad-tiktok-cq__meta">' +
              '<span class="ad-tiktok-cq__handle">' + handle + '</span>' +
            '</div>' +
          '</div>' +
          '<div class="ad-tiktok-cq__col ad-tiktok-cq__copy">' +
            '<p class="ad-tiktok-cq__text">' + description + '</p>' +
          '</div>' +
          '<div class="ad-tiktok-cq__col ad-tiktok-cq__cta">' +
            '<a href="' + url + '" target="_blank" rel="noopener noreferrer" class="ad-tiktok-cq__btn"><span class="ad-tiktok-cq__btn-pink" aria-hidden="true"></span><span class="ad-tiktok-cq__btn-cut" aria-hidden="true"></span><span class="ad-tiktok-cq__btn-label">Ver perfil</span></a>' +
          '</div>' +
        '</div>' +
      '</div>'
    );
  }

  function injectBackground(mount) {
    var bg = document.createElement("div");
    bg.className = "ad-tiktok-cq__bg";
    bg.setAttribute("aria-hidden", "true");

    var orbConfigs = [
      { color:'rgba(37,244,238,.48)', width:190, height:190, left:'-36px', top:'4px', dx:8, dy:6, duration:14 },
      { color:'rgba(37,244,238,.28)', width:160, height:160, left:'26%', top:'-34px', dx:7, dy:8, duration:16 },
      { color:'rgba(254,44,85,.46)', width:220, height:220, right:'-48px', top:'-26px', dx:-8, dy:7, duration:18 },
      { color:'rgba(254,44,85,.28)', width:170, height:170, right:'16%', bottom:'-40px', dx:-6, dy:-7, duration:20 },
      { color:'rgba(37,244,238,.16)', width:130, height:130, left:'56%', bottom:'-28px', dx:5, dy:-6, duration:15 }
    ];

    orbConfigs.forEach(function (cfg, index) {
      var orb = document.createElement("div");
      orb.className = "ad-tiktok-cq__orb";
      orb.style.background = cfg.color;
      orb.style.width = cfg.width + "px";
      orb.style.height = cfg.height + "px";
      if (cfg.left !== undefined) orb.style.left = cfg.left;
      if (cfg.right !== undefined) orb.style.right = cfg.right;
      if (cfg.top !== undefined) orb.style.top = cfg.top;
      if (cfg.bottom !== undefined) orb.style.bottom = cfg.bottom;
      orb.dataset.dx = String(cfg.dx);
      orb.dataset.dy = String(cfg.dy);
      orb.dataset.duration = String(cfg.duration);
      orb.dataset.phase = String(index * 0.9);
      bg.appendChild(orb);
    });

    mount.appendChild(bg);

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    var orbs = Array.prototype.slice.call(bg.querySelectorAll(".ad-tiktok-cq__orb"));
    var start = null;

    function animate(ts) {
      if (!start) start = ts;
      var elapsed = (ts - start) / 1000;

      orbs.forEach(function (orb) {
        var dx = parseFloat(orb.dataset.dx || "0");
        var dy = parseFloat(orb.dataset.dy || "0");
        var duration = parseFloat(orb.dataset.duration || "10");
        var phase = parseFloat(orb.dataset.phase || "0");

        var progress = (elapsed / duration) + phase;
        var x = Math.sin(progress) * dx;
        var y = Math.cos(progress * 1.15) * dy;

        orb.style.transform = "translate3d(" + x.toFixed(2) + "px," + y.toFixed(2) + "px,0)";
      });

      requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
  }

  function init() {
    var mount = document.getElementById(MOUNT_ID);
    if (!mount) return;

    injectStyles();

    var handle = normalizeHandle(mount.getAttribute("data-tiktok-handle") || "@canales");
    var description = mount.getAttribute("data-tiktok-description") || "Síguenos también en TikTok para ver contenido oficial, clips y novedades.";
    var url = mount.getAttribute("data-tiktok-url") || "https://www.tiktok.com/@canales";

    mount.innerHTML = createMarkup(handle, description, url);
    injectBackground(mount);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
