import Vue from 'vue';

import Container from '../components/container.vue';

function init() {
    new Vue({ // eslint-disable-line no-new
        el: '#container',
        render(createElement) {
            return createElement(Container);
        },
    });
}

init();
