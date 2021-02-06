import Axios from "axios";

class ConnectorService {
    constructor($http, $window, StateManagerService, $interval) {
        this._baseUrl = null;
        this._$http = $http;
        this._$window = $window;
        this._$interval = $interval;
    }

    set env(arg) {
        this._baseUrl = process.env.VUE_APP_BASE_URL;
    }

    _doConnect(apiPath, method, data, baseUrl, headers) {
        this.env = window.location.host;

        let baseConfig = {
            headers,
            url: (baseUrl || this._baseUrl) + apiPath,
            method: method,
            data: data,
            ...(!baseUrl)
        }

        return this._$http(baseConfig);
    }

    initiateCall(callInfo) {
        return new Promise((resolve, reject) => {
            let apiPath = `/api/initiate_call`,
                method = "post";

            this._doConnect(apiPath, method, callInfo)
                .then((data) => resolve(data))
                .catch((error) => reject(error));
        });
    }

    getCallStatus(callId) {
        return new Promise((resolve, reject) => {
            let apiPath = `/api/call_status?callId=${callId}`,
                method = "get";

            this._doConnect(apiPath, method)
                .then((data) => resolve(data))
                .catch((error) => reject(error));
        });
    }
}

export default new ConnectorService(Axios, window, {}, setInterval);