module.exports = ({file, options, env}) => (
{
  parser: file.extname === '.sss' ? 'sugarss' : false,
  plugins: {    
    'postcss-cssnext' : {},
    'postcss-reporter': {
      clearReportedMessages: true,
      filter: function(message) { return true }
    }
  }
})