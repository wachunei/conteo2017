import {
  COLOR_MG,
  COLOR_NAU,
  COLOR_SDD,
  COLOR_CRECER,
  COLOR_CRECER_ALT,
  COLOR_IA,
  COLOR_IND,
  COLOR_JJCC,
} from './movementColors.js';

export const defaultChartsOptions = {
  responsive: true,
  legend: {
    display: false,
  },
  tooltips: {
    callbacks: {
      label: function (tooltipItem, data) {
        let val = data.datasets[tooltipItem.datasetIndex]
          .data[tooltipItem.index];
        let lab = data.labels[tooltipItem.index];
        return `${lab}: ${val}%`;
      },
    },
  },
};

export const defaultPolarChartsOptions = {
  responsive: true,
  legend: {
    display: false,
  },
  tooltips: {
    callbacks: {
      label: function (tooltipItem, data) {
        let val = data.datasets[tooltipItem.datasetIndex]
          .data[tooltipItem.index];
        let lab = data.labels[tooltipItem.index];
        return `${lab}: ${val}`;
      },
    },
  },
};

export function listaDefaultData() {
  return {
    labels: ['1a', 'Crecer', 'NAU', 'Solidaridad'],
    datasets: [
      {
        data: [25, 25, 25, 25],
        backgroundColor: [
          COLOR_MG,
          COLOR_CRECER,
          COLOR_NAU,
          COLOR_SDD,
        ],
      },
    ],
  };
};

export function supDefaultData() {
  return {
    labels: [
      'J. Palma', 'D. Pinto', 'JP. Gonzalez', 'J. Aragón', 'J. Echaurren',
    ],
    datasets: [
      {
        data: [20, 20, 20, 20, 20],
        backgroundColor: [
          COLOR_MG,
          COLOR_CRECER,
          COLOR_NAU,
          COLOR_IA,
          COLOR_SDD,
        ],
      },
    ],
  };
};

export function terriDefaultData() {
  return {
      labels: [
      'MG',
      'Crecer',
      'NAU',
      'Solidaridad',
      'Independiente',
      'Izquierda Autónoma',
      'JJCC UC',
    ],
      datasets: [
        {
          data: [0, 0, 0, 0, 0, 0, 0],
          backgroundColor: [
            COLOR_MG,
            COLOR_CRECER_ALT,
            COLOR_NAU,
            COLOR_SDD,
            COLOR_IND,
            COLOR_IA,
            COLOR_JJCC,
          ],
        },
      ],
    };
};
