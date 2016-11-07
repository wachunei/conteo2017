import {
  COLOR_MG,
  COLOR_NAU,
  COLOR_SDD,
  COLOR_MAPAU,
  COLOR_ANIM,
  COLOR_TDI_COLL,
  COLOR_EL_P,
  COLOR_TDI_CAI,
  COLOR_CACO,
  COLOR_SPCH,
  COLOR_JSF,
  COLOR_CLMUN,
  COLOR_PROY,
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

export function listaDefaultData() {
  return {
    labels: ['NAU', 'Solidaridad'],
    datasets: [
      {
        data: [50, 50],
        backgroundColor: [
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
      'J. Palma', 'J. Echaurren',
    ],
    datasets: [
      {
        data: [50, 50],
        backgroundColor: [
          COLOR_MG,
          COLOR_SDD,
        ],
      },
    ],
  };
};

export function projectsDefaultData() {
  return {
      labels: [
      'MAPAU',
      'Animalia',
      'TDI College',
      'El PUClítico',
      'TDI CAi',
      'Caconociéndonos',
      'Servidores para Chile',
      'Jóvenes sin Fronteras',
      'Modelo Naciones Unidas',
      'Proyecta',
    ],
      datasets: [
        {
          data: [10, 10, 10, 10, 10, 10, 10, 10, 10, 10],
          backgroundColor: [
            COLOR_MAPAU,
            COLOR_ANIM,
            COLOR_TDI_COLL,
            COLOR_EL_P,
            COLOR_TDI_CAI,
            COLOR_CACO,
            COLOR_SPCH,
            COLOR_JSF,
            COLOR_CLMUN,
            COLOR_PROY,
          ],
        },
      ],
    };
};
