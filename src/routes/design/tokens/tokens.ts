import type { TokenMap } from '../../../../scripts/generate-tokens/types.ts'

export const tokens = {
  "reset": {
    "type": "SOURCE",
    "data": {
      "source": "* {\n\tbox-sizing: border-box;\n}\n\n/**\n ** Hard normalise elements\n */\nhtml,body,div,span,applet,object,iframe,h1,h2,h3,h4,h5,h6,p,blockquote,pre,a,abbr,acronym,address,big,cite,code,del,dfn,em,img,ins,kbd,q,s,samp,small,strike,strong,sub,sup,tt,var,b,u,i,center,dl,dt,dd,ol,ul,/* li ,*/fieldset,form,label,legend,table,caption,tbody,tfoot,thead,tr,th,td,article,aside,canvas,details,embed,figure,figcaption,footer,header,hgroup,menu,nav,output,ruby,section,summary,time,mark,audio,video {\n\tmargin: 0;\n\tpadding: 0;\n}\n\n:root,\nhtml,\nbody {\n\tmin-height: 100%;\n\theight: auto;\n\n\t/**\n     ** Prevent font size shifting on IOS.\n     */\n\t-webkit-text-size-adjust: 100%;\n\n\t/**\n     ** Better tab size.\n     */\n\t-moz-tab-size: 4;\n\ttab-size: 4;\n\n\t/**\n\t** Better fallback fonts.\n\t*/\n\t// prettier-ignore\n\tfont-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI','Helvetica Neue',Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';\n}\n\nhr {\n\t/**\n    ** Fix firefox weirdness: https://bugzilla.mozilla.org/show_bug.cgi?id=190655\n    */\n\theight: 0;\n\tcolor: inherit;\n}\n\n/**\n ** Normalise italics\n */\nem,\ni,\ncite,\nq,\naddress,\ndfn,\nvar {\n\tfont-style: italic;\n}\n\n/**\n ** Stop line height being effected\n */\nsub,\nsup {\n\tfont-size: 75%;\n\tline-height: 0;\n\tposition: relative;\n\tvertical-align: baseline;\n}\n\nsub {\n\tbottom: -0.25em;\n}\n\nsup {\n\ttop: -0.5em;\n}\n\nu {\n\ttext-decoration: underline;\n}\n\nbutton,\n[type='button'],\n[type='reset'],\n[type='submit'] {\n\t/**\n    ** Correct the inability to style clickable types in iOS and Safari\n    */\n\t-webkit-appearance: button;\n\n\t/**\n    ** Set pointer type\n    */\n\tcursor: pointer;\n}\n\n/**\n ** Remove styling for invalid elements\n *  (https://github.com/mozilla/gecko-dev/blob/2f9eacd9d3d995c937b4251a5557d95d494c9be1/layout/style/res/forms.css#L728-L737)\n */\n:-moz-ui-invalid {\n\tbox-shadow: none;\n}\n\n/**\n ** Add the correct vertical alignment in Chrome and Firefox\n */\nprogress {\n\tvertical-align: baseline;\n}\n\n/**\n ** Correct the cursor style of increment and decrement buttons in Safari\n */\n::-webkit-inner-spin-button,\n::-webkit-outer-spin-button {\n\theight: auto;\n}\n\n::-webkit-file-upload-button {\n\t/**\n     ** Correct the inability to style clickable types in iOS and Safari\n     */\n\t-webkit-appearance: button;\n\n\t/**\n     ** Change font properties to 'inherit' in Safari\n     */\n\tfont: inherit;\n}\n\n/**\n ** Add the correct display in Chrome and Safari\n */\nsummary {\n\tdisplay: list-item;\n}\n\n/**\n ** Contain overflow on specific elements (opinions)\n */\nfigure,\npre {\n\toverflow-x: auto;\n}\n\n/**\n ** Remove all animations for those that want them to be off\n */\n@media (prefers-reduced-motion: reduce) {\n\thtml {\n\t\tscroll-behavior: auto;\n\t}\n\n\t*,\n\t*::before,\n\t*::after {\n\t\tanimation-duration: 0.01ms !important;\n\t\tanimation-iteration-count: 1 !important;\n\t\ttransition-duration: 0.01ms !important;\n\t\tscroll-behavior: auto !important;\n\t}\n}\n\n/**\n ** Ensure certain elements are set to block by default\n */\narticle,\naside,\ndetails,\nfigcaption,\nfigure,\nfooter,\nheader,\nhgroup,\nmenu,\nnav,\nsection {\n\tdisplay: block;\n}\n"
    }
  },
  "dimensions": {
    "type": "CUSTOM_PROPERTIES",
    "data": {
      "--radius-sm": "0.188rem",
      "--radius": "0.313rem",
      "--radius-md": "0.438rem",
      "--radius-lg": "0.5rem",
      "--padding": "0.5rem",
      "--gap": "1.25rem",
      "--page-width": "min(43.75rem, 100vw)",
      "--nav-height": "3.125rem",
      "--nav-width": "100%",
      "--secondary-nav-height": "3.125rem",
      "--padding-top": "3.75rem",
      "--padding-bottom": "5rem",
      "--padding-inset": "1.25rem",
      "--thick-border-width": "0.188rem",
      "--border-radius": "0.25rem",
      "--border-radius-inner": "0.125rem",
      "--page-content-width": "47.5rem",
      "--banner-height": "0px"
    }
  },
  "font": {
    "type": "CUSTOM_PROPERTIES",
    "data": {
      "--font-a": "'red_hat_text', system-ui, Inter, Avenir, Helvetica, Arial, sans-serif",
      "--font-b": "'dosis', system-ui, sans-serif",
      "--font-m": "'inconsolata', system-ui, monospace",
      "--font-xxs": "clamp(0.5rem, 2vw, 0.5rem)",
      "--font-xs": "clamp(0.5rem, 2vw, 0.75rem)",
      "--font-sm": "clamp(0.75rem, 2vw, 0.875rem)",
      "--font": "clamp(1rem, 2.7vw, 1.1rem)",
      "--font-md": "clamp(1rem, 2vw, 1.25rem)",
      "--font-lg": "clamp(1.25rem, 5vw, 1.75rem)",
      "--font-xl": "clamp(1.5rem, 5vw, 2rem)",
      "--font-xxl": "clamp(1.75rem, 7vw, 3rem)",
      "--font-xxxl": "clamp(3rem, 10vw, 5rem)",
      "--line-height-body": "calc(1.5 * var(--font))",
      "--line-height-body-sm": "calc(1.5 * var(--font-xs))",
      "--font-mono": "400 var(--font) / 1.1 var(--font-m)"
    }
  },
  "shadows": {
    "type": "CUSTOM_PROPERTIES",
    "data": {
      "--shadow-lightness": "0.5",
      "--shadow-sm": "0rem 0.02rem 0.029rem rgba(0, 0, 0, calc(var(--shadow-lightness) * 0.04)), 0rem 0.078rem 0.059rem rgba(0, 0, 0, calc(var(--shadow-lightness) * 0.04)), 0rem 0.094rem 0.078rem rgba(0, 0, 0, calc(var(--shadow-lightness) * 0.05)), 0rem 0.117rem 0.117rem rgba(0, 0, 0, calc(var(--shadow-lightness) * 0.1)), 0rem 0.195rem 0.195rem rgba(0, 0, 0, calc(var(--shadow-lightness) * 0.1)), 0rem 0.273rem 0.391rem rgba(0, 0, 0, calc(var(--shadow-lightness) * 0.15))",
      "--shadow": "0rem 0.029rem 0.039rem rgba(0, 0, 0, calc(var(--shadow-lightness) * 0.03)), 0rem 0.094rem 0.078rem rgba(0, 0, 0, calc(var(--shadow-lightness) * 0.04)), 0rem 0.175rem 0.117rem rgba(0, 0, 0, calc(var(--shadow-lightness) * 0.05)), 0rem 0.195rem 0.195rem rgba(0, 0, 0, calc(var(--shadow-lightness) * 0.065)), 0rem 0.391rem 0.391rem rgba(0, 0, 0, calc(var(--shadow-lightness) * 0.09)), 0rem 0.391rem 0.781rem rgba(0, 0, 0, calc(var(--shadow-lightness) * 0.1))",
      "--shadow-lg": "0rem 0.049rem 0.039rem rgba(0, 0, 0, calc(var(--shadow-lightness) * 0.06)), 0rem 0.094rem 0.094rem rgba(0, 0, 0, calc(var(--shadow-lightness) * 0.07)), 0rem 0.175rem 0.195rem rgba(0, 0, 0, calc(var(--shadow-lightness) * 0.08)), 0rem 0.195rem 0.313rem rgba(0, 0, 0, calc(var(--shadow-lightness) * 0.1)), 0rem 0.391rem 0.586rem rgba(0, 0, 0, calc(var(--shadow-lightness) * 0.1)), 0rem 0.781rem 1.172rem rgba(0, 0, 0, calc(var(--shadow-lightness) * 0.01))"
    }
  },
  "inputs": {
    "type": "UTILITIES",
    "data": {
      ".label": {
        "color": "var(--fg-c)",
        "font-family": "var(--font)",
        "font-size": "var(--font-xs)"
      }
    }
  },
  "utils": {
    "type": "UTILITIES",
    "data": {
      ".br-xs": {
        "height": "0.313rem"
      },
      ".br-sm": {
        "height": "0.5rem"
      },
      ".br-md": {
        "height": "2.5rem"
      },
      ".br-lg": {
        "height": "4.063rem"
      },
      ".br-xl": {
        "height": "6.25rem"
      },
      ".center": {
        "justify-content": "center",
        "text-align": "center",
        "margin": "0 auto"
      },
      ".row": {
        "display": "flex",
        "flex-direction": "row",
        "align-items": "center"
      },
      ".col": {
        "display": "flex",
        "flex-direction": "column",
        "align-items": "center"
      },
      ".flex": {
        "display": "flex"
      }
    }
  },
  "elements": {
    "type": "UTILITIES",
    "data": {
      ".btn": {
        "width": "fit-content",
        "padding": "var(--padding) calc(var(--padding) * 3)",
        "color": "var(--fg-a)",
        "background": "var(--bg-b)",
        "outline": "1px solid var(--bg-b)",
        "border": "none",
        "border-radius": "var(--radius)",
        "box-shadow": "var(--shadow-sm)",
        "transition": "0.1s ease-out"
      }
    }
  },
  "theme": {
    "type": "CUSTOM_PROPERTIES",
    "data": {
      "--theme-a": "#57b1ff",
      "--theme-b": "#ffcc8b",
      "--theme-c": "#ff8ba9",
      "--always-dark": "#0b0e11",
      "--dark-a": "#0b0b11",
      "--dark-b": "#15161d",
      "--dark-c": "#1f202d",
      "--dark-d": "#353746",
      "--dark-e": "#474a5b",
      "--light-a": "#ffffff",
      "--light-b": "#dfe1e9",
      "--light-c": "#babeca",
      "--light-d": "#777d8f",
      "--light-e": "#5f6377",
      "--bg-a": "light-dark(var(--light-a), var(--dark-a))",
      "--bg-b": "light-dark(var(--light-b), var(--dark-b))",
      "--bg-c": "light-dark(var(--light-c), var(--dark-c))",
      "--bg-d": "light-dark(var(--light-d), var(--dark-d))",
      "--bg-e": "light-dark(var(--light-e), var(--dark-e))",
      "--fg-a": "light-dark(var(--dark-a), var(--light-a))",
      "--fg-b": "light-dark(var(--dark-b), var(--light-b))",
      "--fg-c": "light-dark(var(--dark-c), var(--light-c))",
      "--fg-d": "light-dark(var(--dark-d), var(--light-d))",
      "--fg-e": "light-dark(var(--dark-e), var(--light-e))"
    }
  },
  "animations": {
    "type": "CUSTOM_PROPERTIES",
    "data": {
      "--quint-out": "cubic-bezier(0.23, 1, 0.32, 1)",
      "--out": "cubic-bezier(0.19, 1, 0.78, 1)"
    }
  },
  "app": {
    "type": "CUSTOM_PROPERTIES",
    "data": {
      "--bg-ab": "color-mix(in lab, var(--bg-a), var(--bg-b) 20%)",
      "--shadow-lightness": "0.33"
    }
  }
} as const satisfies TokenMap