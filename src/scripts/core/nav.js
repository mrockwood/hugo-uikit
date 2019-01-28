import Accordion from './accordion';

export default {

    extends: Accordion,

    data: {
        targets: '> .c-parent',
        toggle: '> a',
        content: '> ul'
    }

};
