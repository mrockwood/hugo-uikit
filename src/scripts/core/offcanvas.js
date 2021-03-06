import Modal from '../mixin/modal';
import {$, addClass, append, css, hasClass, height, isTouch, removeClass, trigger, unwrap, wrapAll} from 'uikit-util';

export default {

    mixins: [Modal],

    args: 'mode',

    props: {
        mode: String,
        flip: Boolean,
        overlay: Boolean
    },

    data: {
        mode: 'slide',
        flip: false,
        overlay: false,
        clsPage: 'c-offcanvas-page',
        clsContainer: 'c-offcanvas-container',
        selPanel: '.c-offcanvas-bar',
        clsFlip: 'c-offcanvas-flip',
        clsContainerAnimation: 'c-offcanvas-container-animation',
        clsSidebarAnimation: 'c-offcanvas-bar-animation',
        clsMode: 'c-offcanvas',
        clsOverlay: 'c-offcanvas-overlay',
        selClose: '.c-offcanvas-close'
    },

    computed: {

        clsFlip({flip, clsFlip}) {
            return flip ? clsFlip : '';
        },

        clsOverlay({overlay, clsOverlay}) {
            return overlay ? clsOverlay : '';
        },

        clsMode({mode, clsMode}) {
            return `${clsMode}-${mode}`;
        },

        clsSidebarAnimation({mode, clsSidebarAnimation}) {
            return mode === 'none' || mode === 'reveal' ? '' : clsSidebarAnimation;
        },

        clsContainerAnimation({mode, clsContainerAnimation}) {
            return mode !== 'push' && mode !== 'reveal' ? '' : clsContainerAnimation;
        },

        transitionElement({mode}) {
            return mode === 'reveal' ? this.panel.parentNode : this.panel;
        }

    },

    events: [

        {

            name: 'click',

            delegate() {
                return 'a[href^="#"]';
            },

            handler({current}) {
                if (current.hash && $(current.hash, document.body)) {
                    this.hide();
                }
            }

        },

        {
            name: 'touchstart',

            el() {
                return this.panel;
            },

            handler({targetTouches}) {

                if (targetTouches.length === 1) {
                    this.clientY = targetTouches[0].clientY;
                }

            }

        },

        {
            name: 'touchmove',

            self: true,
            passive: false,

            filter() {
                return this.overlay;
            },

            handler(e) {
                e.preventDefault();
            }

        },

        {
            name: 'touchmove',

            passive: false,

            el() {
                return this.panel;
            },

            handler(e) {

                if (e.targetTouches.length !== 1) {
                    return;
                }

                const clientY = event.targetTouches[0].clientY - this.clientY;
                const {scrollTop, scrollHeight, clientHeight} = this.panel;

                if (scrollTop === 0 && clientY > 0
                    || scrollHeight - scrollTop <= clientHeight && clientY < 0
                ) {
                    e.preventDefault();
                }

            }

        },

        {
            name: 'show',

            self: true,

            handler() {

                if (this.mode === 'reveal' && !hasClass(this.panel.parentNode, this.clsMode)) {
                    wrapAll(this.panel, '<div>');
                    addClass(this.panel.parentNode, this.clsMode);
                }

                css(document.documentElement, 'overflowY', this.overlay ? 'hidden' : '');
                addClass(document.body, this.clsContainer, this.clsFlip);
                height(document.body); // force reflow
                addClass(document.body, this.clsContainerAnimation);
                addClass(this.panel, this.clsSidebarAnimation, this.mode !== 'reveal' ? this.clsMode : '');
                addClass(this.$el, this.clsOverlay);
                css(this.$el, 'display', 'block');
                height(this.$el); // force reflow

                this.clsContainerAnimation && suppressUserScale();

            }
        },

        {
            name: 'hide',

            self: true,

            handler() {
                removeClass(document.body, this.clsContainerAnimation);

                const active = this.getActive();
                if (this.mode === 'none' || active && active !== this && active !== this.prev) {
                    trigger(this.panel, 'transitionend');
                }
            }
        },

        {
            name: 'hidden',

            self: true,

            handler() {

                this.clsContainerAnimation && resumeUserScale();

                if (this.mode === 'reveal') {
                    unwrap(this.panel);
                }

                removeClass(this.panel, this.clsSidebarAnimation, this.clsMode);
                removeClass(this.$el, this.clsOverlay);
                css(this.$el, 'display', '');
                removeClass(document.body, this.clsContainer, this.clsFlip);

                css(document.documentElement, 'overflowY', '');

            }
        },

        {
            name: 'swipeLeft swipeRight',

            handler(e) {

                if (this.isToggled() && isTouch(e) && e.type === 'swipeLeft' ^ this.flip) {
                    this.hide();
                }

            }
        }

    ]

};

// Chrome in responsive mode zooms page upon opening offcanvas
function suppressUserScale() {
    getViewport().content += ',user-scalable=0';
}

function resumeUserScale() {
    const viewport = getViewport();
    viewport.content = viewport.content.replace(/,user-scalable=0$/, '');
}

function getViewport() {
    return $('meta[name="viewport"]', document.head) || append(document.head, '<meta name="viewport">');
}
