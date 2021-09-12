module.exports = {
  async headers() {
    return [
      {
        source: '/api/link-preview',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
        ],
      },
    ]
  },
}