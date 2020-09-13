import Vue from 'vue';

import Container from '../components/container.vue';
import Icon from '../components/icon.vue';

import '../css/style.scss';

function init() {
    Vue.mixin({
        components: {
            Icon,
        },
    });

    new Vue({ // eslint-disable-line no-new
        el: '#container',
        render(createElement) {
            return createElement(Container);
        },
    });
}

init();
