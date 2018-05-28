const bgColor = '#133c74';

const ConsultarUrlConsulta = (urlConsulta, callback) => {
    fetch('https://raw.githubusercontent.com/fergthh/surfac/master/muestrasDBURL.json')
                .then((response) => response.json())
                .then((responseJson) => {
                    callback(fetch(responseJson[0].url + urlConsulta));
                })
}

const Consultar = (urlConsulta, callback) => {
    ConsultarUrlConsulta(urlConsulta, callback);
}

export default {
    bgColor,
    ConsultarUrlConsulta,
    Consultar
};