const { build } = require('esbuild');
const fs = require('fs-extra');

const generateBuild = async () => {
  await fs.rmdirSync('./build/static', { recursive: true });

  await build({
    entryPoints: ['./src/index.jsx'],
    outdir: './build/static/js',
    minify: true,
    bundle: true,
    sourcemap: true,
    target: ['chrome58', 'firefox57', 'edge16'],
    loader: { ".svg": "dataurl", ".png": "dataurl" },
    define: {
      'process.env.NODE_ENV': "'production'",
      ...your env variables...,
    }
  }).catch(() => process.exit(1));

  await fs.move('./build/static/js/index.css', './build/static/css/index.css', (err) => {
    if (err) return console.error(err);
    console.log("success!");
    return null;
    }
  );
};

generateBuild();