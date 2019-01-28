/* global UIkit */
import {on} from './util/event';
import {css} from './util/style';
import {ucfirst} from './util/lang';
import {prepend} from './util/dom';
import {addClass, removeClass} from './util/class';
import {fastdom} from './util/fastdom';

const storage = window.sessionStorage;
const key = '_uikit_style';
const docEl = document.documentElement;

// try to load themes.json
const request = new XMLHttpRequest();
request.open('GET', '/themes.json', false);
request.send(null);

const themes = request.status === 200 ? JSON.parse(request.responseText) : {};
const styles = {
    core: {css: '/stylesheets/app.css'}
};

for (const theme in themes) {
    styles[theme] = themes[theme];
}

storage[key] = storage[key] || 'core';

const style = styles[storage[key]] || styles.theme;

on(window, 'load', () => setTimeout(() => fastdom.write(() => {

    const $container = prepend(document.getElementById("js-theme"), `
        <select class="c-select c-form-width-small" id="js-switcher">
            ${Object.keys(styles).map(style => `<option value="${style}">${ucfirst(style)}</option>`).join('')}
        </select>
    `);

    const $styles = document.getElementById("js-switcher");

    // Styles
    // ------------------------------

    if (storage[key]) {
        addClass(docEl, styles[storage[key]].class);
    }

    on($styles, 'change', () => {

        storage[key] = $styles.value;

        removeClass(docEl, [
            't-uofuhealth',
            't-huntsman'
        ]);

        addClass(docEl, styles[storage[key]].class);

    });

    $styles.value = storage[key];

}), 100));

function getParam(name) {
    const match = new RegExp(`[?&]${name}=([^&]*)`).exec(window.location.search);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}

console.log(`docs.theme.js has loaded!`)
