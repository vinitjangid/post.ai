module.exports = {
  onPreBuild: ({ utils }) => {
    console.log('Starting Netlify build...');
    console.log('Node version:', process.version);
    console.log('NPM version:', utils.run.command('npm --version').stdout.trim());
    console.log('Environment variables:', Object.keys(process.env).filter(key => key.startsWith('REACT_APP')));
  },
  onBuild: ({ utils }) => {
    console.log('Build completed successfully!');
  },
  onError: ({ error, utils }) => {
    console.log('Build failed with error:', error);
  }
}
