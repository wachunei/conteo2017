import $ from 'jquery';
import Chart from 'chart.js';
import { getData, defaultObject } from './dataFetcher.js';
import rivets from 'rivets';
import _ from 'underscore';

import {
  defaultChartsOptions,
  defaultPolarChartsOptions,
  listaDefaultData,
  supDefaultData,
  terriDefaultData,
} from './chartVars.js';

// Chat.js global configuration
Chart.defaults.global.elements.arc.borderWidth = 2;
Chart.defaults.global.elements.arc.borderColor = '#ddd';

const UPDATE_TIME = 60000;

$(document).ready(() => {

  $('#refresh-notification button').click(function (e) {
    $(this).parents('#refresh-notification').fadeOut();
  });

  setTimeout(function () {$('.notification button').click();}, 5000);

  let mainData;

  let $ctxTotalLista = $('#total-lista');
  let $ctxTotalSup = $('#total-sup');
  let $ctxMesaLista = $('#mesa-lista');
  let $ctxMesaSup = $('#mesa-sup');
  let $ctxTerriLista = $('#terri-lista');
  let $ctxTerriSup = $('#terri-sup');
  let $ctxCantTerri = $('#consejo');

  let chartTotalLista = new Chart($ctxTotalLista, {
      type: 'pie',
      data: listaDefaultData(),
      options: defaultChartsOptions,
    });
  let chartTotalSup = new Chart($ctxTotalSup, {
      type: 'pie',
      data: supDefaultData(),
      options: defaultChartsOptions,
    });
  let chartMesaLista = new Chart($ctxMesaLista, {
      type: 'pie',
      data: listaDefaultData(),
      options: defaultChartsOptions,
    });
  let chartMesaSup = new Chart($ctxMesaSup, {
      type: 'pie',
      data: supDefaultData(),
      options: defaultChartsOptions,
    });
  let chartTerriLista = new Chart($ctxTerriLista, {
      type: 'pie',
      data: listaDefaultData(),
      options: defaultChartsOptions,
    });
  let chartTerriSup = new Chart($ctxTerriSup, {
      type: 'pie',
      data: supDefaultData(),
      options: defaultChartsOptions,
    });
  let chartCantTerri = new Chart($ctxCantTerri, {
      type: 'polarArea',
      data: terriDefaultData(),
      options: defaultPolarChartsOptions,
    });

  let summaryLista = _.extend({}, defaultObject);
  let summarySup = _.extend({}, defaultObject);
  let totalLista = _.extend({}, defaultObject);
  let totalSup = _.extend({}, defaultObject);
  let mesaLista = _.extend({}, defaultObject);
  let mesaSup = _.extend({}, defaultObject);
  let terriLista = _.extend({}, defaultObject);
  let terriSup = _.extend({}, defaultObject);
  let territoriales = {};
  let cantidadTerritoriales = {};
  let participacion = { terris: [] };
  let mesasEscrutadas = { mesas: [], actual: 0, total: 80 };

  rivets.binders.width = function (el, value) {
    el.style.width = `${value}%`;
  };

  rivets.binders.addclass = function (el, value) {
    if (el.addedClass) {
      $(el).removeClass(el.addedClass);
      delete el.addedClass;
    }

    if (value) {
      $(el).addClass(value);
      el.addedClass = value;
    }
  };

  rivets.bind($('#bind-summary-lista'), summaryLista);
  rivets.bind($('#bind-summary-sup'), summarySup);
  rivets.bind($('#bind-total-lista'), totalLista);
  rivets.bind($('#bind-total-sup'), totalSup);
  rivets.bind($('#bind-mesa-lista'), mesaLista);
  rivets.bind($('#bind-mesa-sup'), mesaSup);
  rivets.bind($('#bind-terri-sup'), terriSup);
  rivets.bind($('#bind-terri-lista'), terriLista);
  rivets.bind($('#bind-terris'), territoriales);
  rivets.bind($('#bind-terris-dist'), cantidadTerritoriales);
  rivets.bind($('#bind-mesas'), mesasEscrutadas);
  rivets.bind($('#bind-participacion'), participacion);

  $(document).on(
    'change',
    'input[name=total-dia]',
    () => { if (mainData) { updateMainDataElements('total'); } }
  );

  $(document).on(
    'change',
    'input[name=mesa-dia], form[name=selected-mesa] select',
    () => { if (mainData) { updateMainDataElements('mesa'); } }
  );

  $(document).on(
    'change',
    'input[name=terri-dia], form[name=selected-terri] select',
    () => { if (mainData) { updateMainDataElements('terri'); } });

  let $updateNotif = $('.update-notif');

  function renderData() {
    $updateNotif.text('Actualizando…');
    getData()
      .then((object) => {
        let now = new Date();
        $updateNotif.text(
          `Actualizado a las ${now.getHours()}:${now.getMinutes()}`
        );
        mainData = object;
        updateMainDataElements('getData');
      })
      .catch((a) => {
        $updateNotif.text(
          `Error al actualizar`
        );
        console.log(a)
      });
  };

  renderData();

  setInterval(renderData, UPDATE_TIME);

  const updateMainDataElements = (sender) => {
    let diaTotal = $('input[name=total-dia]:checked').val();
    let diaMesa = $('input[name=mesa-dia]:checked').val();
    let diaTerri = $('input[name=terri-dia]:checked').val();

    let selectedMesa = $('form[name=selected-mesa] select').val();
    let selectedTerri = $('form[name=selected-terri] select').val();

    if (sender === 'getData') {
      summaryLista = _.extendOwn(summaryLista, mainData.total.lista.total);
      summarySup = _.extendOwn(summarySup, mainData.total.sup.total);

      _.each(mainData.terris, function (terri) {
        terri.sort((a, b) => b.pc - a.pc);
      });

      territoriales.terris = _.clone(mainData.terris);
      cantidadTerritoriales = _.extend(cantidadTerritoriales, mainData.totalct);

      chartCantTerri.data.datasets[0].data =
        _.chain(cantidadTerritoriales)
        .pick('mg', 'crecer', 'nau', 'sdd', 'ind', 'ia', 'jjcc')
        .values()
        .map(Number)
        .value();
      chartCantTerri.update();

      let escrutadasActual = 0;
      mesasEscrutadas.mesas = [];
      _.each(mainData.total.lista.mesa, (mesa) => {
        mesasEscrutadas.mesas.push({
          id: mesa.id,
          name: mesa.name,
          dia1: mainData.dia1.lista.mesa[mesa.id].escrutada,
          dia2: mainData.dia2.lista.mesa[mesa.id].escrutada,
        });

        if (mainData.dia1.lista.mesa[mesa.id].escrutada) {
          escrutadasActual++;
        }

        if (mainData.dia2.lista.mesa[mesa.id].escrutada) {
          escrutadasActual++;
        }
      });

      mesasEscrutadas.actual = escrutadasActual;
    }

    if (sender !== 'mesa' && sender !== 'terri') {
      totalLista = _.extendOwn(totalLista, mainData[diaTotal].lista.total);
      totalSup = _.extendOwn(totalSup, mainData[diaTotal].sup.total);

      let newTotalListaData = _.chain(totalLista)
        .pick('mgpc', 'crecerpc', 'naupc', 'sddpc')
        .map(parseFloat).value();
      if (_.any(newTotalListaData, (n) => n > 0)) {
        chartTotalLista.data.datasets[0].data = newTotalListaData;
        chartTotalLista.update();
      } else {
        chartTotalLista.data.datasets[0].data = [25, 25, 25, 25];
        chartTotalLista.update();
      }

      let newTotalSupData = _.chain(totalSup)
        .pick('mgpc', 'crecerpc', 'naupc', 'iapc', 'sddpc')
        .map(parseFloat).value();
      if (_.any(newTotalSupData, (n) => n > 0)) {
        chartTotalSup.data.datasets[0].data = newTotalSupData;
        chartTotalSup.update();
      } else {
        chartTotalSup.data.datasets[0].data = [20, 20, 20, 20, 20];
        chartTotalSup.update();
      }
    }

    if (sender !== 'total' && sender !== 'terri') {
      mesaLista = _.extendOwn(
        mesaLista,
        mainData[diaMesa].lista.mesa[selectedMesa]
      );

      mesaSup = _.extendOwn(
        mesaSup,
        mainData[diaMesa].sup.mesa[selectedMesa]
      );

      let newMesaListaData = _.chain(mesaLista)
        .pick('mgpc', 'crecerpc', 'naupc', 'sddpc')
        .map(parseFloat).value();
      if (_.any(newMesaListaData, (n) => n > 0)) {
        chartMesaLista.data.datasets[0].data = newMesaListaData;
        chartMesaLista.update();
      } else {
        chartMesaLista.data.datasets[0].data = [25, 25, 25, 25];
        chartMesaLista.update();
      }

      let newMesaSupData = _.chain(mesaSup)
        .pick('mgpc', 'crecerpc', 'naupc', 'iapc', 'sddpc')
        .map(parseFloat).value();
      if (_.any(newMesaSupData, (n) => n > 0)) {
        chartMesaSup.data.datasets[0].data = newMesaSupData;
        chartMesaSup.update();
      } else {
        chartMesaSup.data.datasets[0].data = [20, 20, 20, 20, 20];
        chartMesaSup.update();
      }
    }

    if (sender !== 'total' && sender !== 'mesa') {
      terriLista = _.extendOwn(
        terriLista,
        mainData[diaTerri].lista.terri[selectedTerri]
      );

      terriSup = _.extendOwn(
        terriSup,
        mainData[diaTerri].sup.terri[selectedTerri]
      );

      let newTerriListaData = _.chain(terriLista)
        .pick('mgpc', 'crecerpc', 'naupc', 'sddpc')
        .map(parseFloat).value();
      if (_.any(newTerriListaData, (n) => n > 0)) {
        chartTerriLista.data.datasets[0].data = newTerriListaData;
        chartTerriLista.update();
      } else {
        chartTerriLista.data.datasets[0].data = [25, 25, 25, 25];
        chartTerriLista.update();
      }

      let newTerriSupData = _.chain(terriSup)
        .pick('mgpc', 'crecerpc', 'naupc', 'iapc', 'sddpc')
        .map(parseFloat).value();
      if (_.any(newTerriSupData, (n) => n > 0)) {
        chartTerriSup.data.datasets[0].data = newTerriSupData;
        chartTerriSup.update();
      } else {
        chartTerriSup.data.datasets[0].data = [20, 20, 20, 20, 20];
        chartTerriSup.update();
      }
    }

  };
});
