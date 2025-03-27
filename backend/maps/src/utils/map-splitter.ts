import path from 'path'
import fs from 'fs'

export const run = () => {
    
    const mapPath = path.join(__dirname, '../../public/map1.json')
    console.log("map:", mapPath)
    
    fs.readFile(mapPath, 'utf-8', (err, data) => {
        if (err) throw err
    
        const res = JSON.parse(data)
        
        const templates: Set<string> = new Set()
        const tilesets: Set<string> = new Set()

        // first check those because they are found right away (before templates)
        res?.tilesets.forEach((tileset: any) => tilesets.add(tileset?.source))
        console.log("tilesets:", tilesets)
        //! also check within each tsx file if the image source is included in the files uploaded
        
        // Group layers by type or class name
        const groupedLayers: Record<string, any[]> = {}
        res?.layers?.forEach((obj: any) => {
            const key = obj?.name || "other"
            if (!groupedLayers[key]) {
                groupedLayers[key] = []
            }
            groupedLayers[key].push(obj)
            
            // Traverse nested layers and objects to collect templates
            if (obj?.layers) {
                obj.layers.forEach((layer: any) => {
                    if (layer?.objects) {
                        layer.objects.forEach((object: any) => {
                            if (object?.template) {
                                templates.add(object.template)
                            }
                        })
                    }
                })
            }
        })

        console.log("templates:", templates)
        
        // Write each group to a separate file
        Object.entries(groupedLayers).forEach(([key, layers]) => {
            const filePath = path.join(__dirname, `${key}.json`)
            fs.writeFile(filePath, JSON.stringify(layers, null, 2), (err) => {
                if (err) throw err
                console.log(`${key} file has been created`)
            })
        })
    })   
}