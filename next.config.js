module.exports = {
  async headers() {
    return [
      {
        source: '/api/link-preview',
        headers: [
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type',
          },
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'OPTIONS, POST, GET',
          },
        ],
      },
    ]
  },
}