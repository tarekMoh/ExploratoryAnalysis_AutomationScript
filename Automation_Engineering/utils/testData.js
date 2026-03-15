/**
 * testData.js – centralised test constants.
 * Update these values without touching any test file.
 */

const SITE = {
  baseURL: 'https://www.skoda-parts.com',
};

const MODELS = {
  octavia3: { name: 'Octavia 3', slug: 'octavia-3' },
  fabia3:   { name: 'Fabia 3',   slug: 'fabia-3'   },
  kodiaq:   { name: 'Kodiaq',    slug: 'kodiaq'     },
};

const PRODUCTS = {
  oilFilter: {
    slug: '04e115561ac-oil-filter-1-0mpi-1-0tsi-1-5tsi-skoda-19639.html',
    title: 'Oil Filter 1.0MPI, 1.0TSI - 1.5TSI',
    partNumber: '04E 115 561 AC',
    minAlternatives: 4,
  },
};

const CATEGORIES = {
  filters: {
    path: '/catalog/octavia-3/service-interval-parts/filters-628.html',
    minProducts: 5,
  },
  brakes: {
    path: '/catalog/octavia-3/spare-parts/brake-system-11.html',
    minProducts: 1,
  },
};

const SEARCH = {
  validKeyword:   'oil filter',
  modelKeyword:   'air filter',
  model:          'Octavia 3',
  noResultsQuery: 'xyznonexistentpart12345',
};

module.exports = { SITE, MODELS, PRODUCTS, CATEGORIES, SEARCH };
