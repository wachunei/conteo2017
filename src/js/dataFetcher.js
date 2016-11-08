'use strict';
import _ from 'underscore';
import 'whatwg-fetch';

const SERVER_URL = 'https://young-retreat-67811.herokuapp.com/';
const SHEET_ID = '1eFW5Ww21HZWbvmlDElfuS2TcLWcCnkY-tGia-goi-NE';
const WSHEET_ID = 'oaqqg8y';
const SHEET_URL = `https://spreadsheets.google.com/feeds/list/${SHEET_ID}` +
                  `/${WSHEET_ID}/public/values?alt=json`;

const g = (obj, prop) => obj[`gsx$${prop}`].$t;

const getFullObject = (obj) => {
  let fullObj = {
    id: g(obj, 'id'),
    name: g(obj, 'name'),
    mg: g(obj, 'mg'),
    mgpc:	g(obj, 'mgpc'),
    nau: g(obj, 'nau'),
    naupc: g(obj, 'naupc'),
    sdd: g(obj, 'sdd'),
    sddpc: g(obj, 'sddpc'),
    b: g(obj, 'b'),
    bpc: g(obj, 'bpc'),
    n: g(obj, 'n'),
    npc: g(obj, 'npc'),
    votosve: g(obj, 'votosve'),
    votos: g(obj, 'votos'),
    escrutada: g(obj, 'escrutada') == 'TRUE',
    participacion: g(obj, 'participacion'),
    mapau: g(obj, 'mapau'),
    mapaupc: g(obj, 'mapaupc'),
    ani: g(obj, 'ani'),
    anipc: g(obj, 'anipc'),
    tdicoll: g(obj, 'tdicoll'),
    tdicollpc: g(obj, 'tdicollpc'),
    elp: g(obj, 'elp'),
    elppc: g(obj, 'elppc'),
    tdicai: g(obj, 'tdicai'),
    tdicaipc: g(obj, 'tdicaipc'),
    caco: g(obj, 'caco'),
    cacopc: g(obj, 'cacopc'),
    spch: g(obj, 'spch'),
    spchpc: g(obj, 'spchpc'),
    jsf: g(obj, 'jsf'),
    jsfpc: g(obj, 'jsfpc'),
    clmun: g(obj, 'clmun'),
    clmunpc: g(obj, 'clmunpc'),
    proy: g(obj, 'proy'),
    proypc: g(obj, 'proypc'),
  };

  return fullObj;
};

const converter = function (sheetObject) {
  let converted = {
    dia1: {
      lista: {
        mesa: {},
        terri: {},
        total: {},
      }, sup: {
        mesa: {},
        terri: {},
        total: {},
      },
      ppto: {
        terri: {},
        total: {},
      },
    },
    dia2: {
      lista: {
        mesa: {},
        terri: {},
        total: {},
      }, sup: {
        mesa: {},
        terri: {},
        total: {},
      },
      ppto: {
        terri: {},
        total: {},
      },
    },
    total: {
      lista: {
        mesa: {},
        terri: {},
        total: {},
      },
      sup: {
        mesa: {},
        terri: {},
        total: {},
      },
      ppto: {
        terri: {},
        total: {},
      },
    },
  };
  let lines =  sheetObject.feed.entry;

  lines.forEach((line) => {
    if (_.contains(['dia1', 'dia2', 'total'], g(line, 'tiempo'))) {
      if (_.contains(['total'], g(line, 'area'))) {
        converted
          [g(line, 'tiempo')]
          [g(line, 'tipo')]
          [g(line, 'area')] = getFullObject(line);
      } else if (!(g(line, 'tipo') === 'ppto' && g(line, 'area') === 'mesa')) {
        converted
          [g(line, 'tiempo')]
          [g(line, 'tipo')]
          [g(line, 'area')]
          [g(line, 'id')] = getFullObject(line);
      }
    }

  });

  return converted;
};

export function getData() {
  return fetch(SHEET_URL)
    .then((response) => response.json())
    .then((object) => {
      let convertPromise = new Promise(function (resolve, reject) {
        resolve(converter(object));
      });

      return convertPromise;
    });
};

export function getServerData() {
  return fetch(SERVER_URL)
    .then((response) => response.json());
}

export const defaultObject = {
  mg: 0,
  mgpc: 0,
  nau: 0,
  naupc: 0,
  sdd: 0,
  sddpc: 0,
  b: 0,
  bpc: 0,
  n: 0,
  npc: 0,
  votosve: 0,
  votos: 0,
  escrutada: false,
  participacion: 0,
  mapau: 0,
  mapaupc: 0,
  ani: 0,
  anipc: 0,
  tdicoll: 0,
  tdicollpc: 0,
  elp: 0,
  elppc: 0,
  tdicai: 0,
  tdicaipc: 0,
  caco: 0,
  cacopc: 0,
  spch: 0,
  spchpc: 0,
  jsf: 0,
  jsfpc: 0,
  clmun: 0,
  clmunpc: 0,
  proy: 0,
  proypc: 0,
};
