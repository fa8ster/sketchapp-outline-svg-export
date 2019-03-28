const sketch = require('sketch')
const document = sketch.getSelectedDocument()
const selectedPage = document.selectedPage
const nativeLayers = selectedPage.sketchObject.children()

export default function(context) { 
    const doc = sketch.getSelectedDocument()

    var textLayers = []
    var outlinedLayers = []

    nativeLayers.forEach(nativelayer => {
        const layer = sketch.fromNative(nativelayer)

        if (layer.type ==  'Text') {
            layer.hidden = true

            var outlinedLayer = layer.duplicate()
            outlinedLayer.hidden = false

            outlinedLayer.selected = true
            context.document.actionsController().actionForID('MSConvertToOutlinesAction').doPerformAction(nil)

            textLayers.push(layer)
            outlinedLayers.push(outlinedLayer)
        }
    })

/*
    // export svg
    context.document.actionsController().actionForID('MSExportAction').doPerformAction(nil)

    // show text layers
    textLayers.forEach(layer => {
        layer.hidden = false
    })

    // remove dublicatedLayers
    outlinedLayers.forEach(layer => {
        layer.remove()
    })

    // clear array
    textLayers = []
    outlinedLayers = []
*/
}