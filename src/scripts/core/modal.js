import Modal from '../mixin/modal';
import {$, addClass, assign, css, hasClass, height, html, isString, on, Promise, removeClass} from 'uikit-util';

export default {

    install,

    mixins: [Modal],

    data: {
        clsPage: 'c-modal-page',
        selPanel: '.c-modal-dialog',
        selClose: '.c-modal-close, .c-modal-close-default, .c-modal-close-outside, .c-modal-close-full'
    },

    events: [

        {
            name: 'show',

            self: true,

            handler() {

                if (hasClass(this.panel, 'c-margin-auto-vertical')) {
                    addClass(this.$el, 'c-flex');
                } else {
                    css(this.$el, 'display', 'block');
                }

                height(this.$el); // force reflow
            }
        },

        {
            name: 'hidden',

            self: true,

            handler() {

                css(this.$el, 'display', '');
                removeClass(this.$el, 'c-flex');

            }
        }

    ]

};

function install (UIkit) {

    UIkit.modal.dialog = function (content, options) {

        const dialog = UIkit.modal(`
            <div class="c-modal">
                <div class="c-modal-dialog">${content}</div>
             </div>
        `, options);

        dialog.show();

        on(dialog.$el, 'hidden', ({target, currentTarget}) => {
            if (target === currentTarget) {
                Promise.resolve(() => dialog.$destroy(true));
            }
        });

        return dialog;
    };

    UIkit.modal.alert = function (message, options) {

        options = assign({bgClose: false, escClose: false, labels: UIkit.modal.labels}, options);

        return new Promise(
            resolve => on(UIkit.modal.dialog(`
                <div class="c-modal-body">${isString(message) ? message : html(message)}</div>
                <div class="c-modal-footer c-text-right">
                    <button class="c-button c-button-primary c-modal-close" autofocus>${options.labels.ok}</button>
                </div>
            `, options).$el, 'hide', resolve)
        );
    };

    UIkit.modal.confirm = function (message, options) {

        options = assign({bgClose: false, escClose: true, labels: UIkit.modal.labels}, options);

        return new Promise((resolve, reject) => {

            const confirm = UIkit.modal.dialog(`
                <form>
                    <div class="c-modal-body">${isString(message) ? message : html(message)}</div>
                    <div class="c-modal-footer c-text-right">
                        <button class="c-button c-button-default c-modal-close" type="button">${options.labels.cancel}</button>
                        <button class="c-button c-button-primary" autofocus>${options.labels.ok}</button>
                    </div>
                </form>
            `, options);

            let resolved = false;

            on(confirm.$el, 'submit', 'form', e => {
                e.preventDefault();
                resolve();
                resolved = true;
                confirm.hide();
            });
            on(confirm.$el, 'hide', () => {
                if (!resolved) {
                    reject();
                }
            });

        });
    };

    UIkit.modal.prompt = function (message, value, options) {

        options = assign({bgClose: false, escClose: true, labels: UIkit.modal.labels}, options);

        return new Promise(resolve => {

            const prompt = UIkit.modal.dialog(`
                    <form class="c-form-stacked">
                        <div class="c-modal-body">
                            <label>${isString(message) ? message : html(message)}</label>
                            <input class="c-input" autofocus>
                        </div>
                        <div class="c-modal-footer c-text-right">
                            <button class="c-button c-button-default c-modal-close" type="button">${options.labels.cancel}</button>
                            <button class="c-button c-button-primary">${options.labels.ok}</button>
                        </div>
                    </form>
                `, options),
                input = $('input', prompt.$el);

            input.value = value;

            let resolved = false;

            on(prompt.$el, 'submit', 'form', e => {
                e.preventDefault();
                resolve(input.value);
                resolved = true;
                prompt.hide();
            });
            on(prompt.$el, 'hide', () => {
                if (!resolved) {
                    resolve(null);
                }
            });

        });
    };

    UIkit.modal.labels = {
        ok: 'Ok',
        cancel: 'Cancel'
    };

}
