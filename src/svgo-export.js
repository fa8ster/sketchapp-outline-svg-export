import sketch from 'sketch'
const { execSync } = require('@skpm/child_process')
const { toArray } = require('util')
const UI = require('sketch/ui')

// The SVGO options are based on our experience working with Sketch's exported SVGs, and
// to the best of our knowledge they shouldn't effect the rendering of your assets, just reduce
// their size.
function optimizeFilesWithSVGO(svgPaths, svgoPath) {
  return execSync(
    `${svgoPath} --pretty --disable=convertShapeToPath --enable=removeTitle ` +
      '--enable=removeDesc --enable=removeDoctype --enable=removeEmptyAttrs ' +
      '--enable=removeUnknownsAndDefaults --enable=removeUnusedNS --enable=removeEditorsNSData ' +
      `"${svgPaths.join('" "')}"`
  )
}

export function onExportSlices(context) {
  // find all exported SVGs
  const exportRequests = toArray(context.actionContext.exports)
  const svgPaths = exportRequests
    .filter(currentExport => currentExport.request.format() == 'svg')
    .map(currentExport => String(currentExport.path))

  if (svgPaths.length === 0) {
    return
  }

  const targetDesc = `${svgPaths.length} SVG file${
    svgPaths.length == 1 ? '' : 's'
  }`
  UI.message(`Compressing ${targetDesc}`)
  
  // svgo is installed installed in the Resources folder of our plugin so we need to get it
  // from there
  const svgoPath = context.plugin
    .urlForResourceNamed('node_modules/svgo/bin/svgo')
    .path()
  const success = optimizeFilesWithSVGO(svgPaths, svgoPath)

  // Finally, make some noise to let the user know that we're done, and if everything went
  // according to plan. The compression can take a while if you're exporting many assets,
  // so it's a nice touch :-)
  const resultDesc = success ? 'Compressed' : 'Something went wrong compressing'
  UI.message(`${resultDesc} ${targetDesc}`)
  playSystemSound(success ? 'Glass' : 'Basso')
  
  // Utility function to play a given system sound.
  function playSystemSound(sound) {
    // The command line tool `afplay` does what we need - we just have to call it with the full path
    // of a system sound.
    return execSync(`/usr/bin/afplay /System/Library/Sounds/${sound}.aiff`)
  }
}
