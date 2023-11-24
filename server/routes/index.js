module.exports = [
  {
    method: 'POST',
    path: '/auth',
    handler: 'auth.count',
    config: {
      policies: [],
      auth: false,
    },
  },
];
