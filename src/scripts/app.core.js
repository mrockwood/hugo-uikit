// Pass CSS Custom Properties to JavaScript
const styles = window.styles = getComputedStyle(document.documentElement);

import boot from './api/boot';
import UIkit from './api/index';
import core from './core/index';

core(UIkit);

import Countdown from './components/countdown';
import Filter from './components/filter';
import Lightbox from './components/lightbox';
import lightboxPanel from './components/lightbox-panel';
import Notification from './components/notification';
import Parallax from './components/parallax';
import Slider from './components/slider';
import SliderParallax from './components/slider-parallax';
import Slideshow from './components/slideshow';
import Sortable from './components/sortable';
import Tooltip from './components/tooltip';
import Upload from './components/upload';

//UIkit.version = VERSION;

UIkit.component('countdown', Countdown);
UIkit.component('filter', Filter);
UIkit.component('lightbox', Lightbox);
UIkit.component('lightboxPanel', lightboxPanel);
UIkit.component('notification', Notification);
UIkit.component('parallax', Parallax);
UIkit.component('slider', Slider);
UIkit.component('sliderParallax', SliderParallax);
UIkit.component('slideshow', Slideshow);
UIkit.component('slideshowParallax', SliderParallax);
UIkit.component('sortable', Sortable);
UIkit.component('tooltip', Tooltip);
UIkit.component('upload', Upload);

boot(UIkit);

window.UIkit = UIkit;

export default UIkit;

console.log(`app.core.js has loaded!`)
