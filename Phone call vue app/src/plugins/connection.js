import ConnectorService from '../services/connector.service';

export default {
    install(Vue) {
        Vue.prototype.$conn = ConnectorService;
    }
};